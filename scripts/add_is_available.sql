-- Adiciona campo de disponibilidade ao perfil
alter table profiles add column if not exists is_available boolean default false;

-- Para marcar como disponível, execute depois:
-- update profiles set is_available = true where id = '<seu-id>';

NOTIFY pgrst, 'reload schema';
