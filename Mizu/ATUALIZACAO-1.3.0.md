# Mizu 1.3.0 — ilustrações aprovadas

As 25 ilustrações foram extraídas diretamente da prancha aprovada, sem redesenho.
Cada combinação de pelagem e estado usa uma imagem completa. Não existem mais
olhos, boca ou manchas sobrepostos em coordenadas independentes.

- Hoje, Gatinho e onboarding compartilham o novo componente.
- As imagens mantêm o fundo de papel creme da prancha (não são transparentes).
- Ícone e splash permanecem inalterados; esta aprovação foi das poses no app.
- Nenhuma alteração no armazenamento, histórico, metas ou notificações.

## Atualizar seu projeto

Substitua os arquivos da pasta Mizu pelos deste pacote. Antes, guarde seu app.json
atual: preserve os campos extras adicionados pelo EAS, sobretudo extra.eas.projectId
e owner, além dos identificadores do aplicativo. Não faça outro eas init se o
projeto já estiver vinculado. Não envie node_modules ao Git.

Na pasta que contém package.json:

```sh
npm ci
npm run typecheck
npm test
npx --yes eas-cli@latest build --platform android --profile preview
```

Instale o APK sobre o aplicativo existente usando o mesmo identificador e a mesma
chave de assinatura. Não desinstale nem limpe dados: isso apagaria o histórico local.

O ZIP contém código-fonte, não um APK. O teste final em Android físico deve verificar
as cinco cores em cada faixa (0–24%, 25–49%, 50–74%, 75–99%, 100%+).
