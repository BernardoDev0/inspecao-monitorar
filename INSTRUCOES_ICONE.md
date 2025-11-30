# Instruções para criar ícones com fundo transparente

## Problema Identificado
O ícone atual está com zoom excessivo e provavelmente não tem fundo transparente.

## Solução
Siga estas etapas para criar ícones apropriados:

### 1. Criar ícone principal (icon.png) - 1024x1024px

Use um editor de imagens como GIMP, Photoshop ou Canva:

1. Crie uma nova imagem de 1024x1024 pixels
2. Posicione o ícone/símbolo do monitorar no centro
3. Deixe um espaço de aproximadamente 10-15% de margem em todos os lados
4. Salve como PNG com fundo transparente
5. Nomeie como "icon.png" e substitua o arquivo em assets/icon.png

### 2. Criar ícone adaptativo para Android (adaptive-icon.png) - 1024x1024px

Este ícone deve ter fundo branco ou colorido, pois o Android recorta em forma circular:

1. Crie uma nova imagem de 1024x1024 pixels
2. Use um fundo sólido (ex: #0A0E27 como no seu splash)
3. Posicione o ícone/símbolo do monitorar com margem adequada
4. Salve como PNG
5. Nomeie como "adaptive-icon.png" e substitua o arquivo em assets/adaptive-icon.png

### 3. Atualizar o splash-icon.png se necessário

1. Certifique-se de que tem tamanho adequado (pelo menos 1284x2778 pixels)
2. O símbolo deve estar centralizado com boa visibilidade
3. Salve como PNG
4. Substitua o arquivo em assets/splash-icon.png

## Alternativas Online

Se não tiver um editor de imagens:

1. Use https://www.photopea.com (versão online gratuita do Photoshop)
2. Use https://pixlr.com (editor online)
3. Use o gerador de ícones do Figma ou Canva

## Verificação

Após criar os novos ícones:

1. Verifique os tamanhos: 1024x1024px para ícones principais
2. Verifique que o fundo é transparente nos ícones apropriados
3. Verifique que o ícone não está muito grande (zoom excessivo) dentro da imagem
4. Teste com `npx expo prebuild --clean` para regenerar os arquivos nativos

## Configuração do app.json

Seu app.json já está configurado corretamente:
- "icon": "./assets/icon.png"
- "adaptiveIcon": { "foregroundImage": "./assets/icon.png", "backgroundColor": "#0A0E27" }
