import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';

type KitchenOrder = { id: string; table_label: string; status: string; created_at: string; items: string[] };

export const KitchenPage = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);

  const load = async () => {
    const { data } = await supabase.rpc('get_kitchen_orders');
    setOrders(data ?? []);
  };

  useEffect(() => { void load(); }, []);
  useRealtimeOrders(() => { void load(); new Audio('/notify.mp3').play().catch(() => {}); });

  const setStatus = async (id: string, status: 'preparing' | 'ready' | 'served') => {
    await supabase.from('orders').update({ status }).eq('id', id);
    await load();
  };

  return <div className="grid gap-3 md:grid-cols-3">{orders.map((order) => {
    const ageMin = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
    return <div key={order.id} className={`rounded p-3 ${ageMin > 15 ? 'bg-red-900' : 'bg-slate-900'}`}><h3>{order.table_label}</h3><p>{order.items.join(', ')}</p><p>{ageMin} mins</p><div className="flex gap-2"><button onClick={() => void setStatus(order.id, 'preparing')}>Preparing</button><button onClick={() => void setStatus(order.id, 'ready')}>Ready</button><button onClick={() => void setStatus(order.id, 'served')}>Served</button></div></div>;
  })}</div>;
};
