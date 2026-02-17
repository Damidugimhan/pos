create extension if not exists "uuid-ossp";

create type app_role as enum ('admin','manager','cashier','kitchen');
create type table_status as enum ('available','occupied','reserved');
create type order_status as enum ('pending','preparing','ready','served','paid','cancelled');
create type payment_type as enum ('cash','card','online');
create type payment_status as enum ('completed','refunded','voided');
create type shift_status as enum ('open','closed');
create type inventory_unit as enum ('gram','ml','piece');

create table public.roles (id bigserial primary key, role app_role unique not null);
insert into public.roles(role) values ('admin'),('manager'),('cashier'),('kitchen') on conflict do nothing;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role app_role not null default 'cashier',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tables (
  id uuid primary key default uuid_generate_v4(),
  label text not null unique,
  capacity int not null check (capacity > 0),
  status table_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(category_id,name)
);

create table public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  contact_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ingredients (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  unit inventory_unit not null,
  stock_base_unit numeric(14,3) not null default 0,
  low_stock_threshold numeric(14,3) not null default 0,
  supplier_id uuid references public.suppliers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default uuid_generate_v4(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  quantity_base_unit numeric(14,3) not null check (quantity_base_unit > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(menu_item_id,ingredient_id)
);

create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  table_id uuid references public.tables(id) on delete set null,
  staff_id uuid references public.users(id) on delete set null,
  status order_status not null default 'pending',
  note text,
  discount_type text not null default 'fixed' check (discount_type in ('fixed','percentage')),
  discount_value numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete restrict,
  quantity int not null check (quantity > 0),
  price_each numeric(12,2) not null check (price_each >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete restrict,
  amount numeric(12,2) not null check (amount >= 0),
  payment_type payment_type not null,
  status payment_status not null default 'completed',
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shifts (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references public.users(id) on delete set null,
  opening_cash numeric(12,2) not null,
  closing_cash numeric(12,2),
  status shift_status not null default 'open',
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default uuid_generate_v4(),
  table_id uuid not null references public.tables(id) on delete cascade,
  customer_name text not null,
  reservation_time timestamptz not null,
  guest_count int not null check (guest_count > 0),
  status text not null default 'booked' check (status in ('booked','seated','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_logs (
  id uuid primary key default uuid_generate_v4(),
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  change_amount_base_unit numeric(14,3) not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index idx_orders_table_id on public.orders(table_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_payments_order_id on public.payments(order_id);
create index idx_audit_logs_action on public.audit_logs(action);
create index idx_inventory_logs_ingredient on public.inventory_logs(ingredient_id);

create function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_touch_users before update on public.users for each row execute function public.touch_updated_at();
create trigger trg_touch_tables before update on public.tables for each row execute function public.touch_updated_at();
create trigger trg_touch_categories before update on public.categories for each row execute function public.touch_updated_at();
create trigger trg_touch_menu_items before update on public.menu_items for each row execute function public.touch_updated_at();
create trigger trg_touch_suppliers before update on public.suppliers for each row execute function public.touch_updated_at();
create trigger trg_touch_ingredients before update on public.ingredients for each row execute function public.touch_updated_at();
create trigger trg_touch_recipes before update on public.recipes for each row execute function public.touch_updated_at();
create trigger trg_touch_orders before update on public.orders for each row execute function public.touch_updated_at();
create trigger trg_touch_order_items before update on public.order_items for each row execute function public.touch_updated_at();
create trigger trg_touch_payments before update on public.payments for each row execute function public.touch_updated_at();
create trigger trg_touch_shifts before update on public.shifts for each row execute function public.touch_updated_at();
create trigger trg_touch_reservations before update on public.reservations for each row execute function public.touch_updated_at();

create or replace function public.current_user_role() returns app_role language sql stable as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.place_order_with_inventory_check(
  p_table_id uuid,
  p_items jsonb,
  p_order_note text,
  p_discount_type text,
  p_discount_value numeric
) returns uuid language plpgsql security definer as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_subtotal numeric := 0;
  v_required record;
  v_discount numeric := 0;
begin
  for v_required in
    select r.ingredient_id, sum((x->>'quantity')::numeric * r.quantity_base_unit) qty_needed
    from jsonb_array_elements(p_items) x
    join public.recipes r on r.menu_item_id = (x->>'menu_item_id')::uuid
    group by r.ingredient_id
  loop
    if (select stock_base_unit from public.ingredients where id = v_required.ingredient_id) < v_required.qty_needed then
      raise exception 'Insufficient stock for ingredient %', v_required.ingredient_id;
    end if;
  end loop;

  insert into public.orders(table_id, staff_id, status, note, discount_type, discount_value)
  values (p_table_id, auth.uid(), 'pending', p_order_note, p_discount_type, p_discount_value)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    insert into public.order_items(order_id, menu_item_id, quantity, price_each)
    values (v_order_id, (v_item->>'menu_item_id')::uuid, (v_item->>'quantity')::int, (v_item->>'price_each')::numeric);
    v_subtotal := v_subtotal + (v_item->>'quantity')::numeric * (v_item->>'price_each')::numeric;
  end loop;

  if p_discount_type = 'percentage' then v_discount := v_subtotal * p_discount_value / 100; else v_discount := p_discount_value; end if;
  update public.orders set total = greatest(0, v_subtotal - v_discount) where id = v_order_id;

  for v_required in
    select r.ingredient_id, sum((x->>'quantity')::numeric * r.quantity_base_unit) qty_needed
    from jsonb_array_elements(p_items) x
    join public.recipes r on r.menu_item_id = (x->>'menu_item_id')::uuid
    group by r.ingredient_id
  loop
    update public.ingredients set stock_base_unit = stock_base_unit - v_required.qty_needed where id = v_required.ingredient_id;
    insert into public.inventory_logs(ingredient_id, user_id, change_amount_base_unit, reason)
    values (v_required.ingredient_id, auth.uid(), -v_required.qty_needed, 'auto_deduction');
  end loop;

  update public.tables set status = 'occupied' where id = p_table_id;
  return v_order_id;
end $$;

grant execute on function public.place_order_with_inventory_check(uuid,jsonb,text,text,numeric) to authenticated;

create or replace function public.get_kitchen_orders() returns table (
  id uuid,
  table_label text,
  status order_status,
  created_at timestamptz,
  items text[]
) language sql security definer as $$
select o.id, t.label, o.status, o.created_at, array_agg(mi.name || ' x' || oi.quantity)
from public.orders o
left join public.tables t on t.id = o.table_id
join public.order_items oi on oi.order_id = o.id
join public.menu_items mi on mi.id = oi.menu_item_id
where o.status in ('pending','preparing','ready')
group by o.id, t.label, o.status, o.created_at
order by o.created_at;
$$;

grant execute on function public.get_kitchen_orders() to authenticated;

create or replace function public.report_revenue_by_payment_type() returns table (payment_type payment_type, revenue numeric)
language sql security definer as $$
  select p.payment_type, sum(p.amount) from public.payments p where p.status='completed' group by p.payment_type;
$$;

grant execute on function public.report_revenue_by_payment_type() to authenticated;

create or replace view public.ingredients_view as
select i.id, i.name, i.stock_base_unit, i.unit, i.low_stock_threshold, s.name as supplier_name
from public.ingredients i
left join public.suppliers s on s.id = i.supplier_id;
