import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useRealtimeOrders = (onChange: () => void) => {
  useEffect(() => {
    const channel = supabase.channel('orders-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onChange).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [onChange]);
};
