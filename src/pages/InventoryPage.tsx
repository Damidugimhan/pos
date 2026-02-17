import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Ingredient = { id: string; name: string; stock_base_unit: number; unit: string; low_stock_threshold: number; supplier_name: string | null };

export const InventoryPage = () => {
  const [items, setItems] = useState<Ingredient[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('ingredients_view').select('*');
      setItems(data ?? []);
    };
    void load();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl">Inventory</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded bg-slate-900 p-3">
            <p>{item.name} - {item.stock_base_unit} {item.unit}</p>
            <p>Supplier: {item.supplier_name ?? 'N/A'}</p>
            {item.stock_base_unit <= item.low_stock_threshold && <p className="text-red-400">Low Stock Alert</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
