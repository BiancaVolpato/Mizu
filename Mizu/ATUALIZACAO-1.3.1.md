# Mizu 1.3.1

- As 25 ilustrações agora são PNGs transparentes.
- Navbar: reserva a área inferior informada pelo Android/iOS, além dos 10 pontos
  de respiro. A área dos botões não é reduzida quando a barra do sistema é maior.
- Altura adicional para fonte ampliada; textos dos atalhos podem quebrar linha.
- Proteção lateral do conteúdo e cabeçalho flexível.
- Dados, lembretes, identificador Android e chave de armazenamento preservados.

Atualize a pasta Mizu existente, preservando os campos owner e extra.eas.projectId
do seu app.json vinculado ao Expo. Siga as instruções de build do documento 1.3.0.
Instale sobre a versão existente, sem desinstalar nem limpar dados.

Validação: typecheck, testes unitários e exportação dos bundles Android/web.
A sobreposição nativa precisa ser conferida em aparelho físico: testar navegação
por gestos e três botões, fonte normal/ampliada, quatro abas e teclado aberto.
Este pacote contém código-fonte, não APK.
