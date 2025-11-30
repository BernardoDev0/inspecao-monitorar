# Configuração do Supabase

## ⚠️ IMPORTANTE: Erro "Could not find the table 'public.inspections'"

Se você está vendo o erro:
```
Could not find the table 'public.inspections' in the schema cache
```

Isso significa que a tabela ainda não foi criada no banco de dados. Siga os passos abaixo para criar a tabela.

## Passos para configurar o Supabase

### 1. Criar a tabela no Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute o SQL do arquivo `supabase-setup.sql`
5. Após executar, a tabela `inspections` será criada e o erro desaparecerá

### 2. Configurar variáveis de ambiente

As credenciais do Supabase são configuradas através do arquivo `.env` na raiz do projeto:

1. O arquivo `.env` já foi criado com as credenciais atuais
2. Se precisar alterar, edite o arquivo `.env` com suas credenciais:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
3. **Importante**: O arquivo `.env` está no `.gitignore` e não será commitado no Git (por segurança)
4. Existe um arquivo `.env.example` como template para referência

**⚠️ Nota**: No Expo, variáveis de ambiente devem começar com `EXPO_PUBLIC_` para serem acessíveis no código.

### 3. Estrutura da tabela

A tabela `inspections` possui os seguintes campos:

- `id` (TEXT, PRIMARY KEY) - ID único da inspeção
- `date` (TEXT) - Data da inspeção
- `time` (TEXT) - Horário de retirada
- `mileage` (NUMERIC) - Quilometragem
- `damages` (JSONB) - Array de danos (JSON)
- `plate` (TEXT) - Placa do veículo
- `vehicle_name` (TEXT) - Nome do veículo
- `saved_at` (TEXT) - Timestamp de quando foi salvo
- `created_at` (TIMESTAMP) - Data de criação no banco

### 4. Funcionamento

O app funciona de forma híbrida:
- **Salva localmente** (AsyncStorage) para funcionar offline
- **Sincroniza com Supabase** quando há conexão
- **Combina dados** locais e do Supabase ao buscar

### 5. Políticas de Segurança (RLS)

As políticas atuais permitem:
- ✅ Leitura pública
- ✅ Inserção pública
- ✅ Atualização pública
- ✅ Exclusão pública

**⚠️ IMPORTANTE**: Se você já criou a tabela antes e não consegue excluir dados, execute o SQL do arquivo `add-delete-policy.sql` no SQL Editor do Supabase para adicionar a política de DELETE.

**⚠️ IMPORTANTE**: Para produção, ajuste as políticas RLS conforme sua necessidade de segurança.

