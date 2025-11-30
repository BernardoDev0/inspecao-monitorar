import { supabase } from '../config/supabase';
import { WorkSession, WorkSessionCreate, WorkSessionUpdate, WorkSessionQuery } from '../types/workSession';

// Função auxiliar para verificar se o supabase está disponível
function isSupabaseAvailable(): boolean {
  return supabase !== undefined &&
         !!process.env.EXPO_PUBLIC_SUPABASE_URL &&
         !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
}

const WORK_SESSIONS_TABLE = 'work_sessions';

/**
 * Converte data de DD/MM/YYYY para YYYY-MM-DD
 */
export function convertDateToISO(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

/**
 * Converte data de YYYY-MM-DD para DD/MM/YYYY
 */
export function convertDateFromISO(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao converter data:', error);
    return dateStr;
  }
}

/**
 * Valida formato de hora HH:MM (24h)
 */
export function validateTimeFormat(time: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

/**
 * Obtém ID do dispositivo
 */
async function getDeviceId(): Promise<string | null> {
  try {
    // Gerar um ID único baseado em timestamp e random
    // Em produção, você pode usar expo-device ou outro método
    const deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return deviceId;
  } catch (error) {
    console.error('Erro ao obter device ID:', error);
    return null;
  }
}

/**
 * Obtém IP do dispositivo (quando disponível)
 */
function getDeviceIP(): string | null {
  // Em React Native, obter IP real é complexo
  // Retornar null por enquanto
  return null;
}

/**
 * Verifica se hora_saida < hora_entrada (overnight)
 */
function isOvernight(horaEntrada: string | null, horaSaida: string | null): boolean {
  if (!horaEntrada || !horaSaida) return false;
  
  const [hEntrada, mEntrada] = horaEntrada.split(':').map(Number);
  const [hSaida, mSaida] = horaSaida.split(':').map(Number);
  
  const minutosEntrada = hEntrada * 60 + mEntrada;
  const minutosSaida = hSaida * 60 + mSaida;
  
  return minutosSaida < minutosEntrada;
}

/**
 * Busca registros de ponto
 */
export async function getWorkSessions(query: WorkSessionQuery): Promise<WorkSession[]> {
  try {
    // Verificar se o Supabase está configurado
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    
    console.log('🔍 Verificando configuração Supabase:', {
      urlExists: !!supabaseUrl,
      urlLength: supabaseUrl.length,
      keyExists: !!supabaseKey,
      keyLength: supabaseKey.length,
      urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'vazio',
    });
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === '' || supabaseKey === '') {
      const errorMsg = 'Supabase não configurado. Verifique as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // Verificar se o cliente Supabase está disponível
    if (!isSupabaseAvailable()) {
      const errorMsg = 'Supabase não configurado. Verifique as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('📡 Tentando buscar work_sessions...', {
      usuario_id: query.usuario_id,
      from: query.from,
      to: query.to,
    });

    let supabaseQuery = supabase
      .from(WORK_SESSIONS_TABLE)
      .select('*')
      .eq('usuario_id', query.usuario_id)
      .order('data', { ascending: false })
      .order('created_at', { ascending: false });

    if (query.from) {
      supabaseQuery = supabaseQuery.gte('data', query.from);
    }
    if (query.to) {
      supabaseQuery = supabaseQuery.lte('data', query.to);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('❌ Erro do Supabase ao buscar work_sessions:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      
      // Mensagem mais amigável baseada no tipo de erro
      let errorMessage = 'Erro ao buscar registros de ponto.';
      
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        errorMessage = 'Tabela work_sessions não encontrada. Execute o script SQL work-sessions-setup.sql no Supabase.';
      } else if (error.code === '42501' || error.message?.includes('permission denied')) {
        errorMessage = 'Permissão negada. Verifique as políticas RLS (Row Level Security) no Supabase.';
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      const enhancedError: any = new Error(errorMessage);
      enhancedError.originalError = error;
      enhancedError.code = error.code;
      throw enhancedError;
    }

    console.log('✅ work_sessions encontrados:', data?.length || 0);
    return (data || []) as WorkSession[];
  } catch (error: any) {
    console.error('❌ Erro ao buscar work_sessions:', {
      message: error.message,
      code: error.code,
      originalError: error.originalError,
      errorType: error.constructor?.name,
      stack: error.stack?.substring(0, 500),
    });
    
    // Verificar se é erro de rede
    if (error.message?.includes('Network request failed') || 
        error.message?.includes('fetch') ||
        error.message?.includes('Failed to fetch') ||
        error.originalError?.message?.includes('Network request failed')) {
      const networkError: any = new Error(
        'Erro de conexão com Supabase.\n\n' +
        'Verifique:\n' +
        '• URL do Supabase está correta no .env\n' +
        '• Conexão com internet está funcionando\n' +
        '• URL do Supabase começa com https://\n' +
        '• Chave anon está correta'
      );
      networkError.isNetworkError = true;
      throw networkError;
    }
    
    // Se já é um erro tratado, apenas relançar
    if (error.message && !error.message.includes('Erro ao buscar')) {
      throw error;
    }
    
    // Caso contrário, criar erro genérico
    throw new Error(error.message || 'Erro desconhecido ao buscar registros de ponto.');
  }
}

/**
 * Cria um novo registro de ponto
 */
export async function createWorkSession(session: WorkSessionCreate): Promise<WorkSession> {
  try {
    // Validações
    if (!session.data) {
      throw new Error('Data é obrigatória');
    }

    if (!session.hora_entrada && !session.hora_saida) {
      throw new Error('Pelo menos hora_entrada ou hora_saida deve ser informada');
    }

    if (session.hora_entrada && !validateTimeFormat(session.hora_entrada)) {
      throw new Error('Formato de hora_entrada inválido. Use HH:MM (24h)');
    }

    if (session.hora_saida && !validateTimeFormat(session.hora_saida)) {
      throw new Error('Formato de hora_saida inválido. Use HH:MM (24h)');
    }

    // Converter data de DD/MM/YYYY para YYYY-MM-DD se necessário
    let dataISO = session.data;
    if (session.data.includes('/')) {
      dataISO = convertDateToISO(session.data);
    }

    // Verificar se já existe entrada sem saída (conflito)
    const existingSessions = await getWorkSessions({
      usuario_id: session.usuario_id,
      from: dataISO,
      to: dataISO,
    });

    const hasOpenSession = existingSessions.some(
      (s) => s.hora_entrada && !s.hora_saida
    );

    if (hasOpenSession && session.hora_entrada) {
      const error: any = new Error('Existe um registro de entrada sem saída. Edite esse registro ou registre a saída.');
      error.status = 409;
      throw error;
    }

    // Rate limit: verificar se há mais de 10 registros no mesmo dia
    const dailyCount = existingSessions.length;
    if (dailyCount >= 10 && !session.observacoes) {
      const error: any = new Error('Limite de registros excedido. Adicione uma observação para justificar.');
      error.status = 429;
      throw error;
    }

    // Calcular overnight
    const overnight = isOvernight(session.hora_entrada || null, session.hora_saida || null);

    // Obter metadados
    const deviceId = session.created_by_device_id || await getDeviceId();
    const ip = session.created_by_ip || getDeviceIP();

    // Preparar dados para inserção
    const insertData: any = {
      usuario_id: session.usuario_id,
      data: dataISO,
      hora_entrada: session.hora_entrada || null,
      hora_saida: session.hora_saida || null,
      overnight,
      observacoes: session.observacoes || null,
      source: session.source || 'mobile',
      created_by_device_id: deviceId,
      created_by_ip: ip,
    };

    if (!isSupabaseAvailable()) {
      throw new Error('Supabase não configurado. Verifique as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env');
    }

    const { data, error } = await supabase
      .from(WORK_SESSIONS_TABLE)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar work_session:', error);
      throw error;
    }

    return data as WorkSession;
  } catch (error: any) {
    console.error('Erro ao criar work_session:', error);
    throw error;
  }
}

