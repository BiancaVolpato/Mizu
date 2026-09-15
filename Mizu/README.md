# Mizu — app mobile de hidratação

Mizu é um MVP funcional de hidratação para iOS e Android, feito com React Native, Expo e TypeScript. O app calcula uma meta inicial estimada, registra água em um toque, mantém histórico local, agenda lembretes dentro da rotina e usa um gatinho original como companhia visual.

> A conta `peso × 35 ml` é somente uma estimativa inicial. Ela não é recomendação médica e a meta pode ser alterada a qualquer momento.

## Tecnologias

- Expo SDK 57 e React Native 0.86
- TypeScript em modo estrito
- React Navigation (bottom tabs)
- AsyncStorage para persistência local
- Expo Notifications para notificações locais
- React Native SVG para gato e tigela vetoriais
- Plus Jakarta Sans
- Vitest para testes das regras de negócio

## Instalação e execução

Requisitos: Node.js 20 ou mais recente, npm e o app Expo Go em um aparelho físico. Para builds nativas, instale também EAS CLI ou os SDKs nativos.

```bash
npm install
npm start
```

Leia o QR code no terminal com o Expo Go. Outros comandos:

```bash
npm run android       # abre no Android conectado/emulador
npm run ios           # abre no simulador iOS (macOS)
npm run web           # prévia web
npm run typecheck     # valida TypeScript
npm test              # executa os testes
npx expo-doctor       # confere compatibilidade do projeto
```

## Como testar no Android

1. Ative a depuração USB ou abra um emulador Android.
2. Execute `npm run android`; alternativamente, use `npm start` e leia o QR code no Expo Go.
3. Para testar notificações de maneira confiável, prefira um aparelho físico e aceite a permissão solicitada.
4. Para criar um APK interno com EAS: execute `npx eas-cli login`, `npx eas-cli init` e `npx eas-cli build --platform android --profile preview`.

## Como testar no iOS

1. Em macOS, execute `npm run ios` para o Simulator; ou leia o QR code com o Expo Go em um iPhone.
2. Aceite a permissão de notificações quando ativar os lembretes.
3. Notificações e comportamento em segundo plano devem ser confirmados em aparelho físico.

## Fluxo de validação manual

1. Apague os dados do app e confirme que o onboarding aparece.
2. Informe `65 kg`, rotina `07:30–23:30` e confirme a meta de `2.275 ml`.
3. Na tela Hoje, toque em `+ 200 ml`, `+ 350 ml` e `+ 500 ml`; cada atalho deve registrar com um único toque.
4. Use “Outra quantidade”, edite um registro e exclua outro.
5. Feche totalmente o app e abra novamente; os registros devem continuar presentes.
6. Altere a meta no Perfil e confirme que o progresso do dia usa a nova meta.
7. Consulte Hoje/Semana/Mês no Histórico e abra dias diferentes pelas barras.
8. Personalize nome e pelagem do gato.
9. Ative lembretes, escolha a frequência e verifique a permissão do sistema.
10. Some água até 100% e confirme a comemoração; adicione mais água e confirme que o valor passa de 100% sem bloqueio.
11. Para simular outro dia, altere temporariamente a data do aparelho, reabra o app, crie um registro e depois restaure a data.

## Arquitetura

```text
src/
├── components/       # componentes visuais reutilizáveis
├── data/             # catálogo extensível do gato
├── hooks/            # estado global e ações do domínio
├── navigation/       # bottom navigation
├── notifications/    # permissão e agenda local
├── screens/          # onboarding, hoje, histórico, gato e perfil
├── storage/          # defaults e AsyncStorage
├── theme/            # tokens de cor, tipografia, espaço, raio e sombra
├── types/            # contratos persistidos
└── utils/            # datas, volumes, progresso, agenda e testes
```

`HydrationProvider` é a fonte única de estado. Toda alteração é aplicada por reducer e persistida automaticamente. Os componentes consomem ações de domínio, sem acessar o armazenamento diretamente.

