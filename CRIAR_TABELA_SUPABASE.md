# ✅ Criar Tabela work_sessions no Supabase

## 🚨 Erro Atual
```
Could not find the table "public.work_sessions" in the schema cache
```

Isso significa que a tabela ainda não foi criada no banco de dados.

## 📋 Passo a Passo

### 1. Acessar Supabase Dashboard

1. Acesse: https://app.supabase.com
2. Faça login na sua conta
3. Selecione o projeto **MonitorarCarro** (ou o nome do seu projeto)

### 2. Abrir SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique no botão **"New query"** (Nova consulta)

### 3. Executar o Script SQL

1. Abra o arquivo `work-sessions-setup.sql` neste projeto
2. **Copie TODO o conteúdo** do arquivo
3. **Cole no SQL Editor** do Supabase
4. Clique em **"Run"** (Executar) ou pressione `Ctrl+Enter`

### 4. Verificar se Funcionou

1. Vá em **"Table Editor"** no menu lateral
2. Procure pela tabela **`work_sessions`**
3. Se aparecer, está tudo certo! ✅

### 5. Recarregar o App

1. No terminal, pressione **`r`** para recarregar
2. Ou feche e abra o app novamente
3. O erro deve desaparecer!

## 🔍 Se Der Erro ao Executar

### Erro: "relation already exists"
- Significa que a tabela já existe
- Pode ignorar ou deletar a tabela e criar novamente

### Erro: "permission denied"
- Verifique se está logado no projeto correto
- Verifique se tem permissões de administrador

### Erro: "syntax error"
- Verifique se copiou o SQL completo
- Verifique se não há caracteres estranhos

## 📝 Estrutura da Tabela

A tabela `work_sessions` terá:
- `id` - ID único (auto-incremento)
- `usuario_id` - ID do usuário
- `data` - Data do ponto (DATE)
- `hora_entrada` - Hora de entrada (TIME)
- `hora_saida` - Hora de saída (TIME)
- `overnight` - Se é turno noturno (BOOLEAN)
- `observacoes` - Observações (TEXT)
- `source` - Origem do registro (mobile/web/etc)
- `created_at` - Data de criação
- `created_by_ip` - IP de origem
- `created_by_device_id` - ID do dispositivo
- `edited_at` - Data de edição
- `edited_by` - Quem editou
- `edit_reason` - Motivo da edição

## ✅ Após Criar a Tabela

O app deve funcionar normalmente! Os registros de ponto serão salvos no Supabase.

