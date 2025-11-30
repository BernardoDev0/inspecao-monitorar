-- SQL para adicionar coluna observacoes na tabela inspections
-- Execute este SQL no SQL Editor do Supabase se a coluna ainda não existir

-- Adicionar coluna observacoes (se não existir)
ALTER TABLE inspections 
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Comentário na coluna
COMMENT ON COLUMN inspections.observacoes IS 'Observações opcionais sobre a inspeção';

