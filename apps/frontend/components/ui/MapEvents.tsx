"use client";

import { useEffect, useRef, useMemo } from "react";
import { useMapEvents, useMap, Marker } from "react-leaflet";
// We don't import L here to avoid side effects if this module is imported on server, 
// though "use client" should protect it. The main issue is L usage.
// We accept icon as prop.

export function DraggableMarker({ position, onPositionChange, icon }: { 
    position: [number, number]; 
    onPositionChange: (pos: [number, number]) => void;
    icon: any; // Leaflet icon instance
}) {
    const markerRef = useRef<any>(null);
    
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker) {
            const latLng = marker.getLatLng();
            onPositionChange([latLng.lat, latLng.lng]);
          }
        },
      }),
      [onPositionChange]
    );
  
    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={icon}
      />
    );
}

export function MapClickHandler({ onMapClick }: { onMapClick: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            onMapClick([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}
