# ✅ Verificação Rápida - Supabase

## 🔍 Diagnóstico do Erro

O erro "Erro ao buscar work_sessions" geralmente indica um dos seguintes problemas:

### 1. Tabela não criada
A tabela `work_sessions` não existe no Supabase.

**Solução:**
1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Cole e execute o conteúdo do arquivo `work-sessions-setup.sql`
5. Verifique se a tabela foi criada em **Table Editor**

### 2. Variáveis de ambiente não configuradas

**Verificar:**
1. Existe arquivo `.env` na raiz do projeto `vehicle-inspection-app/`?
2. O arquivo contém:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   ```

**Solução:**
1. Crie o arquivo `.env` na raiz do projeto
2. Adicione as variáveis acima com suas credenciais do Supabase
3. Reinicie o Metro bundler: `npx expo start --clear`

### 3. Políticas RLS bloqueando

As políticas de Row Level Security podem estar bloqueando o acesso.

**Verificar:**
1. No Supabase Dashboard, vá em **Authentication** > **Policies**
2. Verifique se há políticas para a tabela `work_sessions`
3. Ou execute novamente o script `work-sessions-setup.sql` que cria as políticas

**Solução temporária (apenas para desenvolvimento):**
```sql
-- Desabilitar RLS temporariamente (NÃO RECOMENDADO PARA PRODUÇÃO)
ALTER TABLE work_sessions DISABLE ROW LEVEL SECURITY;
```

### 4. Credenciais incorretas

**Verificar:**
1. No Supabase Dashboard, vá em **Settings** > **API**
2. Confirme que está usando:
   - **Project URL** (não a URL de API)
   - **anon/public key** (não a service_role key)

## 🧪 Teste Rápido

### No Supabase SQL Editor, execute:

```sql
-- Verificar se a tabela existe
SELECT * FROM work_sessions LIMIT 1;
```

**Se der erro "relation does not exist"**: Tabela não foi criada. Execute `work-sessions-setup.sql`.

**Se retornar vazio ou dados**: Tabela existe e está funcionando.

### Teste de inserção:

```sql
-- Testar inserção
INSERT INTO work_sessions (usuario_id, data, hora_entrada)
VALUES (1, CURRENT_DATE, '08:00')
RETURNING *;
```

**Se der erro de permissão**: Problema com RLS. Execute novamente o script de setup.

## 📋 Checklist Rápido

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `.env` contém `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Tabela `work_sessions` existe no Supabase (verificar em Table Editor)
- [ ] Script `work-sessions-setup.sql` foi executado completamente
- [ ] Políticas RLS foram criadas (verificar em Authentication > Policies)
- [ ] Metro bundler foi reiniciado após criar `.env`

## 🔄 Após Corrigir

1. **Reinicie o Metro bundler:**
   ```bash
   npx expo start --clear
   ```

2. **Recarregue o app** (pressione 'r' no terminal ou agite o dispositivo)

3. **Teste novamente** a tela de Bater Ponto

## 📞 Se o Problema Persistir

Envie:
- Mensagem de erro completa do console
- Resultado do teste SQL acima
- Confirmação de que a tabela existe no Table Editor
- Screenshot das políticas RLS (se possível)

