-- SQL para criar a tabela de inspeções no Supabase
-- Execute este SQL no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  mileage NUMERIC NOT NULL,
  damages JSONB DEFAULT '[]'::jsonb,
  plate TEXT NOT NULL,
  vehicle_name TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhorar performance nas buscas
CREATE INDEX IF NOT EXISTS idx_inspections_plate ON inspections(plate);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at ON inspections(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (ajuste conforme necessário)
CREATE POLICY "Permitir leitura pública de inspeções"
  ON inspections FOR SELECT
  USING (true);

-- Política para permitir inserção pública (ajuste conforme necessário)
CREATE POLICY "Permitir inserção pública de inspeções"
  ON inspections FOR INSERT
  WITH CHECK (true);

-- Política para permitir atualização pública (ajuste conforme necessário)
CREATE POLICY "Permitir atualização pública de inspeções"
  ON inspections FOR UPDATE
  USING (true);

-- Política para permitir exclusão pública (ajuste conforme necessário)
CREATE POLICY "Permitir exclusão pública de inspeções"
  ON inspections FOR DELETE
  USING (true);