/**
 * Atualiza um registro de ponto
 */
export async function updateWorkSession(
  id: number,
  update: WorkSessionUpdate
): Promise<WorkSession> {
  try {
    // Validações
    if (!update.edit_reason || update.edit_reason.trim() === '') {
      throw new Error('Justificativa obrigatória para editar o registro.');
    }

    if (update.hora_entrada && !validateTimeFormat(update.hora_entrada)) {
      throw new Error('Formato de hora_entrada inválido. Use HH:MM (24h)');
    }

    if (update.hora_saida && !validateTimeFormat(update.hora_saida)) {
      throw new Error('Formato de hora_saida inválido. Use HH:MM (24h)');
    }

    if (!isSupabaseAvailable()) {
      throw new Error('Supabase não configurado. Verifique as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env');
    }

    // Buscar registro atual
    const { data: currentData, error: fetchError } = await supabase
      .from(WORK_SESSIONS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentData) {
      throw new Error('Registro não encontrado');
    }

    // Calcular overnight se ambas as horas estiverem presentes
    let overnight = currentData.overnight;
    const horaEntrada = update.hora_entrada !== undefined ? update.hora_entrada : currentData.hora_entrada;
    const horaSaida = update.hora_saida !== undefined ? update.hora_saida : currentData.hora_saida;
    
    if (horaEntrada && horaSaida) {
      overnight = isOvernight(horaEntrada, horaSaida);
    }

    // Preparar dados para atualização
    const updateData: any = {
      hora_entrada: update.hora_entrada !== undefined ? update.hora_entrada : currentData.hora_entrada,
      hora_saida: update.hora_saida !== undefined ? update.hora_saida : currentData.hora_saida,
      observacoes: update.observacoes !== undefined ? update.observacoes : currentData.observacoes,
      overnight,
      edited_at: new Date().toISOString(),
      edited_by: update.edited_by,
      edit_reason: update.edit_reason,
      source: 'manual_edit',
    };

    const { data, error } = await supabase
      .from(WORK_SESSIONS_TABLE)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar work_session:', error);
      throw error;
    }

    return data as WorkSession;
  } catch (error: any) {
    console.error('Erro ao atualizar work_session:', error);
    throw error;
  }
}

/**
 * Deleta um registro de ponto (apenas admins)
 */
export async function deleteWorkSession(id: number): Promise<void> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase não configurado. Verifique as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env');
    }

    const { error } = await supabase
      .from(WORK_SESSIONS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar work_session:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao deletar work_session:', error);
    throw error;
  }
}

