import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 500 }, { name: 'Tue', sales: 670 }, { name: 'Wed', sales: 420 }, { name: 'Thu', sales: 790 }, { name: 'Fri', sales: 940 }
];

export const DashboardPage = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Sales Analytics</h2>
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded bg-slate-900 p-4">Daily Sales: $1,240</div>
      <div className="rounded bg-slate-900 p-4">Monthly Sales: $24,780</div>
      <div className="rounded bg-slate-900 p-4">Peak Hour: 13:00-14:00</div>
    </div>
    <div className="h-72 rounded bg-slate-900 p-4">
      <ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="sales" fill="#60a5fa" /></BarChart></ResponsiveContainer>
    </div>
  </div>
);
