-- SQL para criar a tabela work_sessions no Supabase
-- Execute este SQL no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS work_sessions (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  data DATE NOT NULL,
  hora_entrada TIME NULL,
  hora_saida TIME NULL,
  overnight BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  source VARCHAR(32) DEFAULT 'mobile', -- "mobile","web","import","manual_edit"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_ip VARCHAR(45),
  created_by_device_id VARCHAR(128),
  edited_at TIMESTAMP WITH TIME ZONE NULL,
  edited_by BIGINT NULL,
  edit_reason TEXT NULL
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_work_sessions_usuario_data ON work_sessions(usuario_id, data);
CREATE INDEX IF NOT EXISTS idx_work_sessions_data ON work_sessions(data DESC);
CREATE INDEX IF NOT EXISTS idx_work_sessions_usuario ON work_sessions(usuario_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura (ajuste conforme necessário)
CREATE POLICY "Permitir leitura de work_sessions"
  ON work_sessions FOR SELECT
  USING (true);

-- Política para permitir inserção (ajuste conforme necessário)
CREATE POLICY "Permitir inserção de work_sessions"
  ON work_sessions FOR INSERT
  WITH CHECK (true);

-- Política para permitir atualização (ajuste conforme necessário)
CREATE POLICY "Permitir atualização de work_sessions"
  ON work_sessions FOR UPDATE
  USING (true);

-- Política para permitir exclusão (ajuste conforme necessário - apenas admins)
CREATE POLICY "Permitir exclusão de work_sessions"
  ON work_sessions FOR DELETE
  USING (true);

-- Função para verificar se existe entrada sem saída
CREATE OR REPLACE FUNCTION check_open_session(
  p_usuario_id BIGINT,
  p_data DATE
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM work_sessions 
    WHERE usuario_id = p_usuario_id 
      AND data = p_data 
      AND hora_entrada IS NOT NULL 
      AND hora_saida IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- Função para contar registros do dia (rate limit)
CREATE OR REPLACE FUNCTION count_daily_sessions(
  p_usuario_id BIGINT,
  p_data DATE
) RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM work_sessions
    WHERE usuario_id = p_usuario_id
      AND data = p_data
  );
END;
$$ LANGUAGE plpgsql;

