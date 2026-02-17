export type UserRole = 'admin' | 'manager' | 'cashier' | 'kitchen';
export type TableStatus = 'available' | 'occupied' | 'reserved';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
export type PaymentType = 'cash' | 'card' | 'online';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
}

export interface RestaurantTable {
  id: string;
  label: string;
  capacity: number;
  status: TableStatus;
}

export interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  price: number;
}

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
}
