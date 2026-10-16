'use client';
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Finding } from '@/lib/db';
import { ChevronLeft, ChevronRight, Check, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const findings = useLiveQuery(() =>
    db.findings.where('status').equals('draft').toArray()
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!findings || findings.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center opacity-60">
        <h2 className="text-2xl serif mb-4">All clear</h2>
        <p className="mb-8">No draft findings to review.</p>
        <button onClick={() => router.push(`/inspection/${params.id}`)} className="btn-secondary">
          Back to Walkthrough
        </button>
      </div>
    );
  }

  const current = findings[currentIndex];
  const progress = ((currentIndex + 1) / findings.length) * 100;

  async function handleAction(status: Finding['status']) {
    await db.findings.update(current.id, { status });
    if (currentIndex < findings.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Update local state to trigger a re-fetch of draft findings
      await db.findings.toArray();
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Plumb Line Signature Detail */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-border)]">
        <div
          className="absolute left-[-2px] w-1 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-300 ease-out"
          style={{ top: `${progress}%`, transform: 'translateY(-50%)' }}
        />
      </div>

      <header className="p-6 flex justify-between items-center">
        <button onClick={() => router.back()} className="btn-secondary p-2">
          <ChevronLeft size={20} />
        </button>
        <div className="text-right">
          <p className="text-xs opacity-50 uppercase tracking-widest">Review Progress</p>
          <p className="mono text-sm">{currentIndex + 1} / {findings.length}</p>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-8 max-w-md mx-auto w-full">
        <div className="aspect-square bg-gray-200 rounded-[6px] overflow-hidden">
          {/* In a real app, we'd fetch the photo blob using the current.photoId */}
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 italic">
            Photo {current.photoId}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `var(--severity-${current.severity})` }}
            />
            <span className="text-sm uppercase tracking-wider font-medium capitalize">
              {current.severity}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs opacity-50 uppercase tracking-widest">Observation</p>
            <p className="text-xl serif leading-relaxed">{current.observation}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs opacity-50 uppercase tracking-widest">Recommendation</p>
            <p className="text-lg opacity-80">{current.recommendation}</p>
          </div>

          {current.needs_closer_look && (
            <div className="flex items-start gap-2 p-3 bg-amber-100/50 rounded-[6px] text-amber-800 text-sm border border-amber-200">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>AI suggests a closer look is needed for this item.</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-4 pb-12">
        <button
          onClick={() => handleAction('discarded')}
          className="btn-secondary flex flex-col items-center gap-2 text-xs opacity-60"
        >
          <Trash2 size={20} /> Discard
        </button>
        <button
          className="btn-secondary flex flex-col items-center gap-2 text-xs"
        >
          <Edit2 size={20} /> Edit
        </button>
        <button
          onClick={() => handleAction('accepted')}
          className="btn-primary flex flex-col items-center gap-2 text-xs"
        >
          <Check size={20} /> Accept
        </button>
      </div>
    </div>
  );
}
