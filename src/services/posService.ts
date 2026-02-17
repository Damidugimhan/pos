import { supabase } from '../lib/supabase';
import type { PaymentType } from '../types/domain';

interface CreateOrderArgs {
  tableId: string;
  lines: Array<{ menu_item_id: string; quantity: number; price_each: number }>;
  note: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
}

export const posService = {
  async createOrder(payload: CreateOrderArgs) {
    const { data, error } = await supabase.rpc('place_order_with_inventory_check', {
      p_table_id: payload.tableId,
      p_items: payload.lines,
      p_order_note: payload.note,
      p_discount_type: payload.discountType,
      p_discount_value: payload.discountValue
    });
    if (error) throw error;
    return data;
  },
  async recordPayment(orderId: string, amount: number, paymentType: PaymentType) {
    const { error } = await supabase.from('payments').insert({ order_id: orderId, amount, payment_type: paymentType, status: 'completed' });
    if (error) throw error;
    const { error: statusErr } = await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId);
    if (statusErr) throw statusErr;
  }
};
