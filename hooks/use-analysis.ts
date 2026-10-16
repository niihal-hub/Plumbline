import { useState } from 'react';
import { db } from '@/lib/db';

export function useAnalysis() {
  const [analyzing, setAnalyzing] = useState<Record<string, boolean>>({});

  async function analyzePhoto(photoId: string, areaId: string, blob: Blob) {
    setAnalyzing(prev => ({ ...prev, [photoId]: true }));
    try {
      const formData = new FormData();
      formData.append('image', blob);
      formData.append('area', areaId);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Analysis failed');

      const finding = await res.json();

      await db.findings.add({
        id: crypto.randomUUID(),
        photoId,
        areaId,
        observation: finding.observation,
        severity: finding.severity,
        recommendation: finding.recommendation,
        confidence: finding.confidence,
        needs_closer_look: finding.needs_closer_look,
        status: 'draft',
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error(`Error analyzing ${photoId}:`, err);
    } finally {
      setAnalyzing(prev => ({ ...prev, [photoId]: false }));
    }
  }

  return { analyzing, analyzePhoto };
}
