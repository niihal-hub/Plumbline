import React, { useState } from 'react';
import { useInspection } from '@/hooks/use-inspection';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const { startInspection } = useInspection();
  const router = useRouter();

  const handleStart = async () => {
    if (!name || !address) return;
    const id = await startInspection({ name, address, date });
    router.push(`/inspection/${id}`);
  };

  return (
    <div className="p-6 flex flex-col min-h-screen justify-between">
      <div className="mt-12">
        <h1 className="text-5xl mb-2">Plumbline</h1>
        <p className="text-lg opacity-70 mb-12">Professional home inspection drafting.</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm opacity-60 uppercase tracking-wider">Property Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The Miller Residence"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm opacity-60 uppercase tracking-wider">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Maple Ave, Springfield"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm opacity-60 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="pb-8">
        <button onClick={handleStart} className="btn-primary w-full text-lg">
          Start Walkthrough
        </button>
      </div>
    </div>
  );
}
