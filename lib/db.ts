import Dexie from 'dexie';

export interface Property {
  id: string;
  name: string;
  address: string;
  date: string;
  createdAt: number;
}

export interface Area {
  id: string;
  propertyId: string;
  name: string;
  order: number;
}

export interface Photo {
  id: string;
  areaId: string;
  blob: Blob;
  note: string;
  timestamp: number;
}

export interface Finding {
  id: string;
  photoId: string;
  areaId: string;
  observation: string;
  severity: 'info' | 'monitor' | 'repair' | 'urgent';
  recommendation: string;
  confidence: 'low' | 'medium' | 'high';
  needs_closer_look: boolean;
  status: 'draft' | 'accepted' | 'discarded';
  updatedAt: number;
}

export class PlumblineDB extends Dexie {
  properties: Dexie.Table<Property, string>;
  areas: Dexie.Table<Area, string>;
  photos: Dexie.Table<Photo, string>;
  findings: Dexie.Table<Finding, string>;

  constructor() {
    super('PlumblineDB');
    this.version(1).stores({
      properties: '++id, name, address, date',
      areas: '++id, propertyId, name',
      photos: '++id, areaId, note',
      findings: '++id, photoId, areaId, status',
    });
  }
}

export const db = new PlumblineDB();
