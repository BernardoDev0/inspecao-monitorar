# 📱 Guia de Build e Distribuição do App

Este guia explica como gerar os arquivos de instalação (APK para Android e IPA para iOS) para distribuir o app.

## 🚀 Opção 1: EAS Build (Recomendado - Mais Fácil)

O EAS Build é o serviço oficial do Expo para gerar builds de produção sem precisar configurar ambientes nativos.

### Pré-requisitos

1. **Instalar EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Fazer login no Expo**:
   ```bash
   eas login
   ```

3. **Configurar o projeto**:
   ```bash
   eas build:configure
   ```

### Gerar Builds

#### Para Android (APK - Instalação Direta)
```bash
npm run build:android
```
Ou:
```bash
eas build --platform android --profile preview
```

Isso gera um **APK** que pode ser instalado diretamente no Android.

#### Para Android (AAB - Google Play Store)
```bash
eas build --platform android --profile production
```

Isso gera um **AAB** para publicar na Google Play Store.

#### Para iOS (IPA - TestFlight/App Store)
```bash
npm run build:ios
```
Ou:
```bash
eas build --platform ios
```

**Nota**: Para iOS, você precisa de:
- Conta de desenvolvedor Apple (paga - $99/ano)
- Certificados configurados

### Perfis de Build

Crie um arquivo `eas.json` na raiz do projeto:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "bundleIdentifier": "com.monitorar.vehicleinspection"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🔧 Opção 2: Build Local (Avançado)

### Android (APK Local)

1. **Gerar projeto nativo**:
   ```bash
   npx expo prebuild
   ```

2. **Build APK** (requer Android Studio):
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   
   O APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

### iOS (IPA Local)

1. **Gerar projeto nativo**:
   ```bash
   npx expo prebuild
   ```

2. **Abrir no Xcode**:
   ```bash
   open ios/vehicle-inspection-app.xcworkspace
   ```

3. **Build no Xcode**:
   - Selecione "Any iOS Device" como destino
   - Product > Archive
   - Distribuir o app

---

## 📦 Distribuição

### Android

#### Opção A: Instalação Direta (APK)
1. Gere o APK usando EAS Build
2. Envie o arquivo `.apk` para os usuários
3. Eles precisam habilitar "Fontes desconhecidas" nas configurações
4. Instalam tocando no arquivo APK

#### Opção B: Google Play Store (AAB)
1. Gere o AAB usando EAS Build
2. Acesse [Google Play Console](https://play.google.com/console)
3. Crie uma conta de desenvolvedor ($25 única vez)
4. Faça upload do AAB
5. Publique o app

### iOS

#### Opção A: TestFlight (Beta Testing)
1. Gere o IPA usando EAS Build
2. Use `eas submit` para enviar ao TestFlight
3. Adicione testadores via App Store Connect
4. Eles recebem convite por email

#### Opção B: App Store
1. Gere o IPA usando EAS Build
2. Use `eas submit` para enviar à App Store
3. Complete o processo de review na App Store Connect
4. Publique o app

---

## 🔐 Configurações Importantes

### Variáveis de Ambiente

Certifique-se de que o arquivo `.env` está configurado com as credenciais do Supabase:

```
EXPO_PUBLIC_SUPABASE_URL=sua-url-aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

**Importante**: As variáveis `EXPO_PUBLIC_*` são incluídas no build. Não coloque chaves secretas aqui!

### Ícones e Splash Screen

Verifique se os arquivos estão corretos:
- `assets/icon.png` - 1024x1024px
- `assets/adaptive-icon.png` - 1024x1024px (Android)
- `assets/splash-icon.png` - Para splash screen

---

## 📋 Checklist Antes do Build

- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Ícones atualizados e no tamanho correto
- [ ] Versão atualizada no `app.json`
- [ ] Testado em desenvolvimento
- [ ] Supabase configurado e funcionando
- [ ] Políticas RLS configuradas no Supabase

---

## 🆘 Problemas Comuns

### Erro: "No credentials found"
- Execute `eas build:configure` novamente
- Verifique se está logado: `eas whoami`

### Erro: "Bundle identifier already exists"
- Altere o `bundleIdentifier` no `app.json` para algo único

### Build falha no Android
- Verifique se o `package` no `app.json` está correto
- Certifique-se de que o `versionCode` está incrementado

### Build falha no iOS
- Verifique se tem conta de desenvolvedor Apple
- Configure os certificados: `eas credentials`

---

## 📞 Suporte

Para mais informações:
- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação Expo](https://docs.expo.dev/)

