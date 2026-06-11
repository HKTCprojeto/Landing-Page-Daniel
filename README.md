# Executive Import Program · Plataforma de Estudos

Plataforma web do **Executive Import Program** (EIP) — curso online de
comércio exterior do Daniel Cassetari, operado pela **HKTC do Brasil**.

> 🌐 Produção: [landing-page-daniel-orcin.vercel.app](https://landing-page-daniel-orcin.vercel.app)
> 📦 Repositório: [HKTCprojeto/Landing-Page-Daniel](https://github.com/HKTCprojeto/Landing-Page-Daniel)

---

## Visão geral

O sistema é composto por:

| Página | Função |
|---|---|
| `Landing.html` | Landing pública: hero, biografia, programa, carrossel de mídia, FAQ, formulário de candidatura |
| `cadastro.html` | Cadastro com validação de nome, e‑mail e CPF |
| `login.html`    | Login com recuperação de senha |
| `dashboard.html`| Área logada do aluno e do admin (SPA single‑file) |
| `privacidade.html` | Política de privacidade (LGPD) |

Tudo é **HTML estático servido pela Vercel**, com o **Supabase** como backend
(banco PostgreSQL, autenticação, storage). Não há build step — você abre o arquivo
e funciona.

---

## Stack

- **Frontend**: HTML + CSS + JavaScript vanilla (sem framework, sem build)
- **Auth + Database + Storage**: [Supabase](https://supabase.com) (PostgreSQL com RLS)
- **PDF**: [jsPDF](https://github.com/parallax/jsPDF) (geração de certificados client-side)
- **Player de vídeo**: HTML5 `<video>` + [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
- **Tipografia**: Manrope (texto) + Fraunces (títulos) via Google Fonts
- **Hospedagem**: [Vercel](https://vercel.com) (deploy automático a cada push em `master`)
- **PWA**: manifest + service worker (shell offline, instalável no mobile)

---

## Funcionalidades

### Para o aluno

#### 📚 Apostilas (módulos em PDF)
- Leitor de PDF embedado em modal
- **Progresso de leitura** (tempo investido + botão "✓ Concluí a leitura")
- Barra de progresso e badge "Lida" no card
- Botão "⬇ Baixar PDF"

#### 🎬 Aulas (videoaulas)
- Player HTML5 com **controle de velocidade** (0.5x → 2x) e **qualidade** (múltiplas fontes)
- Suporte automático a **URLs do YouTube** (renderiza iframe quando detecta)
- **Tracking de progresso** automático (segundos / duração)
- **Resume** de onde parou
- **Anotações com timestamp** — botão "📝 Anotar momento" salva o segundo atual
  + texto. Lista clicável pula para o segundo da nota.
- **Comentários** por aula (com threads de 1 nível e badge "Instrutor" para admin)
- Atalhos: ESPAÇO play/pause, ← → skip 5s, ESC fecha

#### ⭐ Avaliações (feedback)
- Modal de avaliação aparece automaticamente ao concluir 95% de uma aula ou
  ao clicar "Concluí a leitura" numa apostila
- Botão **"Avaliar agora"** sempre disponível nos cards
- 5 estrelas + comentário opcional (1 avaliação por conteúdo por usuário)
- Reabrir a avaliação mostra em modo "visualização", com botão "Editar" para
  atualizar a nota ou o texto

#### 🎓 Certificados
- Menu próprio com cards de cada conclusão (módulo e aula) + **Certificado Master**
  dourado quando o aluno completa o programa todo
- Banner de progresso geral (X / Y conteúdos concluídos · %)
- **Geração de PDF** client-side (jsPDF) — A4 paisagem, brand, nome do aluno
  em destaque, data por extenso, assinatura do diretor, código de verificação
- Ações: **👁️ Visualizar** (abre em nova aba) ou **⬇ Baixar PDF**

#### 👤 Perfil
- Nome, e-mail, CPF editáveis (com validação inline)
- Upload de **foto de perfil** (Supabase Storage, bucket `avatars`)
- Painel de **Privacidade & Dados (LGPD)**:
  - 📥 Exportar meus dados (JSON com perfil + progresso + notas + comentários)
  - 🗑️ Excluir minha conta (cascata via FK)

#### Outros
- Continuar assistindo (card na home apontando para a última aula em progresso)
- Tema claro / escuro persistido em localStorage
- PWA instalável (icone próprio EIP, funciona offline para o shell)

### Para o administrador

#### Conteúdo
- CRUD completo de **aulas** (título, descrição, URL principal, qualidades
  extras, thumbnail customizada, disponibilidade) com upload de MP4
  diretamente do PC (até 50 MB) e de imagem de capa (até 15 MB)
- CRUD completo de **apostilas** (número, título, emoji, capa custom, PDF, disponibilidade)

#### Configurações (`sec-config`)
- **👥 Usuários**
  - Tabela com foto, nome, e-mail, status, role e plano
  - Ações: cadastrar, redefinir senha (gera senha padrão), ativar/desativar, alterar role/plano
- **⭐ Feedbacks**
  - Cards de estatística (Total · Nota média · Aulas/Apostilas avaliadas · Baixas ≤ 2)
  - Filtros: Todos · 🎬 Aulas · 📘 Apostilas · ★ ≥ 4 · ★ ≤ 2
  - A **nota média responde ao filtro** ativo
  - Tabela com usuário, conteúdo, estrelas, comentário e data
- **🔌 APIs** integradas (Supabase · Vercel · GitHub · Google Fonts)

#### Notificações de comentário
- Admin pode deletar qualquer comentário em aulas (badge "Instrutor")
- Avatar do admin aparece colorido nos comentários

---

## Estrutura do projeto

```
.
├── Landing.html              # Landing pública
├── login.html / cadastro.html
├── dashboard.html            # SPA logada (~2700 linhas, tudo num arquivo)
├── privacidade.html          # LGPD
├── manifest.webmanifest      # PWA manifest
├── sw.js                     # Service Worker (cache strategies)
├── cookie-banner.js          # Banner de consentimento LGPD
├── vercel.json               # rewrite / → /Landing.html
├── icons/                    # ícones PWA (192/512/maskable/apple)
├── uploads/                  # imagens estáticas (fotos do Daniel, etc.)
├── apostilas/                # PDFs (servidos via Supabase Storage hoje)
└── supabase/
    └── migrations/           # versionamento do schema (12 migrations)
```

> **Nota**: vídeos longos e PDFs ficam no **Supabase Storage** (buckets
> `aulas-videos` e `avatars`), não no Git. Veja "Storage" abaixo.

---

## Modelo de dados (Supabase)

### Tabelas principais

| Tabela | Função |
|---|---|
| `perfis` | Espelha `auth.users` com nome, CPF, role (`admin`/`user`), plano (`basico`/`premium`/`vitalicio`), avatar |
| `apostilas` | Módulos em PDF (num, título, emoji, thumb_url, pdf_path, disponivel) |
| `aulas` | Videoaulas (titulo, descricao, video_url, qualidades JSONB, thumb_url, disponivel) |
| `progresso_aulas` | Tracking de segundos assistidos por user × aula |
| `progresso_apostilas` | Tracking de segundos lidos por user × apostila |
| `notas_aulas` | Anotações com timestamp do vídeo |
| `comentarios_aulas` | Comentários (com `parent_id` para threads de 1 nível) |
| `feedbacks` | Avaliações 1‑5 estrelas + comentário (unique por user × conteúdo) |

### Funções (RPC)

| Função | Quem chama |
|---|---|
| `is_admin()` | Helper interno; checa `perfis.role = 'admin'` |
| `get_users_list()` | Admin lista todos os usuários (com avatar_url) |
| `admin_create_user(p_email, p_password, p_nome, p_role, p_plano)` | Admin cria conta |
| `admin_reset_password(p_user_id, p_new_password)` | Admin reseta senha |
| `admin_list_feedbacks()` | Admin lê todos feedbacks com autor + título resolvidos |
| `export_my_data()` | Usuário exporta JSON completo dos próprios dados (LGPD) |
| `delete_my_account()` | Usuário deleta a própria conta (cascata via FK) |

### RLS (Row Level Security)

Todas as tabelas têm RLS habilitado. Padrões:
- Conteúdo (`aulas`, `apostilas`): usuário vê apenas registros com `disponivel = true`;
  admin vê tudo e pode CRUD
- Progresso, notas, feedbacks: usuário vê/edita só os próprios; admin lê todos
  os feedbacks via `admin_list_feedbacks()` (security definer)
- Comentários: todo autenticado lê (se a aula está disponível) e escreve os
  próprios; admin pode deletar qualquer

### Storage buckets

| Bucket | Uso | Limite |
|---|---|---|
| `avatars` | Fotos de perfil (`<user_id>/avatar.<ext>`) | 10 MB por arquivo |
| `aulas-videos` | Vídeos MP4 (`landing/`, `uploads/`) e thumbnails (`thumbs/`) | 50 MB por arquivo (limite do plano Free) |

---

## Setup local

### Pré‑requisitos
- Node.js 18+ (apenas para o servidor de desenvolvimento)
- Supabase CLI (`supabase`) se você for rodar migrations
- Conta no Supabase com o projeto `uuzuyiydkfugccgpjwnl` linkado (ou clone num projeto novo)

### Rodar o site localmente

```bash
git clone https://github.com/HKTCprojeto/Landing-Page-Daniel.git
cd Landing-Page-Daniel

# Servidor de dev simples (porta 8080, com rewrite / → /Landing.html)
node .scripts/dev-server.mjs
```

Abre [http://localhost:8080](http://localhost:8080).

> O `.scripts/` está no `.gitignore` — você precisa criar o seu próprio.
> Para um shortcut, qualquer `npx serve` ou `python -m http.server` funciona,
> mas a Landing precisa ser acessada via `/Landing.html` se não houver rewrite.

### Aplicar migrations no Supabase

```bash
# Lista o que está pendente
supabase migration list

# Aplica todas as migrations não aplicadas
supabase db push
```

---

## Deploy

Push em `master` dispara deploy automático na Vercel. Sem variáveis de ambiente
no frontend — a anon key do Supabase está hardcoded no JS (não é sensível, RLS
protege os dados).

---

## Convenções

- **Migrations**: nomeadas `YYYYMMDDHHMMSS_descrição.sql` (timestamp ascendente)
- **Commits**: `tipo(escopo): mensagem` no estilo Conventional Commits
  - `feat`, `fix`, `chore`, `refactor`, `docs`
- **CSS**: variáveis de tema (`--bg`, `--text`, `--blue`, `--accent`) em `:root` e
  override em `[data-theme="dark"]`
- **Sem framework**: tudo é vanilla JS para minimizar dependências e manter
  build-less

---

## Roadmap (sugestões abertas)

- Gateway de pagamento (Stripe ou Asaas) com gating por plano
- Cupons de desconto
- Programa de afiliados / indicação
- Painel admin com MRR, churn e funil de conversão
- Sequência de email de aquecimento (Resend + Supabase Edge Functions)

---

## Licença e créditos

Sistema desenvolvido por **[Luis Galvão](https://www.linkedin.com/in/luis-galv%C3%A3o/)**
para a HKTC do Brasil S/A · CNPJ 22.351.708/0001-20.

Conteúdo programático e marca: **Daniel Cassetari** · Executive Import Program.
