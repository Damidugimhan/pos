import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { RestaurantTable } from '../types/domain';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { toast } from 'sonner';

const statusStyles = { available: 'bg-green-700', occupied: 'bg-red-700', reserved: 'bg-yellow-600' };

export const TablesPage = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);

  const load = async () => {
    try {
      const { data, error } = await supabase.from('tables').select('id,label,capacity,status').order('label');
      if (error) throw error;
      setTables(data ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load tables.');
    }
  };

  useEffect(() => { void load(); }, []);
  useRealtimeOrders(() => { void load(); });

  return (
    <div>
      <h2 className="mb-4 text-xl">Table Management</h2>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {tables.map((table) => (
          <button key={table.id} className={`rounded p-4 text-left ${statusStyles[table.status]}`}>
            <div className="text-lg font-semibold">{table.label}</div>
            <div>Capacity: {table.capacity}</div>
            <div>Status: {table.status}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
