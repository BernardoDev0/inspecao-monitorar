# Instruções para Configurar o Ícone do App

## 📱 Converter o ícone .ico para PNG

O Expo/React Native requer ícones no formato PNG. Para usar o `simbolo-monitorar.ico` como ícone do app:

### Opção 1: Converter online
1. Acesse um conversor online (ex: https://convertio.co/ico-png/)
2. Faça upload do arquivo `simbolo-monitorar.ico`
3. Baixe o arquivo PNG convertido
4. Renomeie para `icon.png`
5. Substitua o arquivo em `assets/icon.png`

### Opção 2: Usar ferramenta local
- Use o Paint do Windows ou outro editor de imagens
- Abra o arquivo `simbolo-monitorar.ico`
- Salve como PNG
- Renomeie para `icon.png`
- Substitua o arquivo em `assets/icon.png`

### Tamanhos recomendados:
- **icon.png**: 1024x1024 pixels (para o ícone principal)
- **adaptive-icon.png**: 1024x1024 pixels (para Android)
- **splash-icon.png**: 1284x2778 pixels (para splash screen)

Após substituir o arquivo, execute:
```bash
npx expo prebuild --clean
```

Ou simplesmente reinicie o servidor Expo.

