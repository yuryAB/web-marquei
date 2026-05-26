# AGENTS.md

## Contexto do projeto

Este repositório hospeda a landing page pública do Marquei.

## Diretrizes

- Manter a landing compatível com GitHub Pages.
- Preservar a estrutura estática em HTML, CSS e JavaScript vanilla sempre que possível.
- Não adicionar secrets ao repositório nem a arquivos carregados no navegador.
- Preferir caminhos relativos para links e assets.
- Usar `src/VISAO_GERAL_MARQUEI.md` como referência principal para ajustes de copy.
- Manter `src/legal/*.json` como fonte de verdade dos documentos legais.

## Fluxo de trabalho com o usuário

- Não usar navegador, in-app browser, Playwright ou qualquer validação visual/manual para testar por conta própria sem pedido explícito do usuário.
- Quando necessário, pode apenas abrir o browser ou iniciar um servidor local para que o usuário faça os próprios testes, sem interagir com a página nem coletar métricas visuais.
- Para ajustes de HTML, CSS e JavaScript, preferir editar o código diretamente e, no máximo, rodar validações rápidas de sintaxe ou do site estático quando necessário.
- Não fazer ciclos repetidos de tentativa e erro visual consumindo tempo e tokens; se uma solução depender de inspeção no navegador, explicar isso antes e pedir autorização.
- Quando o usuário pedir para "apenas mexer no código", obedecer literalmente e não iniciar servidor local nem testar visualmente.
