alter table public.users enable row level security;
alter table public.tables enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.suppliers enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.shifts enable row level security;
alter table public.audit_logs enable row level security;
alter table public.reservations enable row level security;
alter table public.inventory_logs enable row level security;

create policy "users self read" on public.users for select using (id = auth.uid() or public.current_user_role() in ('admin','manager'));
create policy "admin manage users" on public.users for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "tables read all staff" on public.tables for select using (auth.role() = 'authenticated');
create policy "tables cdu admin manager" on public.tables for all using (public.current_user_role() in ('admin','manager')) with check (public.current_user_role() in ('admin','manager'));

create policy "categories read staff" on public.categories for select using (auth.role() = 'authenticated');
create policy "categories write admin manager" on public.categories for all using (public.current_user_role() in ('admin','manager')) with check (public.current_user_role() in ('admin','manager'));

create policy "menu read staff" on public.menu_items for select using (auth.role() = 'authenticated');
create policy "menu write admin manager" on public.menu_items for all using (public.current_user_role() in ('admin','manager')) with check (public.current_user_role() in ('admin','manager'));

create policy "suppliers admin manager only" on public.suppliers for all using (public.current_user_role() in ('admin','manager')) with check (public.current_user_role() in ('admin','manager'));

create policy "ingredients read admin manager cashier" on public.ingredients for select using (public.current_user_role() in ('admin','manager','cashier'));
create policy "ingredients write admin manager" on public.ingredients for all using (public.current_user_role() in ('admin','manager')) with check (public.current_user_role() in ('admin','manager'));

create policy "recipes read staff" on public.recipes for select using (auth.role() = 'authenticated');
create policy "recipes write admin manager" on public.recipes for all using (public.current_user_role() in ('admin','manager')) with check (public.current_user_role() in ('admin','manager'));

create policy "orders read staff" on public.orders for select using (auth.role() = 'authenticated');
create policy "orders insert cashier manager admin" on public.orders for insert with check (public.current_user_role() in ('admin','manager','cashier'));
create policy "orders update cashier manager admin kitchen" on public.orders for update using (public.current_user_role() in ('admin','manager','cashier','kitchen')) with check (public.current_user_role() in ('admin','manager','cashier','kitchen'));

create policy "order items read staff" on public.order_items for select using (auth.role() = 'authenticated');
create policy "order items write cashier manager admin" on public.order_items for all using (public.current_user_role() in ('admin','manager','cashier')) with check (public.current_user_role() in ('admin','manager','cashier'));

create policy "payments read admin manager cashier" on public.payments for select using (public.current_user_role() in ('admin','manager','cashier'));
create policy "payments write admin manager cashier" on public.payments for all using (public.current_user_role() in ('admin','manager','cashier')) with check (public.current_user_role() in ('admin','manager','cashier'));

create policy "shifts read own or manager" on public.shifts for select using (staff_id = auth.uid() or public.current_user_role() in ('admin','manager'));
create policy "shifts write cashier manager admin" on public.shifts for all using (public.current_user_role() in ('admin','manager','cashier')) with check (public.current_user_role() in ('admin','manager','cashier'));

create policy "audit read admin manager" on public.audit_logs for select using (public.current_user_role() in ('admin','manager'));
create policy "audit insert system staff" on public.audit_logs for insert with check (auth.role() = 'authenticated');

create policy "reservations read staff" on public.reservations for select using (auth.role() = 'authenticated');
create policy "reservations write cashier manager admin" on public.reservations for all using (public.current_user_role() in ('admin','manager','cashier')) with check (public.current_user_role() in ('admin','manager','cashier'));

create policy "inventory logs read admin manager" on public.inventory_logs for select using (public.current_user_role() in ('admin','manager'));
create policy "inventory logs insert authenticated" on public.inventory_logs for insert with check (auth.role() = 'authenticated');
