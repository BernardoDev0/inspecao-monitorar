import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase (lidas do arquivo .env)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Log de diagnóstico (sem expor a chave completa)
console.log('🔧 Configuração Supabase:', {
  urlExists: !!SUPABASE_URL,
  urlValid: SUPABASE_URL.startsWith('https://'),
  urlPreview: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'NÃO CONFIGURADO',
  keyExists: !!SUPABASE_ANON_KEY,
  keyLength: SUPABASE_ANON_KEY.length,
});

// Validar formato da URL
if (SUPABASE_URL && !SUPABASE_URL.startsWith('https://')) {
  console.error('❌ ERRO: URL do Supabase deve começar com https://');
  console.error('URL atual:', SUPABASE_URL.substring(0, 50));
}

// Validar se as variáveis de ambiente estão configuradas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env');
  console.error('ℹ️  Dica: Crie um arquivo .env na raiz do projeto com EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY');
  console.error('ℹ️  IMPORTANTE: Todos os dispositivos devem ter as mesmas credenciais para sincronizar os dados');
  // Não lançar erro, permitir que o app funcione offline, mas alertar
}

// Função para testar conexão com Supabase
export async function testSupabaseConnection(): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase.rpc('now');
    if (error) {
      console.error('❌ Falha na conexão com Supabase:', error.message);
      return false;
    }
    console.log('✅ Conexão com Supabase funcionando corretamente');
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão com Supabase:', error);
    return false;
  }
}

// Criar cliente Supabase com tratamento de erro
let supabase: any;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '') {
    // Validar URL antes de criar cliente
    if (!SUPABASE_URL.startsWith('https://')) {
      console.error('❌ URL do Supabase inválida. Deve começar com https://');
      throw new Error('URL do Supabase inválida');
    }

    console.log('✅ Criando cliente Supabase...');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
    });
    console.log('✅ Cliente Supabase criado com sucesso');
  } else {
    console.error('❌ Erro: Cliente Supabase não criado - faltam credenciais. Verifique o arquivo .env');
    // Criar cliente placeholder se não houver credenciais
    supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder');
  }
} catch (error: any) {
  console.error('❌ Erro ao criar cliente Supabase:', error.message || error);
  // Criar cliente placeholder para evitar crashes
  supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder');
}

export { supabase };

// Nome da tabela de inspeções
export const INSPECTIONS_TABLE = 'inspections';

