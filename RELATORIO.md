# Relatório — TaskFlow

## Objetivo

Organizar tarefas pessoais no próprio dispositivo, sem conta, servidor ou conexão com a internet durante o uso.

## Tecnologias

React Native, Expo SDK 58, JavaScript, React Hooks, FlatList, StyleSheet, React Navigation, Expo Vector Icons e AsyncStorage.

## Funcionalidades

O usuário pode adicionar, visualizar, concluir e excluir tarefas. No cadastro, pode definir um prazo de conclusão opcional e escolher prioridade baixa, média ou alta. A tela inicial exibe somente o dashboard de progresso, com totais e pendências por prioridade. A tela Tarefas concentra cadastro, filtros e lista. A navegação possui três abas (Início, Tarefas e Perfil), exibidas no rodapé do aplicativo mobile e em uma barra lateral fixa na web. O roteador TabRouter do React Navigation mantém o estado das telas ao alternar abas. A tela de perfil exibe informações demonstrativas locais. Conforme a alteração visual solicitada, o aplicativo usa tema fixo preto e roxo, inclusive quando existia uma preferência clara salva. A interface usa cores, bordas e espaçamento inspirados no shadcn/ui, implementados com StyleSheet. Mensagens curtas confirmam as ações.

## Armazenamento local

O AsyncStorage guarda localmente a lista completa de tarefas, incluindo prazo, prioridade e conclusão. O tema preto e roxo é fixo. Os valores são serializados com `JSON.stringify` e lidos com `JSON.parse`. O aplicativo espera o carregamento inicial antes de gravar, para não substituir dados salvos por uma lista vazia. Erros de leitura e gravação mostram um aviso. Os dados podem desaparecer se o aplicativo for desinstalado ou seu armazenamento for apagado.

## Dificuldades encontradas

O projeto existente tinha entrada TypeScript (`index.ts` e `App.tsx`), diferente da descrição de template JavaScript. A entrada foi convertida para JavaScript. Na primeira etapa, a instalação das dependências foi bloqueada pela rede; elas já estão presentes na etapa atual. A exportação web foi concluída, mas a execução em dispositivo não foi verificada. O comando de lint não concluiu porque o Expo tentou obter uma configuração ESLint pela rede.

## Melhorias futuras

Adicionar edição de títulos e filtros de tarefas, mantendo todos os dados locais.

## Perguntas

**Qual a função do useState?** Guardar valores que mudam na interface e solicitar uma nova renderização quando eles são atualizados.

**Quando utilizar FlatList?** Para exibir listas de itens, especialmente quando podem crescer, porque ela renderiza os elementos de forma eficiente.

**Quais as vantagens do React Native?** Permite compartilhar grande parte do código entre Android e iOS e criar interfaces com componentes nativos.

**O que são componentes?** Partes reutilizáveis da interface, como o card de tarefa e o campo de cadastro.

**Como armazenar informações localmente?** Neste aplicativo, com AsyncStorage: converter objetos em JSON ao salvar e interpretar o JSON ao recuperar.


## Validação da persistência

Três testes automatizados com adaptador de armazenamento em memória passaram: leitura após nova instância, conclusão e exclusão; ordem das gravações e recuperação após falha; rejeição de dados corrompidos sem sobrescrita. A exportação web concluiu. Não foi realizado teste de reinício em dispositivo físico. Lint e typecheck foram tentados, mas não concluíram devido às ferramentas indisponíveis e à restrição de rede.

A interface mostra o estado da gravação e permite tentar novamente em caso de erro. Uma falha de leitura impede a edição até que as tarefas sejam carregadas, preservando os dados existentes.

## Acesso local

A versão atual inclui cadastro por nome e e-mail, entrada sem senha, sessão persistida e saída. É identificação de perfis locais, sem verificação de identidade ou proteção contra outra pessoa que conheça o e-mail. Não há envio de e-mail ou autenticação em servidor. O primeiro perfil assume as tarefas já existentes; os demais possuem listas separadas. A saída aguarda a gravação das tarefas antes de encerrar a sessão.

O teste automatizado de cadastro, sessão, saída, duplicação de e-mail e separação das listas passou, além dos três testes anteriores de armazenamento. A exportação web passou. Não houve validação em dispositivo físico. A instalação de expo-crypto foi bloqueada pela rede; senhas não foram implementadas nem armazenadas.
