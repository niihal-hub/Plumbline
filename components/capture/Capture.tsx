import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { db, Photo } from '@/lib/db';
import { Camera, FileUp, Plus } from 'lucide-react';

interface CaptureProps {
  areaId: string;
}

export function Capture({ areaId }: CaptureProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      await db.photos.add({
        id: crypto.randomUUID(),
        areaId,
        blob: new Blob([compressedFile], { type: compressedFile.type }),
        note: '',
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent">
      <div className="flex gap-4 max-w-md mx-auto">
        <button
          onClick={() => document.getElementById('file-input')?.click()}
          className="btn-primary flex-1 justify-center gap-2 text-lg"
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <Camera size={24} />
              Capture
            </>
          )}
        </button>

        <label className="btn-secondary px-4 cursor-pointer">
          <Plus size={24} />
          <input
            id="file-input"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
