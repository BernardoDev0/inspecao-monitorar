export type TurnType = 'Diurno' | 'Noturno';

export type Turno = {
  id: string;
  date: string; // Data no formato ISO (YYYY-MM-DD)
  horarioInicio: string; // '07:00' ou '19:00'
  horarioFim: string; // '19:00' ou '07:00'
  colaborador: string;
  tipo: TurnType;
  checklist: string; // '07:00' ou '19:00'
  entregaTelefone: string | null; // Nome do colaborador que entrega ou null
};

