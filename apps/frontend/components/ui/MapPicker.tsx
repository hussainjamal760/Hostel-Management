"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { HiOutlineLocationMarker, HiOutlineSearch } from "react-icons/hi";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
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

    if (!icon) return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl"></div>;

 
    const DraggableMarker = dynamic(
        () => import("./MapEvents").then((mod) => mod.DraggableMarker),
        { ssr: false }
    );

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/40 dark:text-[#fcf2e9]/40" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Search for a location..."
                        className="w-full pl-12 pr-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-5 py-4 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform disabled:opacity-50"
                >
                    {isSearching ? (
                        <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                        <HiOutlineSearch size={20} />
                    )}
                </button>
                <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="px-5 py-4 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <HiOutlineLocationMarker size={20} />
                    <span className="hidden md:inline">My Location</span>
                </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#2c1b13]/10 dark:border-white/10 z-0">
                <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: "400px", width: "100%" }}
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

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10">
                        <HiOutlineLocationMarker className="text-[#2c1b13] dark:text-[#fcf2e9]" size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 font-medium">Selected Coordinates</p>
                        <p className="font-mono text-sm font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                            {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
                        </p>
                    </div>
                </div>
                <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 italic">
                    Click or drag marker to adjust
                </span>
            </div>
        </div>
    );
};

export default LocationPicker;
