# Marquei Landing

Landing page estática do app Marquei.

O projeto foi feito em HTML, CSS e JavaScript vanilla, sem build obrigatório, para publicação simples no GitHub Pages.

## Estrutura

- `index.html`: landing principal
- `suporte/index.html`: página pública de suporte
- `legal/privacy-policy/index.html`: política de privacidade
- `legal/terms-of-use/index.html`: termos de uso
- `privacy.html` e `terms.html`: redirects de compatibilidade para as rotas legais atuais
- `assets/css/base.css`: tokens, reset, tipografia e estrutura global
- `assets/css/components.css`: marca, links, botões, CTA e animações reutilizáveis
- `assets/css/pages/*.css`: estilos específicos por página
- `assets/js/core.js`: utilidades globais, ano atual, URL limpa e reveal animation
- `assets/js/components/download-button.js`: componente declarativo de download
- `assets/js/pages/*.js`: comportamento específico de cada página
- `assets/js/config/env.js`: configuração pública dos links de distribuição
- `assets/images/`: imagens carregadas pelo navegador
- `src/legal/*.json`: conteúdo canônico das páginas legais
- `src/VISAO_GERAL_MARQUEI.md`: referência de posicionamento e copy
- `scripts/validate-static-site.mjs`: validação local de JSON, assets e links internos

## Configuração dos links

Os links de distribuição ficam em `assets/js/config/env.js`.

- `TESTFLIGHT_URL`: link atual do beta
- `APP_STORE_URL`: link da App Store quando estiver disponível

Como este projeto é estático, esse arquivo é público e não deve receber secrets.

## Preview local

```bash
python3 -m http.server 4173
```

Depois abra [http://localhost:4173](http://localhost:4173).

## Validação

```bash
node scripts/validate-static-site.mjs
```

O script valida os JSONs legais, checa assets referenciados pelos HTMLs e confirma links internos principais.

## Deploy no GitHub Pages

1. Deixe o repositório público.
2. Abra `Settings > Pages`.
3. Em `Build and deployment`, escolha `Deploy from a branch`.
4. Selecione `main` e `/ (root)`.
5. Salve e aguarde a publicação.
6. Ative `Enforce HTTPS` quando o site estiver disponível.

## Atualização de conteúdo

- Para alterar copy e posicionamento da landing, use `src/VISAO_GERAL_MARQUEI.md` como referência.
- Para alterar termos e privacidade, edite os JSONs em `src/legal/`.
- Para trocar imagens públicas, use `assets/images/` e mantenha caminhos relativos.
