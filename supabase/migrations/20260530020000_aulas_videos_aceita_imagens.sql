-- Permite imagens (thumbnails de aulas e módulos) no bucket aulas-videos.
update storage.buckets
   set allowed_mime_types = array[
     'video/mp4','video/webm','video/quicktime',
     'image/jpeg','image/png','image/webp'
   ]
 where id = 'aulas-videos';
