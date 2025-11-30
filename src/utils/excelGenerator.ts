import * as XLSX from 'xlsx';
import { Inspection } from '../types';
import { Turno } from '../types/schedule';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

/**
 * Gera um arquivo Excel com todas as inspeções
 */
export async function generateExcelFile(inspections: Inspection[]): Promise<string> {
  // Preparar dados para o Excel
  const excelData = inspections.map((inspection) => {
    // Verificar se há danos
    const damages = inspection.damages.filter((d) => d.isDamaged);
    const damageInfo = damages.length > 0 
      ? damages.map((d) => `${d.label} (${d.view})`).join('; ')
      : 'Tudo OK';

    return {
      'Data/Hora de Salvamento': inspection.savedAt,
      'Placa': inspection.plate,
      'Veículo': inspection.vehicleName,
      'Nome do Funcionário': inspection.employeeName || '',
      'Quilometragem (KM)': inspection.mileage,
      'Horário de Retirada': inspection.time,
      'Status': damageInfo,
      'Observações': inspection.observacoes || '',
    };
  });

  // Criar workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inspeções');

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 25 }, // Data/Hora de Salvamento
    { wch: 10 }, // Placa
    { wch: 12 }, // Veículo
    { wch: 20 }, // Nome do Funcionário
    { wch: 18 }, // Quilometragem
    { wch: 18 }, // Horário de Retirada
    { wch: 50 }, // Status
    { wch: 40 }, // Observações
  ];
  worksheet['!cols'] = columnWidths;

  // Gerar arquivo Excel
  const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  
  // Salvar arquivo temporário
  const fileName = `Inspecoes_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Obter diretório de cache
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) {
    throw new Error('Diretório de cache não disponível');
  }
  
  const fileUri = `${cacheDir}${fileName}`;
  
  // Usar API legacy do File System (compatível com Expo 54)
  await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}

/**
 * Compartilha/baixa o arquivo Excel
 */
export async function shareExcelFile(fileUri: string): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  
  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Baixar Excel de Inspeções',
    });
  } else {
    throw new Error('Compartilhamento não disponível neste dispositivo');
  }
}

/**
 * Formata uma data no formato DD/MM/YYYY
 */
function formatarDataDDMMYYYY(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formata o nome do colaborador (primeira letra maiúscula)
 */
function formatarColaborador(nome: string): string {
  if (!nome) return '';
  return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
}

/**
 * Gera um arquivo Excel com a escala de turnos
 */
export async function generateScheduleExcelFile(turnos: Turno[]): Promise<string> {
  // Ordenar turnos por data (ascendente) e depois por hora de início (ascendente)
  const turnosOrdenados = [...turnos].sort((a, b) => {
    // Comparar datas
    const dataA = new Date(a.date + 'T00:00:00').getTime();
    const dataB = new Date(b.date + 'T00:00:00').getTime();
    
    if (dataA !== dataB) {
      return dataA - dataB;
    }
    
    // Se as datas forem iguais, comparar horários de início
    const horaA = a.horarioInicio.split(':').map(Number);
    const horaB = b.horarioInicio.split(':').map(Number);
    const minutosA = horaA[0] * 60 + horaA[1];
    const minutosB = horaB[0] * 60 + horaB[1];
    
    return minutosA - minutosB;
  });

  // Preparar dados para o Excel
  const excelData = turnosOrdenados.map((turno) => {
    return {
      'DIA/MES/ANO': formatarDataDDMMYYYY(turno.date),
      'TIPO_TURNO': turno.tipo.toUpperCase(),
      'HORA_INICIO': turno.horarioInicio,
      'HORA_FIM': turno.horarioFim,
      'COLABORADOR': formatarColaborador(turno.colaborador),
      'HORA_CHECKLIST': turno.checklist,
      'RECEBE_TELEFONE_DE': turno.entregaTelefone ? formatarColaborador(turno.entregaTelefone) : '',
      'OBSERVACOES': '', // Sem observações por padrão
    };
  });

  // Criar workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Escala');

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 12 }, // DIA/MES/ANO
    { wch: 12 }, // TIPO_TURNO
    { wch: 12 }, // HORA_INICIO
    { wch: 12 }, // HORA_FIM
    { wch: 15 }, // COLABORADOR
    { wch: 15 }, // HORA_CHECKLIST
    { wch: 20 }, // RECEBE_TELEFONE_DE
    { wch: 20 }, // OBSERVACOES
  ];
  worksheet['!cols'] = columnWidths;

  // Gerar arquivo Excel
  const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  
  // Formatar data de hoje no formato DDMMYYYY
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  const dataFormatada = `${dia}${mes}${ano}`;
  
  // Salvar arquivo temporário
  const fileName = `escala_turnos_${dataFormatada}.xlsx`;
  
  // Obter diretório de cache
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) {
    throw new Error('Diretório de cache não disponível');
  }
  
  const fileUri = `${cacheDir}${fileName}`;
  
  // Usar API legacy do File System (compatível com Expo 54)
  await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}

/**
 * Compartilha/baixa o arquivo Excel da escala de turnos
 */
export async function shareScheduleExcelFile(fileUri: string): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  
  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Baixar Excel da Escala de Turnos',
    });
  } else {
    throw new Error('Compartilhamento não disponível neste dispositivo');
  }
}

/**
 * Formata timestamp ISO para string legível
 */
function formatarTimestamp(isoString: string | null): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR');
  } catch {
    return isoString;
  }
}

/**
 * Gera um arquivo Excel com os registros de ponto (work_sessions)
 */
export async function generateWorkSessionsExcelFile(
  sessions: Array<{
    id: number;
    usuario_id: number;
    data: string;
    hora_entrada: string | null;
    hora_saida: string | null;
    overnight: boolean;
    observacoes: string | null;
    created_at: string;
    edited_by: number | null;
    edit_reason: string | null;
    colaborador_nome?: string;
  }>,
  options?: {
    from?: string;
    to?: string;
    usuario_nome?: string;
  }
): Promise<string> {
  // Ordenar por data (ascendente) e depois por hora de início
  const sessionsOrdenados = [...sessions].sort((a, b) => {
    const dataA = new Date(a.data + 'T00:00:00').getTime();
    const dataB = new Date(b.data + 'T00:00:00').getTime();
    
    if (dataA !== dataB) {
      return dataA - dataB;
    }
    
    // Se as datas forem iguais, comparar horários de início
    if (a.hora_entrada && b.hora_entrada) {
      const horaA = a.hora_entrada.split(':').map(Number);
      const horaB = b.hora_entrada.split(':').map(Number);
      const minutosA = horaA[0] * 60 + horaA[1];
      const minutosB = horaB[0] * 60 + horaB[1];
      return minutosA - minutosB;
    }
    
    return 0;
  });

  // Preparar dados para o Excel
  const excelData = sessionsOrdenados.map((session) => {
    return {
      'DIA/MES/ANO': formatarDataDDMMYYYY(session.data),
      'HORA_INICIO': session.hora_entrada || '',
      'HORA_FIM': session.hora_saida || '',
      'COLABORADOR_ID': session.usuario_id,
      'COLABORADOR': session.colaborador_nome || `Colaborador ${session.usuario_id}`,
      'OBSERVACOES': session.observacoes || '',
      'CRIAÇÃO': formatarTimestamp(session.created_at),
      'EDITADO_POR': session.edited_by ? `Usuário ${session.edited_by}` : '',
      'MOTIVO_EDICAO': session.edit_reason || '',
    };
  });

  // Criar workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pontos');

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 12 }, // DIA/MES/ANO
    { wch: 12 }, // HORA_INICIO
    { wch: 12 }, // HORA_FIM
    { wch: 15 }, // COLABORADOR_ID
    { wch: 20 }, // COLABORADOR
    { wch: 30 }, // OBSERVACOES
    { wch: 20 }, // CRIAÇÃO
    { wch: 15 }, // EDITADO_POR
    { wch: 30 }, // MOTIVO_EDICAO
  ];
  worksheet['!cols'] = columnWidths;

  // Gerar arquivo Excel
  const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  
  // Formatar nome do arquivo
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  const dataFormatada = `${dia}${mes}${ano}`;
  
  let fileName: string;
  if (options?.usuario_nome) {
    const nomeLimpo = options.usuario_nome.replace(/[^a-zA-Z0-9]/g, '_');
    fileName = `pontos_usuario_${nomeLimpo}_${dataFormatada}.xlsx`;
  } else if (options?.from && options?.to) {
    const fromDate = formatarDataDDMMYYYY(options.from).replace(/\//g, '');
    const toDate = formatarDataDDMMYYYY(options.to).replace(/\//g, '');
    fileName = `pontos_ESCALA_${fromDate}_${toDate}.xlsx`;
  } else {
    fileName = `pontos_${dataFormatada}.xlsx`;
  }
  
  // Obter diretório de cache
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) {
    throw new Error('Diretório de cache não disponível');
  }
  
  const fileUri = `${cacheDir}${fileName}`;
  
  // Usar API legacy do File System (compatível com Expo 54)
  await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}

/**
 * Compartilha/baixa o arquivo Excel de pontos
 */
export async function shareWorkSessionsExcelFile(fileUri: string): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  
  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Baixar Excel de Pontos',
    });
  } else {
    throw new Error('Compartilhamento não disponível neste dispositivo');
  }
}

