# Marquei Landing

Landing page estática do app Marquei.

O projeto foi feito em HTML, CSS e JavaScript vanilla, sem build obrigatório, para publicação simples no GitHub Pages.

## Estrutura

- `index.html`: landing principal
- `legal/privacy-policy/index.html`: política de privacidade
- `legal/terms-of-use/index.html`: termos de uso
- `src/legal/*.json`: conteúdo canônico das páginas legais
- `src/VISAO_GERAL_MARQUEI.md`: referência de posicionamento e copy
- `assets/styles.css`: estilos globais
- `assets/script.js`: interações leves e renderização das páginas legais
- `assets/components.js`: componentes de download reutilizáveis
- `assets/env.js`: configuração pública dos links de distribuição

## Configuração dos links

Os links de distribuição ficam em `assets/env.js`.

- `TESTFLIGHT_URL`: link atual do beta
- `APP_STORE_URL`: link da App Store quando estiver disponível

Como este projeto é estático, esse arquivo é público e não deve receber secrets.

## Preview local

```bash
python3 -m http.server 4173
```

Depois abra [http://localhost:4173](http://localhost:4173).

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
