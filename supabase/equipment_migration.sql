create table if not exists equipment_items (
  id                    uuid primary key default gen_random_uuid(),
  character_id          uuid not null references characters(id) on delete cascade,
  ordine                integer not null default 0,
  nome                  text not null,
  slot                  text not null default 'Altro',
  equipaggiato          boolean not null default true,
  bonus_ca              integer not null default 0,
  caratteristica        text check (caratteristica in ('for','des','cos','int','sag','car')),
  bonus_caratteristica  integer not null default 0,
  effetti               text not null default ''
);

create index if not exists idx_equipment_char on equipment_items(character_id);
alter table equipment_items enable row level security;
drop policy if exists "allow all - anon" on equipment_items;
create policy "allow all - anon" on equipment_items
  for all using (true) with check (true);

insert into equipment_items (
  character_id, ordine, nome, slot, equipaggiato, bonus_ca, effetti
)
select
  item.character_id,
  item.ordine,
  item.nome,
  case when item.nome ilike 'Armatura%' then 'Armatura' else 'Mantello' end,
  true,
  0,
  coalesce(item.descrizione, '')
from inventory_items item
where (item.nome ilike 'Armatura%' or item.nome ilike 'Mantello%')
and not exists (
  select 1
  from equipment_items equipment
  where equipment.character_id = item.character_id
    and equipment.nome = item.nome
);