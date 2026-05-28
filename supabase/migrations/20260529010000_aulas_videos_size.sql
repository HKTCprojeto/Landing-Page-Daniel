-- Aumenta o limite de tamanho de arquivo do bucket aulas-videos para 500 MB.
-- Necessário para os vídeos longos do carrossel "Na mídia" e das aulas extensas.
update storage.buckets
   set file_size_limit = 524288000,           -- 500 MB
       allowed_mime_types = array['video/mp4','video/webm','video/quicktime']
 where id = 'aulas-videos';
