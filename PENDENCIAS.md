# 📋 Pendências e Próximos Passos — Plataforma-Estudo-Intencional-YouTube (IntentFlow)

> Documento de rastreabilidade do status técnico, validações automatizadas e pendências operacionais do **IntentFlow** (plataforma de estudo deliberado contra o feed infinito, baseada na YouTube Data API v3).

---

## ✅ 1. O que já está Concluído e Validado

- **Algoritmos & Motor Pedagógico (`src/lib/`):**
  - Algoritmo da **Mochila 0/1 (Knapsack)** para empacotamento finito de sessões dentro do orçamento de tempo (`10–90 min`).
  - Parser de capítulos (`extrairCapitulos` com `tempoSegundos` / `tempoFormatado`), repetição espaçada **SM-2**, gamificação (XP, níveis, badges e streak diário) e celebração Web Audio / confetti.
- **Interface & APIs (`src/app/` — Next.js 16 + React 19 + TypeScript + Tailwind v4):**
  - Modo Foco Zen (`Z`), atalhos de teclado contínuos (`N`, `K`, `J`, `L`, `M`, `C`, `?`, `Esc`), filtro de profundidade, gestão de canais, painel semanal com Recharts, revisão `/revisao`, resumo de sessão e conformidade LGPD (`/api/conta`, `/api/conta/exportar`).
  - Catálogo educativo offline curado como contingência segura quando `YOUTUBE_API_KEY` não está configurada ou o teto de cota diária (80%) é atingido.
- **Qualidade, Tipagem, Testes & Build (`.github/workflows/ci.yml`):**
  - **47/47 testes Vitest passando** (incluindo correção determinística de timers no teste de streak diário).
  - **ESLint (`npm run lint -- --quiet`):** 0 erros.
  - **TypeScript (`tsc --noEmit`) & Build (`next build --webpack`):** 0 erros e 21 rotas compiladas.

---

## 🚀 2. Melhorias Futuras Opcionais (Backlog de Engenharia)
- [ ] **Atualização de Segurança do Next.js:** Atualizar `next` e `eslint-config-next` para a última versão patch da linha 16.x para eliminar o aviso de vulnerabilidade conhecida exibido durante `next build`.
- [ ] **Persistência em Banco Relacional & Multiusuário:** Migrar o armazenamento local (`data/intentflow-db.json`) para PostgreSQL/SQLite com autenticação de usuários para deploy multi-conta em produção.
- [ ] **Limpeza de Warnings React/Next:** Remover imports/variáveis sem uso restantes e avaliar `next/image` nas miniaturas onde aplicável.

---

## 🛠️ 3. Dependências Externas (Ambiente de Produção)
- [ ] **Chave `YOUTUBE_API_KEY` (Google Cloud Console):** Configurar `YOUTUBE_API_KEY` no `.env.local` / secrets de produção para buscar canais e vídeos reais na YouTube Data API v3 (sem a chave, a aplicação opera no modo catálogo educativo offline curado).
