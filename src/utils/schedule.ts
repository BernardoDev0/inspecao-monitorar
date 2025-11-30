import { Turno, TurnType } from '../types/schedule';

const COLABORADORES = ['Vitor', 'Moacir', 'Everton', 'Conrado'] as const;

/**
 * Gera um ID único para cada turno baseado na data e horário
 */
function gerarIdTurno(date: Date, horarioInicio: string): string {
  const dataStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${dataStr}_${horarioInicio.replace(':', '')}`;
}

/**
 * Formata uma data para string no formato YYYY-MM-DD
 */
function formatarDataISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gera a escala de turnos conforme as regras estabelecidas
 * 
 * @param startDate Data de início (opcional, padrão: hoje às 19:00)
 * @param days Número de dias para gerar (opcional, padrão: 30)
 * @returns Array de turnos ordenados por data e horário
 */
export function generateSchedule(startDate?: Date, days: number = 30): Turno[] {
  // Se não fornecer data de início, usa hoje às 19:00
  const hoje = startDate ? new Date(startDate) : new Date();
  hoje.setHours(19, 0, 0, 0);
  hoje.setMinutes(0, 0, 0);
  
  const escala: Turno[] = [];
  let indiceColaborador = 0; // Começa com Vitor (índice 0)
  
  // Primeiro turno: hoje às 19:00 com Vitor
  const primeiroTurno: Turno = {
    id: gerarIdTurno(hoje, '19:00'),
    date: formatarDataISO(hoje),
    horarioInicio: '19:00',
    horarioFim: '07:00',
    colaborador: COLABORADORES[indiceColaborador],
    tipo: 'Noturno',
    checklist: '19:00',
    entregaTelefone: null, // Primeiro turno não recebe telefone
  };
  escala.push(primeiroTurno);
  
  // Avançar para o próximo colaborador
  indiceColaborador = (indiceColaborador + 1) % COLABORADORES.length;
  
  // Calcular data de término do primeiro turno (próximo dia às 07:00)
  let dataAtual = new Date(hoje);
  dataAtual.setDate(dataAtual.getDate() + 1);
  dataAtual.setHours(7, 0, 0, 0);
  
  // Gerar os próximos turnos
  let contadorDias = 1;
  
  while (contadorDias <= days) {
    // Turno diurno (07:00 às 19:00)
    const turnoDiurno: Turno = {
      id: gerarIdTurno(dataAtual, '07:00'),
      date: formatarDataISO(dataAtual),
      horarioInicio: '07:00',
      horarioFim: '19:00',
      colaborador: COLABORADORES[indiceColaborador],
      tipo: 'Diurno',
      checklist: '07:00',
      entregaTelefone: COLABORADORES[(indiceColaborador - 1 + COLABORADORES.length) % COLABORADORES.length],
    };
    escala.push(turnoDiurno);
    
    // Avançar para o próximo colaborador
    indiceColaborador = (indiceColaborador + 1) % COLABORADORES.length;
    
    // Turno noturno (19:00 às 07:00 do dia seguinte)
    const turnoNoturno: Turno = {
      id: gerarIdTurno(dataAtual, '19:00'),
      date: formatarDataISO(dataAtual),
      horarioInicio: '19:00',
      horarioFim: '07:00',
      colaborador: COLABORADORES[indiceColaborador],
      tipo: 'Noturno',
      checklist: '19:00',
      entregaTelefone: COLABORADORES[(indiceColaborador - 1 + COLABORADORES.length) % COLABORADORES.length],
    };
    escala.push(turnoNoturno);
    
    // Avançar para o próximo colaborador e próximo dia
    indiceColaborador = (indiceColaborador + 1) % COLABORADORES.length;
    dataAtual.setDate(dataAtual.getDate() + 1);
    contadorDias++;
  }
  
  return escala;
}

