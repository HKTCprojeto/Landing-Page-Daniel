-- ════════════════════════════════════════════════════════════════════
-- Storage bucket: aulas-videos
-- Bucket público para hospedar os arquivos MP4 das videoaulas.
-- ════════════════════════════════════════════════════════════════════

-- Cria o bucket (idempotente).
insert into storage.buckets (id, name, public)
values ('aulas-videos', 'aulas-videos', true)
on conflict (id) do update set public = excluded.public;

-- Policies — leitura pública, escrita só para admin (via public.is_admin()).
drop policy if exists aulas_videos_public_read  on storage.objects;
drop policy if exists aulas_videos_admin_write  on storage.objects;
drop policy if exists aulas_videos_admin_update on storage.objects;
drop policy if exists aulas_videos_admin_delete on storage.objects;

create policy aulas_videos_public_read on storage.objects
  for select to public
  using (bucket_id = 'aulas-videos');

create policy aulas_videos_admin_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'aulas-videos' and public.is_admin());

create policy aulas_videos_admin_update on storage.objects
  for update to authenticated
  using  (bucket_id = 'aulas-videos' and public.is_admin())
  with check (bucket_id = 'aulas-videos' and public.is_admin());

create policy aulas_videos_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'aulas-videos' and public.is_admin());
