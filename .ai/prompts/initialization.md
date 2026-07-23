Create the Slot Machine project, following only one step at a time, do not proceed to the next step if not required, according to the following specifications (they are in portuguese):

Objetivo:
Construir um popup em TypeScript + PIXI.js cujo conteúdo é um slot machine — o jogador gira e revela um resultado.

O que assumimos pronto:
Você já tem uma instância de PIXI.Application inicializada e acesso ao stage. Não precisa configurar bundler/servidor nem usar assets reais — retângulos/placeholders coloridos servem. O popup pode ser só uma moldura simples (overlay escurecido + painel central). Não precisa de animação sofisticada de abertura nem de qualquer conteúdo além do slot.

Requisitos (must have):

- Popup simples (overlay + painel) servindo só como moldura para o slot.
- Slot com 3 rolos, cada um exibindo símbolos de um conjunto configurável.
- Botão “Girar”.
- Resultado determinístico: o componente recebe o resultado já decidido (os símbolos finais de cada rolo) e anima até parar exatamente nele. A animação nunca decide o resultado.
- Spin com feel razoável: aceleração → velocidade constante → desaceleração até o símbolo alvo. Rolos param em sequência (esquerda → direita).
- State machine clara: idle → spinning → settling → result.
- Bloquear giro duplo (não pode girar enquanto já está girando).
- Expor callback/evento com o resultado ao final, ex: onResult(reels).

- Data-driven: número de rolos e conjunto de símbolos configuráveis, sem tocar no código do componente.
- destroy() limpo: parar ticker/timers, remover listeners, liberar texturas — sem memory leaks.
- Loop de rolagem eficiente (reutilizar sprites com wrap-around / masking, sem recriar por frame).
- Anticipation: desacelerar o último rolo em quase-vitórias.
- Testes unitários da lógica (state machine, mapeamento resultado → posição final). Restrições Use GSAP para as animações.

Restrições:
Use GSAP para as animações.

# Steps:

1- Create the project, dependencies, and folder structure
2- Implement everything except for the unit tests
3- Implement the unit tests
4- Create a Dockerfile e make this application usable with Docker.
