# Plano: Página de Vendas "A Seleção da Bíblia"

Criar uma landing page de vendas única, premium e altamente persuasiva, seguindo exatamente a estrutura e copy fornecidas, com estética inspirada em álbuns de figurinhas da Copa do Mundo + identidade cristã/familiar.

## Direção visual

- **Paleta** (tokens em `src/styles.css`, oklch):
  - Branco creme (background)
  - Azul marinho profundo (primary)
  - Dourado metálico (accent — para CTAs, selos, raridades)
  - Roxo elegante (secondary — épico/lendário)
  - Verde esmeralda suave (apoio para "comum/rara")
- **Tipografia**: display serif elegante para títulos (Fraunces ou Playfair) + sans-serif moderno (Inter) para corpo — passa fé + esportivo premium.
- **Elementos**: bordas arredondadas (radius generoso), sombras suaves multicamadas, gradientes sutis dourado→roxo, brilho metálico em badges de figurinhas, mockups com perspectiva 3D leve.
- **Animações** (framer-motion + tw-animate-css): fade-in on scroll, hover-scale em cards, brilho deslizante em figurinhas raras, pulse no CTA principal, contadores animados nas estatísticas, carrossel suave de depoimentos.
- **Mobile-first**: layout em coluna única, CTAs sticky-friendly, tipografia responsiva.

## Estrutura (componentes em `src/components/sales/`)

1. `Hero.tsx` — badge troféu, headline grande, sub, mockup gigante de álbum aberto com figurinhas flutuando, CTA dourado, selos de confiança.
2. `Stats.tsx` — faixa azul marinho com 4 estatísticas (150+, 8, 20+, ∞) e contadores animados.
3. `WhatIsIt.tsx` — título + texto + 4 cards (ícones emoji grandes).
4. `Transformation.tsx` — imagem de criança usando álbum + 3 cards laterais.
5. `TeamOfChampions.tsx` — grid 8 cards de categorias (Reis, Apóstolos…) estilizados como cartas de figurinhas + galeria de páginas.
6. `SpecialStickers.tsx` — 4 cards de raridade (Comum/Rara/Épica/Lendária) com tratamento metálico/holográfico.
7. `Testimonials.tsx` — carrossel premium 5 estrelas com fotos.
8. `WhatYouGet.tsx` — lista de inclusos em cards visuais.
9. `EmotionalSection.tsx` — fundo degradê marinho→roxo, copy "Missão Cumprida".
10. `Offer.tsx` — card de checkout: badge oferta, preços (de R$89,90 por R$29,90), botão grande dourado, selos.
11. `Guarantee.tsx` — box premium com escudo.
12. `FAQ.tsx` — accordion shadcn.
13. `FinalCTA.tsx` — seção emocional final com headline forte e botão.
14. `Footer.tsx` — versículo Provérbios 22:6 + footer minimalista.

Tudo composto em `src/routes/index.tsx` substituindo o placeholder. SEO no `head()` da rota (title, description, og tags em português).

## Imagens (geradas via imagegen)

- Mockup principal do álbum aberto com figurinhas espalhadas (hero).
- Criança usando o álbum (seção transformação).
- 3–4 páginas internas do álbum para galeria (categorias).
- 4 figurinhas exemplo por raridade (comum/rara/épica/lendária).
- 3 fotos de família para depoimentos.

Salvar em `src/assets/` e importar como ES6.

## Detalhes técnicos

- Adicionar `framer-motion` via `bun add framer-motion`.
- Definir tokens em `src/styles.css` (manter shadcn intacto, sobrescrever primary/accent/secondary + adicionar `--color-gold`, `--color-navy`, `--color-purple-elegant`, `--gradient-premium`, `--shadow-premium`).
- Importar Google Fonts via `<link>` no `__root.tsx` head.
- Componentes shadcn usados: Button, Card, Accordion, Badge.
- Sem backend — página puramente estática de conversão. CTAs apontam para `#oferta` (scroll suave).

## Fora do escopo

- Checkout real / integração de pagamento (CTAs são âncoras).
- Backend / autenticação.
- Painel admin.
