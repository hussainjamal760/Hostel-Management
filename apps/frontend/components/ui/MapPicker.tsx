"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const MapUpdater = dynamic(
  () => import("./MapEvents").then((mod) => mod.MapUpdater),
  { ssr: false }
);
const MapClickHandler = dynamic(
  () => import("./MapEvents").then((mod) => mod.MapClickHandler),
  { ssr: false }
);
const DraggableMarker = dynamic(
    () => import("./MapEvents").then((mod) => mod.DraggableMarker),
    { ssr: false }
);

interface LocationPickerProps {
    coordinates: { lat: number; lng: number };
    onLocationChange: (coords: { lat: number; lng: number }, address?: string) => void;
}

const defaultCenter: [number, number] = [33.6844, 73.0479];

const LocationPicker: React.FC<LocationPickerProps> = ({ coordinates, onLocationChange }) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>(
        coordinates.lat && coordinates.lng 
            ? [coordinates.lat, coordinates.lng] 
            : defaultCenter
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>(markerPosition);
    const [icon, setIcon] = useState<any>(null);

    useEffect(() => {
        import("leaflet").then((L) => {
            const customIcon = new L.Icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            setIcon(customIcon);
        });
    }, []);

    useEffect(() => {
        if (coordinates.lat && coordinates.lng) {
            setMarkerPosition([coordinates.lat, coordinates.lng]);
            setMapCenter([coordinates.lat, coordinates.lng]);
        }
    }, [coordinates]);

    const handlePositionChange = (pos: [number, number]) => {
        setMarkerPosition(pos);
        onLocationChange({ lat: pos[0], lng: pos[1] });
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setMarkerPosition(newPos);
                setMapCenter(newPos);
                onLocationChange({ lat: parseFloat(lat), lng: parseFloat(lon) }, display_name);
            }
        } catch (error) {
            console.error("Search failed:", error);
        }
        setIsSearching(false);
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos: [number, number] = [
                        position.coords.latitude,
                        position.coords.longitude
                    ];
                    setMarkerPosition(newPos);
                    setMapCenter(newPos);
                    onLocationChange({ lat: newPos[0], lng: newPos[1] });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    };

    if (!icon) return <div className="h-[400px] w-full bg-surface-container animate-pulse rounded-2xl"></div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors z-10">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Search for an area, street, or city..."
                        className="w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-surface focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant"
                    />
                </div>
                <div className="flex gap-2">
                  <button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="px-6 py-3.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md tracking-widest uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-outline-variant/30"
                  >
                      {isSearching ? (
                          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">search</span>
                            <span>Find</span>
                          </>
                      )}
                  </button>
                  <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="px-6 py-3.5 rounded-2xl bg-primary text-on-primary font-label-md tracking-widest uppercase hover:bg-primary-container hover:shadow-lg transition-all flex items-center gap-2"
                      title="Use My Current Location"
                  >
                      <span className="material-symbols-outlined text-[20px]">my_location</span>
                      <span className="hidden sm:inline">Current</span>
                  </button>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-outline-variant/50 shadow-sm z-0 relative group">
                <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: "350px", width: "100%", zIndex: 1 }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={mapCenter} />
                    <MapClickHandler onMapClick={handlePositionChange} />
                    <DraggableMarker 
                        position={markerPosition} 
                        onPositionChange={handlePositionChange}
                        icon={icon}
                    />
                </MapContainer>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[24px]">map</span>
                    </div>
                    <div>
                        <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Pin Coordinates</p>
                        <p className="font-mono text-sm font-medium text-primary">
                            {markerPosition[0].toFixed(5)}, {markerPosition[1].toFixed(5)}
                        </p>
                    </div>
                </div>
                <div className="text-xs text-on-surface-variant flex items-center gap-1.5 opacity-80 bg-surface px-3 py-1.5 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-[16px]">touch_app</span>
                    Click or drag marker to refine
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
