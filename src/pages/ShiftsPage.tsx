import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const ShiftsPage = () => {
  const [openingCash, setOpeningCash] = useState(0);
  const [closingCash, setClosingCash] = useState(0);

  const openShift = async () => {
    try {
      const { error } = await supabase.from('shifts').insert({ opening_cash: openingCash, status: 'open' });
      if (error) throw error;
      toast.success('Shift opened.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to open shift.');
    }
  };

  const closeShift = async () => {
    try {
      const { error } = await supabase.from('shifts').update({ closing_cash: closingCash, status: 'closed', closed_at: new Date().toISOString() }).eq('status', 'open');
      if (error) throw error;
      toast.success('Shift closed.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to close shift.');
    }
  };

  return <div className="max-w-md space-y-3"><h2 className="text-xl">Shift Management</h2><input type="number" value={openingCash} onChange={(e) => setOpeningCash(Number(e.target.value))} className="w-full rounded bg-slate-900 p-2" placeholder="Opening cash" /><button className="rounded bg-emerald-700 px-3 py-2" onClick={() => void openShift()}>Open Shift</button><input type="number" value={closingCash} onChange={(e) => setClosingCash(Number(e.target.value))} className="w-full rounded bg-slate-900 p-2" placeholder="Closing cash" /><button className="rounded bg-amber-700 px-3 py-2" onClick={() => void closeShift()}>Close Shift</button></div>;
};
