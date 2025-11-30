-- SQL para adicionar a coluna employee_name na tabela inspections do Supabase
-- Execute este SQL no SQL Editor do Supabase

ALTER TABLE inspections 
ADD COLUMN IF NOT EXISTS employee_name TEXT;

-- Atualizar a política de RLS se necessário (opcional)
-- Neste caso, a política de atualização já permite, então não precisa alterar