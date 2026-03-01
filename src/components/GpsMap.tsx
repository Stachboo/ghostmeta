/**
 * GpsMap — Affiche les coordonnées GPS d'une image sur une carte OpenStreetMap.
 * Utilise Leaflet + react-leaflet (gratuit, pas de clé API).
 * Les tuiles OSM ne reçoivent JAMAIS les coordonnées GPS — seule l'URL de tuile
 * (x/y/zoom) est envoyée. Zéro upload, traitement 100% local.
 *
 * FIX VITE : L'icône par défaut de Leaflet charge des images via require() qui
 * ne fonctionnent pas avec Vite. On utilise L.divIcon avec un SVG inline.
 */

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { formatGPSCoord } from '@/lib/image-processor';

// Fix Leaflet dans un Dialog animé : le MapContainer s'initialise à 0×0
// pendant l'animation d'ouverture. invalidateSize() force le recalcul.
function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

// Marqueur rouge SVG — remplace l'icône PNG par défaut (incompatible Vite)
const redMarkerIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C7.58 0 4 3.58 4 8c0 6 8 18 8 18s8-12 8-18c0-4.42-3.58-8-8-8z"
      fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
    <circle cx="12" cy="8" r="3.5" fill="white" opacity="0.9"/>
  </svg>`,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -38],
  className: '',
});

interface GpsMapProps {
  latitude: number;
  longitude: number;
  filename: string;
}

export default function GpsMap({ latitude, longitude, filename }: GpsMapProps) {
  const latDMS = formatGPSCoord(latitude, true);
  const lonDMS = formatGPSCoord(longitude, false);

  return (
    <div className="space-y-3">
      {/* Coordonnées affichées au-dessus de la carte */}
      <div className="flex items-center gap-3 px-1 font-mono text-xs">
        <span className="text-red-400 font-semibold truncate">{filename}</span>
        <span className="text-zinc-400 shrink-0">{latDMS}, {lonDMS}</span>
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '380px', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={redMarkerIcon}>
          <Popup>
            <div className="text-xs space-y-1">
              <p className="font-semibold text-gray-800 truncate max-w-[180px]">{filename}</p>
              <p className="text-gray-600">{latDMS}</p>
              <p className="text-gray-600">{lonDMS}</p>
            </div>
          </Popup>
        </Marker>
        <MapInvalidator />
      </MapContainer>

      <p className="text-[11px] text-zinc-500 font-mono px-1">
        Tuiles servies par OpenStreetMap · Aucune donnée GPS transmise
      </p>
    </div>
  );
}
