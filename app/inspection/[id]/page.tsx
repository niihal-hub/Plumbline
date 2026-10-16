'use client';
import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Area } from '@/lib/db';
import { Capture } from '@/components/capture/Capture';
import { Plus, Loader2 } from 'lucide-react';
import { useAnalysis } from '@/hooks/use-analysis';

export default function InspectionPage({ params }: { params: { id: string } }) {
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [areaName, setAreaName] = useState('');
  const { analyzing, analyzePhoto } = useAnalysis();

  const areas = useLiveQuery(() =>
    db.areas.where('propertyId').equals(params.id).toArray()
  );

  const photos = useLiveQuery(() =>
    activeAreaId ? db.photos.where('areaId').equals(activeAreaId).toArray() : []
  );

  const findings = useLiveQuery(() =>
    activeAreaId ? db.findings.where('areaId').equals(activeAreaId).toArray() : []
  );

  useEffect(() => {
    if (!activeAreaId) return;

    // Auto-analyze photos that don't have a finding yet
    photos?.forEach(async (photo) => {
      const hasFinding = findings?.some(f => f.photoId === photo.id);
      if (!hasFinding && !analyzing[photo.id]) {
        const area = areas?.find(a => a.id === activeAreaId);
        if (area) {
          await analyzePhoto(photo.id, area.name, photo.blob);
        }
      }
    });
  }, [photos, findings, activeAreaId, analyzing, areas, analyzePhoto]);

  const handleAddArea = async () => {
    if (!areaName) return;
    const id = await db.areas.add({
      propertyId: params.id,
      name: areaName,
      order: (areas?.length || 0) + 1,
    });
    setActiveAreaId(id.toString());
    setAreaName('');
    setIsAddingArea(false);
  };

  return (
    <div className="p-6 pb-32 min-h-screen">
      <header className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Current Area</p>
          <h2 className="text-3xl serif">
            {areas?.find(a => a.id === activeAreaId)?.name || 'Select an area'}
          </h2>
        </div>
        <button
          onClick={() => setIsAddingArea(true)}
          className="btn-secondary p-2"
        >
          <Plus size={20} />
        </button>
      </header>

      {isAddingArea && (
        <div className="fixed inset-0 bg-[var(--color-bg)] z-50 p-6 flex flex-col justify-center">
          <h3 className="text-2xl serif mb-6">Add Area</h3>
          <input
            autoFocus
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            placeholder="e.g. Kitchen, Attic, Roof"
            className="input-field mb-6"
          />
          <div className="flex gap-4">
            <button onClick={() => setIsAddingArea(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAddArea} className="btn-primary flex-1">Create</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {photos?.map(photo => {
          const isAnalyzing = analyzing[photo.id];
          const finding = findings?.find(f => f.photoId === photo.id);

          return (
            <div key={photo.id} className="aspect-square bg-gray-200 rounded-[6px] overflow-hidden relative group">
              <img
                src={URL.createObjectURL(photo.blob)}
                className="w-full h-full object-cover"
                alt="Inspection capture"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-center text-center">
                  <Loader2 className="animate-spin mb-2" size={24} />
                  <p className="text-xs font-medium">Looking at the photo...</p>
                </div>
              )}
              {finding && (
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 border-2 border-white" title="Analyzed" />
              )}
            </div>
          );
        })}
        {photos?.length === 0 && (
          <div className="col-span-2 py-20 text-center opacity-40">
            <p>No photos yet. Walk the house, we will take notes.</p>
          </div>
        )}
      </div>

      {activeAreaId && <Capture areaId={activeAreaId} />}

      {!activeAreaId && (
        <div className="fixed bottom-0 left-0 right-0 p-6">
          <button
            onClick={() => setIsAddingArea(true)}
            className="btn-primary w-full text-lg"
          >
            Create First Area to Begin
          </button>
        </div>
      )}
    </div>
  );
}
