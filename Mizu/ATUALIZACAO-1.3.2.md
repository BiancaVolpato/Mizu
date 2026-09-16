# Mizu 1.3.2 — lembretes e gatos

Usa a nova prancha transparente enviada (2048 × 2048). Os 25 recortes mantêm
os pixels originais dos gatos, com rosto e corpo unidos e sem elementos vizinhos.
O script de extração atual é scripts/extract-transparent-cats.py.

## Lembretes em segundo plano

Os gatilhos DAILY do Expo Notifications ficam registrados no sistema do aparelho.
Não dependem de setInterval, internet ou da tela do app aberta. A agenda se repete
diariamente e é reconciliada ao iniciar ou retomar o aplicativo. Registrar água
não cancela nem recria os alarmes. Mudanças de rotina removem somente horários obsoletos.

O canal Android é criado antes da solicitação de permissão. A preferência de som
do usuário no sistema é respeitada. Erros aparecem em Perfil; operações concorrentes
são serializadas. Agendas vazias ou acima de 60 horários são recusadas com explicação.
As mensagens são genéricas para não repetir um saldo de água desatualizado nos dias seguintes.

## Teste no celular

1. Atualize o projeto e abra a versão 1.3.2 no Expo Go ou instale o APK atualizado.
2. Em Perfil, ative os lembretes e conceda a permissão.
3. Toque em “Testar lembrete em 15 segundos”.
4. Volte à tela inicial do celular ou bloqueie a tela; aguarde a notificação.
5. Confira também um horário da agenda normal dentro da rotina.
6. Desative os lembretes e confira que os próximos alarmes foram cancelados.

O teste explícito de 15 segundos pode ocorrer fora da rotina e não altera a agenda diária.
Ele verifica a entrega local, mas não comprova a repetição diária; valide um lembrete
normal também. No Expo Go, permissões e notificações pertencem ao Expo Go.

Economia agressiva de bateria, Não Perturbe, bloqueio de notificações ou “Forçar parada”
podem impedir ou atrasar a entrega. Abrir o app após forçar parada permite reconciliar
a agenda. Não há garantia de horário exato em todos os fabricantes. Se o teste não chegar,
use “Abrir ajustes do aparelho” e confira notificações e restrições de bateria.

## Atualização e validação

Preserve owner e extra.eas.projectId do seu app.json vinculado ao Expo. Use o mesmo
identificador e chave de assinatura para instalar sobre a versão anterior, sem apagar dados.
As instruções de instalação e build estão no README. Este ZIP é código-fonte, não APK.

Verificação local: TypeScript, 24 testes automatizados e exportação Android/web.
Os testes nativos usam mocks: entrega real com tela bloqueada e repetição diária
ainda precisam de validação em aparelho físico.
