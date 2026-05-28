-- ════════════════════════════════════════════════════════════════════
-- Adiciona avatar_url ao retorno de public.get_users_list()
-- usado na listagem de usuários do painel Configurações.
-- ════════════════════════════════════════════════════════════════════

-- Dropa todas as overloads existentes (assinatura desconhecida).
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'get_users_list'
  loop
    execute format('drop function %s', r.sig);
  end loop;
end $$;

-- Recria com avatar_url.
create function public.get_users_list()
returns table (
  id         uuid,
  nome       text,
  email      text,
  ativo      boolean,
  role       text,
  plano      text,
  avatar_url text
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.nome,
    coalesce(p.email, u.email)::text as email,
    coalesce(p.ativo, true)          as ativo,
    p.role,
    p.plano,
    p.avatar_url
  from public.perfis p
  join auth.users   u on u.id = p.id
  where public.is_admin()
  order by p.nome nulls last;
$$;

revoke all on function public.get_users_list() from public, anon;
grant execute on function public.get_users_list() to authenticated;
