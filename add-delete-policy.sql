-- Adicionar política de DELETE para permitir exclusão de inspeções
-- Execute este SQL no SQL Editor do Supabase

-- Política para permitir exclusão pública de inspeções
CREATE POLICY "Permitir exclusão pública de inspeções"
  ON inspections FOR DELETE
  USING (true);

