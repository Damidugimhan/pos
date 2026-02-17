import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { usePosStore } from '../store/posStore';
import type { MenuItem } from '../types/domain';
import { posService } from '../services/posService';
import { toast } from 'sonner';

export const PosPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState('');
  const [tableId, setTableId] = useState('');
  const cart = usePosStore((s) => s.cart);
  const add = usePosStore((s) => s.addItem);
  const updateQuantity = usePosStore((s) => s.updateQuantity);
  const removeItem = usePosStore((s) => s.removeItem);
  const clear = usePosStore((s) => s.clear);
  const note = usePosStore((s) => s.orderNote);
  const setNote = usePosStore((s) => s.setOrderNote);
  const discountType = usePosStore((s) => s.discountType);
  const discountValue = usePosStore((s) => s.discountValue);
  const setDiscount = usePosStore((s) => s.setDiscount);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const { data, error } = await supabase.from('menu_items').select('id,name,category_id,price').eq('active', true);
        if (error) throw error;
        setMenuItems(data ?? []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Menu load failed.');
      }
    };
    void loadMenu();
  }, []);

  const filtered = useMemo(() => menuItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [menuItems, query]);
  const subtotal = cart.reduce((sum, line) => sum + line.menuItem.price * line.quantity, 0);
  const discount = discountType === 'percentage' ? subtotal * discountValue / 100 : discountValue;
  const total = Math.max(0, subtotal - discount);

  const placeOrder = async () => {
    try {
      if (!tableId || cart.length === 0) return;
      await posService.createOrder({ tableId, note, discountType, discountValue, lines: cart.map((line) => ({ menu_item_id: line.menuItem.id, quantity: line.quantity, price_each: line.menuItem.price })) });
      toast.success('Order placed.');
      clear();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Order failed due to stock or server validation.');
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="md:col-span-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search menu" className="mb-3 w-full rounded bg-slate-800 p-2" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => <button key={item.id} onClick={() => add(item)} className="rounded bg-slate-900 p-3 text-left">{item.name}<div>${item.price.toFixed(2)}</div></button>)}
        </div>
      </section>
      <aside className="rounded bg-slate-900 p-4">
        <h3 className="mb-2 text-lg">Cart</h3>
        {cart.map((line) => <div key={line.menuItem.id} className="mb-2 rounded bg-slate-800 p-2"><div>{line.menuItem.name}</div><div className="flex gap-2"><input type="number" value={line.quantity} onChange={(e) => updateQuantity(line.menuItem.id, Number(e.target.value))} className="w-16 rounded bg-slate-700 p-1" /><button onClick={() => removeItem(line.menuItem.id)}>Remove</button></div></div>)}
        <input className="mb-2 w-full rounded bg-slate-800 p-2" placeholder="Table ID" value={tableId} onChange={(e) => setTableId(e.target.value)} />
        <textarea className="mb-2 w-full rounded bg-slate-800 p-2" placeholder="Order notes" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="mb-2 flex gap-2"><select className="rounded bg-slate-800 p-2" value={discountType} onChange={(e) => setDiscount(e.target.value as 'fixed' | 'percentage', discountValue)}><option value="fixed">Fixed</option><option value="percentage">Percentage</option></select><input type="number" className="w-full rounded bg-slate-800 p-2" value={discountValue} onChange={(e) => setDiscount(discountType, Number(e.target.value))} /></div>
        <p>Subtotal: ${subtotal.toFixed(2)}</p><p>Total: ${total.toFixed(2)}</p>
        <button onClick={() => void placeOrder()} className="mt-3 w-full rounded bg-emerald-600 p-2">Place Order</button>
      </aside>
    </div>
  );
};
