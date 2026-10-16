'use client';
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';

export default function ReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { property } = useLiveQuery(() => {
    return {
      property: db.properties.get(params.id),
    };
  }, []);

  const findings = useLiveQuery(() =>
    db.findings.where('status').equals('accepted').toArray()
  );

  if (!property) return <div className="p-6">Loading report...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-0">
      <nav className="no-print p-6 flex justify-between items-center bg-[var(--color-bg)]">
        <button onClick={() => router.back()} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </button>
        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
          <Printer size={18} /> Print PDF
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-12 md:p-24 print:p-0">
        {/* Cover Page */}
        <div className="text-center mb-24 space-y-4 border-b-2 border-black pb-12">
          <h1 className="text-6xl serif mb-4">Inspection Report</h1>
          <p className="text-2xl mono">{property.name}</p>
          <p className="text-lg opacity-70">{property.address}</p>
          <p className="mono text-sm">{property.date}</p>
        </div>

        {/* Urgent Summary */}
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-widest font-bold mb-6 border-b border-black pb-1">
            Urgent Items Summary
          </h2>
          <div className="space-y-4">
            {findings?.filter(f => f.severity === 'urgent').map(f => (
              <div key={f.id} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                <p className="text-lg italic">{f.observation}</p>
              </div>
            ))}
            {findings?.filter(f => f.severity === 'urgent').length === 0 && (
              <p className="italic opacity-50">No urgent items identified.</p>
            )}
          </div>
        </div>

        {/* Detailed Findings */}
        <div className="space-y-12">
          <h2 className="text-sm uppercase tracking-widest font-bold mb-6 border-b border-black pb-1">
            Detailed Findings
          </h2>
          {findings?.map(f => (
            <div key={f.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-100 last:border-0">
              <div className="aspect-video bg-gray-100 rounded-[6px] overflow-hidden border border-black/10">
                <div className="w-full h-full flex items-center justify-center italic text-xs opacity-50">
                  Photo {f.photoId}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-black text-white rounded-sm">
                    {f.severity}
                  </span>
                  <span className="text-xs mono opacity-50">{f.area}</span>
                </div>
                <p className="text-lg serif leading-relaxed">{f.observation}</p>
                <p className="text-sm italic opacity-70">Recommendation: {f.recommendation}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-24 pt-8 border-t border-black/10 text-center">
          <p className="text-xs mono opacity-40 uppercase">
            Draft prepared with AI assistance and reviewed by the inspector. Not a substitute for professional judgment.
          </p>
          <div className="mt-4 flex justify-center gap-8 text-[10px] mono opacity-30">
            <span>Page 1 of 1</span>
            <span>Plumbline v1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
