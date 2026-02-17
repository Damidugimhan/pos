import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

export const ReportsPage = () => {
  const [paymentData, setPaymentData] = useState<Array<{ name: string; value: number }>>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.rpc('report_revenue_by_payment_type');
      setPaymentData((data ?? []).map((row: { payment_type: string; revenue: number }) => ({ name: row.payment_type, value: row.revenue })));
    };
    void load();
  }, []);

  const exportCsv = async () => {
    const csvRows = ['payment_type,revenue', ...paymentData.map((row) => `${row.name},${row.value}`)];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'revenue-report.csv';
    link.click();
  };

  return (
    <div>
      <div className="mb-3 flex justify-between"><h2 className="text-xl">Reports</h2><button className="rounded bg-slate-800 px-3 py-1" onClick={exportCsv}>Export CSV</button></div>
      <div className="h-80 rounded bg-slate-900 p-4">
        <ResponsiveContainer><PieChart><Pie dataKey="value" data={paymentData} fill="#34d399" label /><Tooltip /></PieChart></ResponsiveContainer>
      </div>
    </div>
  );
};
