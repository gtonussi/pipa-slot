# Pipa Slot

Popup de slot machine desenvolvido com TypeScript, PixiJS v8 e GSAP.

## Guia

Esta documentação traz informações do projeto, como arquitetura, tecnologias usadas, e detalhes de como instalar e rodar o projeto.

**Para conferir as considerações do desenvolvedor, use o [PERSONAL.md](PERSONAL.md)**

## Funcionalidades

- Resultado do giro determinístico (o resultado vem de fora do componente).
- Fluxo de estados: idle -> spinning -> settling -> result.
- Parada dos rolos em sequência (da esquerda para a direita), com efeito de quase-vitória.
- Animação de celebração com pisca-pisca em caso de vitória.
- Sistema de logs com categoria e timestamp para facilitar depuração.
- Testes unitários para máquina de estados e mapeamento de rolos.

## Tecnologias

- TypeScript (modo estrito)
- PixiJS v8
- GSAP
- Vite
- Vitest

## Arquitetura

- [src/main.ts](src/main.ts): inicialização da aplicação e integração dos componentes.
- [src/popup/Popup.ts](src/popup/Popup.ts): estrutura visual e layout do popup.
- [src/slot/SlotMachine.ts](src/slot/SlotMachine.ts): orquestração do fluxo de jogo.
- [src/slot/Reel.ts](src/slot/Reel.ts): animação de rolagem dos rolos.
- [src/slot/reelMapping.ts](src/slot/reelMapping.ts): lógica pura de mapeamento determinístico.
- [src/state/SlotMachineStateMachine.ts](src/state/SlotMachineStateMachine.ts): regras de transição de estados.
- [src/monitoring/Logger.ts](src/monitoring/Logger.ts): utilitário de logging.

Essa separação deixa renderização, regra de fluxo e lógica pura isoladas, o que facilita manutenção e testes.

## Instalação

```bash
npm install
```

## Como Executar

```bash
npm run dev
```

Acesse: http://localhost:5173

Para build de produção e preview:

```bash
npm run build
npm run preview
```

## Testes

```bash
npm test
```

Cobertura atual:

- Transições válidas e inválidas da máquina de estados.
- Mapeamento determinístico do resultado para posição final dos rolos.

## Scripts Disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento com Vite.
- `npm run build`: executa typecheck e build de produção.
- `npm run preview`: executa o preview do build.
- `npm test`: roda os testes uma vez.
- `npm run test:watch`: roda os testes em modo watch.

## Performance

- Reuso de sprites dos rolos, sem recriação por frame.
- Texturas de símbolos geradas uma vez e compartilhadas.
- Movimento dos rolos com timeline GSAP, sem logs ruidosos em loops de frame.
- Limpeza de recursos em `destroy()` (timelines, texturas e listeners).

## Animações (GSAP)

- O giro usa timeline com aceleração, velocidade constante e desaceleração.
- O tempo de settle usa `gsap.delayedCall(...)`.
- Em vitória, há uma animação curta de pisca-pisca antes de liberar novo giro.

## Renderização (PixiJS)

- `Application.init(...)` configura resize e resolução.
- A interface é composta com `Container` e `Graphics`.
- Os rolos usam máscara para limitar a janela visível.
- Os símbolos placeholder são renderizados em instâncias de `RenderTexture`.
