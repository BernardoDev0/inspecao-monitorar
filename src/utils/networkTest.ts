/**
 * Teste de conexão de rede para diagnóstico
 */
export async function testNetworkConnection(serverUrl: string = 'http://192.168.0.34:8082'): Promise<{
  success: boolean;
  error?: string;
  status?: number;
  body?: string;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${serverUrl}/status`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeout);
    
    const status = response.status;
    const text = await response.text();
    
    return {
      success: true,
      status,
      body: text.slice(0, 500),
    };
  } catch (error: any) {
    console.error('Network test error:', error);
    
    let errorMessage = 'Erro desconhecido';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Timeout: Servidor não respondeu em 5 segundos';
    } else if (error.message?.includes('Network request failed')) {
      errorMessage = 'Falha na requisição de rede. Verifique:\n- Dispositivo e máquina na mesma rede Wi-Fi\n- Firewall não bloqueando porta 8082\n- Metro bundler rodando';
    } else if (error.message?.includes('Failed to connect')) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique o IP e porta.';
    } else {
      errorMessage = error.message || String(error);
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Testa múltiplas URLs possíveis
 */
export async function testMultipleEndpoints(): Promise<Array<{
  url: string;
  result: Awaited<ReturnType<typeof testNetworkConnection>>;
}>> {
  const endpoints = [
    'http://192.168.0.34:8082',
    'http://10.0.2.2:8082', // Emulador Android
    'http://localhost:8082',
  ];
  
  const results = await Promise.all(
    endpoints.map(async (url) => ({
      url,
      result: await testNetworkConnection(url),
    }))
  );
  
  return results;
}

