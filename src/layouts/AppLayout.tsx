import { Link, Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { authService } from '../services/authService';

export const AppLayout = () => {
  const darkMode = useUIStore((s) => s.darkMode);
  const toggle = useUIStore((s) => s.toggleDarkMode);

  return (
    <div className={darkMode ? 'dark min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen'}>
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <nav className="flex gap-4 text-sm">
          <Link to="/">Dashboard</Link><Link to="/tables">Tables</Link><Link to="/pos">POS</Link>
          <Link to="/kitchen">Kitchen</Link><Link to="/inventory">Inventory</Link><Link to="/reports">Reports</Link>
          <Link to="/shifts">Shifts</Link><Link to="/profile">Profile</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded bg-slate-800 p-2">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button onClick={() => void authService.logout()} className="rounded bg-red-700 px-3 py-1 text-sm">Logout</button>
        </div>
      </header>
      <main className="p-4"><Outlet /></main>
    </div>
  );
};
