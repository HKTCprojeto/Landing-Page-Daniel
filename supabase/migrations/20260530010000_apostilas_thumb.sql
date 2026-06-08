-- Adiciona thumbnail às apostilas (capa do módulo).
alter table public.apostilas
  add column if not exists thumb_url text;
