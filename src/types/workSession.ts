export type WorkSession = {
  id: number;
  usuario_id: number;
  data: string; // YYYY-MM-DD
  hora_entrada: string | null; // HH:MM
  hora_saida: string | null; // HH:MM
  overnight: boolean;
  observacoes: string | null;
  source: 'mobile' | 'web' | 'import' | 'manual_edit';
  created_at: string;
  created_by_ip: string | null;
  created_by_device_id: string | null;
  edited_at: string | null;
  edited_by: number | null;
  edit_reason: string | null;
};

export type WorkSessionCreate = {
  usuario_id: number;
  data: string; // YYYY-MM-DD
  hora_entrada?: string | null; // HH:MM
  hora_saida?: string | null; // HH:MM
  observacoes?: string | null;
  source?: 'mobile' | 'web' | 'import' | 'manual_edit';
  created_by_device_id?: string | null;
  created_by_ip?: string | null;
};

export type WorkSessionUpdate = {
  hora_entrada?: string | null;
  hora_saida?: string | null;
  observacoes?: string | null;
  edit_reason: string; // Obrigatório
  edited_by: number;
};

export type WorkSessionQuery = {
  usuario_id: number;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
};

