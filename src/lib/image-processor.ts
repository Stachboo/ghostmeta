/**
 * GhostMeta Image Processor (Optimized)
 * ─────────────────────────────────────
 * Traitement sécurisé avec gestion mémoire (Max 4K resolution).
 * Évite les crashs sur mobile (iOS/Android) avec les photos > 12MP.
 *
 * PERF : heic2any (~1.2MB) est chargé dynamiquement UNIQUEMENT si un
 * fichier .heic/.heif est détecté. Les visiteurs non-iPhone ne le
 * téléchargent jamais.
 */

import ExifReader from 'exifreader';

// SEUIL DE SÉCURITÉ : Toute image > 4096px sera redimensionnée pour éviter le crash mémoire
const MAX_DIMENSION = 4096;

export interface MetadataInfo {
  gps?: { latitude: number; longitude: number; altitude?: number; };
  dateTime?: string;
  camera?: { make?: string; model?: string; lens?: string; software?: string; };
  dimensions?: { width: number; height: number; };
  raw: Record<string, unknown>;
  threatLevel: 'critical' | 'warning' | 'safe';
  threats: ThreatItem[];
}

export interface ThreatItem {
  type: 'gps' | 'datetime' | 'device' | 'software' | 'serial';
  severity: 'critical' | 'warning' | 'info';
  label: string;
  value: string;
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalName: string;
  originalSize: number;
  cleanedBlob?: Blob;
  cleanedSize?: number;
  previewUrl?: string;
  metadata?: MetadataInfo;
  status: 'pending' | 'scanning' | 'scanned' | 'cleaning' | 'cleaned' | 'error';
  error?: string;
}

/**
 * Génère un ID unique cryptographiquement sécurisé
 * Remplace Math.random() par crypto.randomUUID() pour éviter les collisions
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback pour les navigateurs anciens (rare)
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function formatGPSCoord(coord: number, isLat: boolean): string {
  const dir = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
  const abs = Math.abs(coord);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(1);
  return `${deg}°${min}'${sec}" ${dir}`;
}

export async function extractMetadata(file: File): Promise<MetadataInfo> {
  const buffer = await file.arrayBuffer();
  const threats: ThreatItem[] = [];
  let raw: Record<string, unknown> = {};

  try {
    const tags = ExifReader.load(buffer, { expanded: true });

    if (tags.exif) Object.assign(raw, tags.exif);
    if (tags.iptc) Object.assign(raw, tags.iptc);
    if (tags.xmp) Object.assign(raw, tags.xmp);
    if (tags.gps) Object.assign(raw, tags.gps);

    const metadata: MetadataInfo = {
      raw,
      threatLevel: 'safe',
      threats,
    };

    if (tags.gps?.Latitude && tags.gps?.Longitude) {
      const lat = tags.gps.Latitude;
      const lon = tags.gps.Longitude;
      metadata.gps = { latitude: lat, longitude: lon, altitude: tags.gps?.Altitude };
      threats.push({
        type: 'gps',
        severity: 'critical',
        label: 'Géolocalisation GPS',
        value: `${formatGPSCoord(lat, true)}, ${formatGPSCoord(lon, false)}`,
      });
    }

    const dateTag = tags.exif?.DateTimeOriginal || tags.exif?.DateTime || tags.exif?.DateTimeDigitized;
    if (dateTag) {
      const dateStr = typeof dateTag === 'object' && 'description' in dateTag
        ? (dateTag as { description: string }).description
        : String(dateTag);
      metadata.dateTime = dateStr;
      threats.push({ type: 'datetime', severity: 'warning', label: 'Date de prise de vue', value: dateStr });
    }

    const make = tags.exif?.Make;
    const model = tags.exif?.Model;
    const software = tags.exif?.Software;

    if (make || model || software) {
      const makeStr = make ? String(make['description'] || make) : undefined;
      const modelStr = model ? String(model['description'] || model) : undefined;
      const softStr = software ? String(software['description'] || software) : undefined;

      metadata.camera = { make: makeStr, model: modelStr, software: softStr };
      if (makeStr || modelStr) {
        threats.push({ type: 'device', severity: 'warning', label: 'Appareil', value: [makeStr, modelStr].filter(Boolean).join(' ') });
      }
    }

    if (threats.some(t => t.severity === 'critical')) metadata.threatLevel = 'critical';
    else if (threats.some(t => t.severity === 'warning')) metadata.threatLevel = 'warning';

    return metadata;
  } catch (e) {
    return { raw: {}, threatLevel: 'safe', threats: [] };
  }
}

async function convertHeicToJpeg(file: File): Promise<Blob> {
  try {
    const { default: heic2any } = await import('heic2any');
    const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.90 });
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    throw new Error('Format HEIC non supporté par ce navigateur.');
  }
}

export async function stripMetadata(file: File): Promise<Blob> {
  let sourceFile = file;

  if (isHeicFile(file)) {
    const jpegBlob = await convertHeicToJpeg(file);
    sourceFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(sourceFile);

    const timer = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error('Délai dépassé (Image trop lourde ?)'));
    }, 10000);

    img.onload = () => {
      clearTimeout(timer);
      try {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = width / height;
          if (width > height) {
            width = MAX_DIMENSION;
            height = Math.round(MAX_DIMENSION / ratio);
          } else {
            height = MAX_DIMENSION;
            width = Math.round(MAX_DIMENSION * ratio);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Memoire insuffisante (Canvas)');

        ctx.drawImage(img, 0, 0, width, height);

        const outputType = sourceFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = outputType === 'image/png' ? 1 : 0.92;

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) resolve(blob);
            else reject(new Error('Erreur encodage'));
          },
          outputType,
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      reject(new Error('Fichier image invalide'));
    };

    img.src = url;
  });
}

export function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.heic') || name.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';
}

export function isSupportedImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  const name = file.name.toLowerCase();
  return validTypes.includes(file.type) || /\.(jpg|jpeg|png|webp|heic|heif)$/.test(name);
}

export function createProcessedImage(file: File): ProcessedImage {
  return {
    id: generateId(),
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    status: 'pending',
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 o';
  const k = 1024;
  const sizes = ['o', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
