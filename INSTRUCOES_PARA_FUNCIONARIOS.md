# 🚗 Instruções para Instalação do App de Inspeção de Veículos

## ⚠️ IMPORTANTE: Configuração Necessária para Sincronização de Dados

Para que todos os dados das inspeções fiquem disponíveis para você (CEO) em um banco de dados centralizado, é **obrigatório** configurar as credenciais do banco de dados em cada dispositivo que utilizar o app.

## 🔧 Passo a Passo para Configuração:

### 1. Obter as Credenciais do Banco de Dados
Você precisa obter do administrador do sistema:
- **URL do Banco:** Exemplo: `https://seuprojeto.supabase.co`
- **Chave de Acesso:** Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.etc...`

### 2. Configurar o Arquivo de Credenciais
1. No diretório do app, crie um arquivo chamado `.env` (não esqueça o ponto no início!)
2. Adicione as seguintes linhas no arquivo:

```
EXPO_PUBLIC_SUPABASE_URL=SUA_URL_AQUI
EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_AQUI
```

Substitua `SUA_URL_AQUI` e `SUA_CHAVE_AQUI` pelas credenciais fornecidas.

### 3. Reiniciar o Aplicativo
Após criar o arquivo `.env`, é necessário reiniciar completamente o aplicativo para que as credenciais sejam carregadas.

## 🔍 O que acontece sem as credenciais?
- ✅ O app **funciona normalmente** para registrar inspeções
- ❌ As inspeções **ficam apenas no dispositivo local**
- ❌ As inspeções **não aparecem na área do CEO**
- ❌ Os dados **não são sincronizados** com o banco de dados central

## ✅ O que acontece com as credenciais corretas?
- ✅ O app **funciona normalmente** para registrar inspeções
- ✅ As inspeções **são salvas no banco de dados compartilhado**
- ✅ As inspeções **aparecem na área do CEO**
- ✅ Os dados **são sincronizados** entre todos os dispositivos

## 🚨 Problemas Comuns:
- Se o app mostrar mensagens como "Credenciais do Supabase não configuradas" ou "Dados salvos apenas localmente", significa que o arquivo `.env` está faltando ou incorreto.
- Certifique-se de que todas as instâncias do app estejam usando as **mesmas credenciais** para que os dados sejam compartilhados corretamente.

## 💡 Dica de Segurança:
O arquivo `.env` contém informações sensíveis e **não deve ser compartilhado publicamente** ou adicionado a repositórios de código público.