## Armazenamento e mudança de dia

Os dados ficam no AsyncStorage sob uma chave versionada. São persistidos: onboarding, peso, meta, unidade, atalhos, rotina, lembretes, gato, registros e meta histórica por dia.

Cada registro contém `id`, quantidade, timestamp ISO e uma chave de data local `AAAA-MM-DD`. Ao chegar à meia-noite ou quando o app volta ao primeiro plano em uma nova data, uma nova meta diária é criada sem apagar registros anteriores.

## Notificações e permissões

Ao ativar os lembretes, o app:

- solicita a permissão do sistema;
- cria um canal Android chamado `mizu-lembretes`;
- remove a agenda anterior e recria notificações diárias;
- agenda somente horários entre o início e o fim da rotina;
- atualiza o texto com o volume restante sempre que os registros mudam enquanto o app está ativo.

Android 13 ou superior exige `POST_NOTIFICATIONS`; no iOS a permissão aparece no primeiro ativamento. Desativar lembretes remove todas as notificações agendadas pelo Mizu.

## Funcionalidades implementadas

- onboarding de quatro etapas com cálculo `kg × 35 ml`;
- edição manual de peso, nome opcional, meta, unidade e três atalhos;
- registro imediato de 200/350/500 ml (configuráveis) e quantidade personalizada;
- total, meta, percentual, restante e tigela animada;
- editar/excluir registros do dia;
- persistência local e virada segura de data;
- histórico Hoje/Semana/Mês, média, gráfico e detalhes diários;
- cinco estados positivos do gato entre 0% e 100%+;
- cinco pelagens e nome personalizável;
- estrutura pronta para coleiras, chapéus, tigelas e novos gatos;
- lembretes locais com frequências predefinidas e personalizada;
- feedback sutil, comemoração de meta e acessibilidade básica.

## Testes e verificações já executados

- `npm test`: 10 testes aprovados em 3 arquivos;
- `npm run typecheck`: aprovado sem erros;
- `npx expo-doctor`: 21/21 verificações aprovadas;
- bundle Android gerado com sucesso por `expo export`;
- bundle web gerado com sucesso por `expo export`.

Os testes cobrem cálculo da meta, soma por dia, progresso acima de 100%, limites dos estados do gato, chave de data local, horários e janela dos lembretes.

## Limitações conhecidas

- Sem backend ou conta: remover o app ou limpar seus dados apaga o histórico.
- O texto “quanto falta” das notificações representa o último estado conhecido quando o app estava ativo. Sistemas móveis não permitem recalcular JavaScript arbitrariamente em cada notificação com o app totalmente encerrado; ao reabrir ou registrar água, a agenda é atualizada.
- Entrega e horário exatos de notificações dependem das políticas de economia de bateria do sistema.
- O seletor de horário usa entrada `HH:mm`, evitando uma dependência nativa adicional no MVP.
- O gráfico mensal resume 30 dias corridos; ainda não há calendário anual.
- Não há sincronização, HealthKit/Health Connect, widgets, compras ou gamificação punitiva.
- Um APK não é produzido sem credenciais EAS ou Android SDK configurado. O projeto inclui `eas.json` com perfil `preview` para gerar APK após `eas init`.
- A auditoria de produção não encontrou vulnerabilidades altas; o ecossistema Expo ainda reporta avisos moderados transitivos no utilitário nativo `xcode/uuid`, sem correção compatível que preserve o SDK atual.

## Próximos passos recomendados

1. Testes E2E em aparelhos físicos com Maestro ou Detox.
2. Backup/sincronização opcional com criptografia e consentimento.
3. Widget e ações rápidas do sistema.
4. Integração opcional com HealthKit e Health Connect.
5. Biblioteca de acessórios desbloqueáveis sem mecânicas de culpa.
6. Ajustes de lembretes com base em clima, exercício e registros recentes, sempre com controle explícito da pessoa.
