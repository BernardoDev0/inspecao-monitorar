export type DamagePoint = {
  id: string;
  view: 'left' | 'right' | 'front' | 'rear' | 'top';
  label: string;
  x: number;
  y: number;
  isDamaged: boolean;
};

export type ClickablePoint = {
  id: string;
  x: number;
  y: number;
  label: string;
};

export type Inspection = {
  id: string;
  date: string;
  time: string;
  mileage: number;
  damages: DamagePoint[];
  plate: string;
  vehicleName: string;
  savedAt: string; // Timestamp de quando foi salvo (horário de Brasília)
  observacoes?: string; // Observações opcionais
  employeeName?: string; // Nome do funcionário
  checklistTime?: string; // Horário do checklist
};

