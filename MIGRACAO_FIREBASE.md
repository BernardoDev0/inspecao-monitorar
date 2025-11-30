# 🔥 Migração para Firebase (Gratuito Permanente)

## Por que Firebase?

✅ **Gratuito para sempre** - Plano Spark (gratuito) não expira
✅ **Sem limite de tempo** - Diferente do Supabase que pausa projetos inativos
✅ **Bem documentado** - Muitos tutoriais e exemplos
✅ **Fácil integração** - SDK oficial do Google
✅ **Limites generosos** - 1GB armazenamento, 50K leituras/dia, 20K escritas/dia

## 📋 Passo a Passo

### 1. Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Nome do projeto: `MonitorarCarro` (ou outro nome)
4. **Desative** Google Analytics (opcional, para simplificar)
5. Clique em **"Criar projeto"**

### 2. Criar App Web no Firebase

1. No projeto criado, clique no ícone **</>** (Web)
2. Registre o app com nome: `Vehicle Inspection App`
3. **NÃO** marque "Also set up Firebase Hosting"
4. Copie as credenciais que aparecerem (será algo como):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3. Ativar Firestore Database

1. No menu lateral, vá em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Começar no modo de teste"** (para desenvolvimento)
4. Escolha uma localização (ex: `southamerica-east1` para Brasil)
5. Clique em **"Ativar"**

### 4. Configurar Regras de Segurança (Temporário para Dev)

1. Vá em **"Regras"** (Rules)
2. Cole este código temporário (apenas para desenvolvimento):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ APENAS PARA DESENVOLVIMENTO
    }
  }
  match /work_sessions/{sessionId} {
    allow read, write: if true; // ⚠️ APENAS PARA DESENVOLVIMENTO
  }
}
```

3. Clique em **"Publicar"**

⚠️ **IMPORTANTE**: Essas regras permitem qualquer acesso. Para produção, configure regras adequadas.

### 5. Instalar Firebase no Projeto

```bash
cd vehicle-inspection-app
npm install firebase
```

### 6. Configurar Variáveis de Ambiente

Crie/atualize o arquivo `.env`:

```env
# Firebase (substitua pelos seus valores)
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 7. Estrutura de Dados no Firestore

A coleção será `work_sessions` com documentos assim:

```json
{
  "id": "auto-gerado",
  "usuario_id": 1,
  "data": "2025-11-21",
  "hora_entrada": "08:00",
  "hora_saida": "17:00",
  "overnight": false,
  "observacoes": "Texto opcional",
  "source": "mobile",
  "created_at": "2025-11-21T10:00:00Z",
  "created_by_ip": null,
  "created_by_device_id": "device-123",
  "edited_at": null,
  "edited_by": null,
  "edit_reason": null
}
```

## 🔄 Próximos Passos

Após configurar o Firebase, vou atualizar o código para usar Firestore ao invés de Supabase.

## 📊 Comparação de Limites

### Firebase (Gratuito)
- **Armazenamento**: 1 GB
- **Leituras**: 50.000/dia
- **Escritas**: 20.000/dia
- **Expição**: Nunca (gratuito permanente)

### Supabase (Gratuito)
- **Armazenamento**: 500 MB
- **Bandwidth**: 2 GB
- **Expição**: Pausa após inatividade

## ✅ Vantagens do Firebase

1. **Não pausa** projetos inativos
2. **Mais estável** para apps em produção
3. **Melhor documentação** em português
4. **SDK mais maduro** para React Native
5. **Integração fácil** com outros serviços Google

