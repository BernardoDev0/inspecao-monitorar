import { Inspection } from '../types';
import { supabase, INSPECTIONS_TABLE } from '../config/supabase';

// Função auxiliar para verificar se o supabase está disponível
function isSupabaseAvailable(): boolean {
  return supabase !== undefined &&
         !!process.env.EXPO_PUBLIC_SUPABASE_URL &&
         !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
}


// Salvar uma inspeção (apenas Supabase)
export async function saveInspection(data: Inspection): Promise<void> {
  try {
    // Verificar se o Supabase está disponível
    if (!isSupabaseAvailable()) {
      throw new Error('Credenciais do Supabase não configuradas ou indisponíveis');
    }

    const { error: supabaseError } = await supabase
      .from(INSPECTIONS_TABLE)
      .upsert({
        id: data.id,
        date: data.date,
        time: data.time,
        mileage: data.mileage,
        damages: data.damages,
        plate: data.plate,
        vehicle_name: data.vehicleName,
        saved_at: data.savedAt,
        observacoes: data.observacoes || null,
        employee_name: data.employeeName || null,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (supabaseError) {
      console.error('❌ Erro ao salvar no Supabase:', supabaseError.message);
      throw new Error(`Erro ao salvar no Supabase: ${supabaseError.message}`);
    } else {
      console.log('✅ Dados sincronizados com sucesso no banco de dados compartilhado');
    }
  } catch (error) {
    console.error('Erro ao salvar inspeção:', error);
    throw error;
  }
}

// Obter a última inspeção
export async function getLastInspection(): Promise<Inspection | null> {
  try {
    // Verificar se o Supabase está disponível
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Credenciais do Supabase não configuradas');
      console.error('ℹ️  Adicione EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY ao arquivo .env');
      console.error('ℹ️  IMPORTANTE: O app não funcionará corretamente sem essas credenciais');
      return null;
    }

    const { data: supabaseData, error: supabaseError } = await supabase
      .from(INSPECTIONS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (supabaseError) {
      console.error('❌ Erro ao buscar última inspeção do Supabase:', supabaseError.message);
      return null;
    }

    if (!supabaseData || supabaseData.length === 0) {
      return null;
    }

    const item = supabaseData[0];
    return {
      id: item.id,
      date: item.date,
      time: item.time,
      mileage: item.mileage,
      damages: item.damages || [],
      plate: item.plate,
      vehicleName: item.vehicle_name,
      savedAt: item.saved_at,
      observacoes: item.observacoes || undefined,
      employeeName: item.employee_name || undefined,
    };
  } catch (error) {
    console.error('Erro ao obter última inspeção:', error);
    return null;
  }
}

// Obter todas as inspeções (apenas Supabase)
export async function getAllInspections(): Promise<Inspection[]> {
  try {
    // Verificar se o Supabase está disponível
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Credenciais do Supabase não configuradas');
      console.error('ℹ️  Adicione EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY ao arquivo .env');
      console.error('ℹ️  IMPORTANTE: O app não funcionará corretamente sem essas credenciais');
      return [];
    }

    const { data: supabaseData, error: supabaseError } = await supabase
      .from(INSPECTIONS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (supabaseError) {
      console.error('❌ Erro ao buscar do Supabase:', supabaseError.message);
      console.error('ℹ️  Verifique suas credenciais do Supabase e conexão com a internet');
      throw new Error(`Erro ao buscar do Supabase: ${supabaseError.message}`);
    }

    // Converter dados do Supabase para formato Inspection
    const supabaseInspections = supabaseData.map((item: any) => ({
      id: item.id,
      date: item.date,
      time: item.time,
      mileage: item.mileage,
      damages: item.damages || [],
      plate: item.plate,
      vehicleName: item.vehicle_name,
      savedAt: item.saved_at,
      observacoes: item.observacoes || undefined,
      employeeName: item.employee_name || undefined,
    }));

    console.log(`✅ Carregados ${supabaseInspections.length} registros do banco de dados compartilhado`);

    return supabaseInspections;
  } catch (error) {
    console.error('Erro ao obter todas as inspeções:', error);
    return [];
  }
}

// Limpar todas as inspeções (apenas Supabase)
export async function clearAllInspections(): Promise<void> {
  try {
    // Verificar se o Supabase está disponível
    if (!isSupabaseAvailable()) {
      throw new Error('Credenciais do Supabase não configuradas ou indisponíveis');
    }

    const { error: supabaseError } = await supabase
      .from(INSPECTIONS_TABLE)
      .delete()
      .not('id', 'is', null); // Apagar todas as inspeções

    if (supabaseError) {
      console.error('❌ Erro ao limpar inspeções no Supabase:', supabaseError.message);
      throw new Error(`Erro ao limpar inspeções no Supabase: ${supabaseError.message}`);
    } else {
      console.log('✅ Todas as inspeções limpas do banco de dados compartilhado');
    }
  } catch (error) {
    console.error('Erro ao limpar inspeções:', error);
    throw error;
  }
}

// Limpar apenas inspeções antigas (não necessário mais com apenas Supabase)
export async function clearOldInspections(): Promise<void> {
  // Esta função não é mais necessária com o uso apenas do Supabase
  console.log('ℹ️ clearOldInspections não é mais usada - usando apenas Supabase');
}

// Deletar uma inspeção (apenas Supabase)
export async function deleteInspection(inspectionId: string): Promise<void> {
  try {
    // Verificar se o Supabase está disponível
    if (!isSupabaseAvailable()) {
      throw new Error('Credenciais do Supabase não configuradas ou indisponíveis');
    }

    const { error: supabaseError } = await supabase
      .from(INSPECTIONS_TABLE)
      .delete()
      .eq('id', inspectionId);

    if (supabaseError) {
      console.error('❌ Erro ao deletar do Supabase:', supabaseError.message);
      throw new Error(`Erro ao deletar do Supabase: ${supabaseError.message}`);
    } else {
      console.log('✅ Inspeção deletada do banco de dados compartilhado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao deletar inspeção:', error);
    throw error;
  }
}

// Deletar todas as inspeções (apenas Supabase)
export async function deleteAllInspections(): Promise<void> {
  try {
    // Verificar se o Supabase está disponível
    if (!isSupabaseAvailable()) {
      throw new Error('Credenciais do Supabase não configuradas ou indisponíveis');
    }

    const { error: supabaseError } = await supabase
      .from(INSPECTIONS_TABLE)
      .delete()
      .not('id', 'is', null); // Apagar todas as inspeções

    if (supabaseError) {
      console.error('❌ Erro ao deletar todas do Supabase:', supabaseError.message);
      throw new Error(`Erro ao deletar todas do Supabase: ${supabaseError.message}`);
    } else {
      console.log('✅ Todas as inspeções deletadas do banco de dados compartilhado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao deletar todas as inspeções:', error);
    throw error;
  }
}

// Atualizar uma inspeção (apenas Supabase)
export async function updateInspection(data: Inspection): Promise<void> {
  try {
    // Verificar se o Supabase está disponível
    if (!isSupabaseAvailable()) {
      throw new Error('Credenciais do Supabase não configuradas ou indisponíveis');
    }

    const { error: supabaseError } = await supabase
      .from(INSPECTIONS_TABLE)
      .update({
        date: data.date,
        time: data.time,
        mileage: data.mileage,
        damages: data.damages,
        plate: data.plate,
        vehicle_name: data.vehicleName,
        saved_at: data.savedAt,
        observacoes: data.observacoes || null,
        employee_name: data.employeeName || null,
      })
      .eq('id', data.id);

    if (supabaseError) {
      console.error('❌ Erro ao atualizar no Supabase:', supabaseError.message);
      throw new Error(`Erro ao atualizar no Supabase: ${supabaseError.message}`);
    } else {
      console.log('✅ Inspeção atualizada no banco de dados compartilhado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao atualizar inspeção:', error);
    throw error;
  }
}



