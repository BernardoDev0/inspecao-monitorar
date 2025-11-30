# 🆓 Opções de Banco de Dados Gratuito Permanente

## ❌ SQLite - NÃO SERVE (Local apenas)

SQLite é um banco **local no dispositivo**. Cada usuário teria seu próprio banco isolado. **Não serve** para múltiplos usuários compartilharem dados.

## ✅ Opções de Banco na Nuvem (Gratuito Permanente)

### 1. 🍃 MongoDB Atlas (RECOMENDADO)

**Por quê?**
- ✅ **Gratuito para sempre** (plano Free Forever)
- ✅ **512 MB** de armazenamento (suficiente para começar)
- ✅ **Sem limite de tempo** - nunca expira
- ✅ **Fácil integração** com React Native
- ✅ **Bem documentado**

**Limites do plano gratuito:**
- 512 MB armazenamento
- Compartilhado (RAM/CPU compartilhados)
- Sem limite de tempo

**Como funciona:**
1. Criar conta em https://www.mongodb.com/cloud/atlas/register
2. Criar cluster gratuito
3. Obter connection string
4. Usar no app

---

### 2. 🪐 PlanetScale (MySQL)

**Por quê?**
- ✅ **Gratuito permanente**
- ✅ **5 GB** de armazenamento
- ✅ **MySQL compatível** (familiar)
- ✅ **Branching** (como Git para banco)

**Limites:**
- 5 GB armazenamento
- 1 bilhão de reads/mês
- 10 milhões de writes/mês

---

### 3. 🚂 Railway

**Por quê?**
- ✅ **$5 crédito grátis/mês** (renova sempre)
- ✅ **Fácil deploy**
- ✅ **PostgreSQL ou MySQL**

**Limites:**
- $5 crédito grátis/mês (renova)
- Suficiente para apps pequenos/médios

---

### 4. 🎨 Neon (PostgreSQL)

**Por quê?**
- ✅ **Gratuito permanente**
- ✅ **PostgreSQL** (como Supabase)
- ✅ **3 GB** de armazenamento

**Limites:**
- 3 GB armazenamento
- 0.5 vCPU
- 1 GB RAM

---

## 🏆 Recomendação: MongoDB Atlas

### Vantagens:
1. **Mais fácil** de integrar com React Native
2. **Documentação excelente** em português
3. **Não expira nunca**
4. **Escala bem** quando crescer
5. **SDK oficial** para React Native

### Como funciona:
- Você cria um cluster MongoDB na nuvem
- O app se conecta via connection string
- Todos os usuários acessam o mesmo banco
- Dados ficam na nuvem (como Supabase)

---

## 📊 Comparação Rápida

| Serviço | Armazenamento | Expira? | Dificuldade |
|---------|---------------|---------|-------------|
| **MongoDB Atlas** | 512 MB | ❌ Nunca | ⭐ Fácil |
| **PlanetScale** | 5 GB | ❌ Nunca | ⭐⭐ Médio |
| **Neon** | 3 GB | ❌ Nunca | ⭐⭐ Médio |
| **Railway** | Ilimitado* | ❌ Nunca | ⭐⭐⭐ Difícil |
| **SQLite** | Ilimitado | ❌ Nunca | ⭐ Fácil (mas local) |

*Limitado pelo crédito de $5/mês

---

## 🎯 Próximo Passo

**Recomendo MongoDB Atlas** porque:
- É o mais fácil de integrar
- Não expira nunca
- Tem boa documentação
- É gratuito permanente

Quer que eu migre o código para MongoDB Atlas?

