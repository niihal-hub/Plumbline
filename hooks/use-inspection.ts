import { useState, useEffect } from 'react';
import { db, Property, Area } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useInspection() {
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  const properties = useLiveQuery(() => db.properties.toArray());
  const areas = useLiveQuery(() =>
    activePropertyId
      ? db.areas.where('propertyId').equals(activePropertyId).toArray()
      : []
  );

  async function startInspection(prop: Partial<Property>) {
    const id = await db.properties.add({
      name: prop.name || '',
      address: prop.address || '',
      date: prop.date || '',
      createdAt: Date.now(),
    });
    setActivePropertyId(id.toString());
    return id;
  }

  async function addArea(name: string) {
    if (!activePropertyId) throw new Error('No active property');
    return await db.areas.add({
      propertyId: activePropertyId,
      name,
      order: (areas?.length || 0) + 1,
    });
  }

  return {
    activePropertyId,
    setActivePropertyId,
    properties,
    areas,
    startInspection,
    addArea,
  };
}
