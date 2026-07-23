`🤖🚫 Zona livre de IA`

## Guia

Esta documentação visa trazer insights e considerações do desenvolvedor.

**Para conferir informações sobre o projeto, use o [README.md](README.md)**

## Considerações

**Stack:** A escolha da stack foi baseada no proposto pelo desafio. Para um componente desse tamanho, pode parecer um pouco exagerado usar o PIXI pois talvez tudo pudesse ser feito com um CSS bem elaborado, porém fiz questão de usar tanto o `PIXI` quanto o `GSAP` por estarem alinhados com a stack real da empresa.

**Componentes:** Para a divisão dos componentes, segui uma lógica de responsabilidade única dividindo-os em partes menores que pudessem ser reaproveitadas, conforme as boas práticas de front-end e componentização.

**Trade-offs:** Sobre os trade-offs, fiz questão de conferir a documentação das bibliotecas `PIXI` e `GSAP`, e implementei todas as skills fornecidas pelo repositório oficial para extrair do Agente o código mais limpo possível e recomendado por ambas. Visto que o Agente foi criado para focar em performance, simplicidade, SOLID, entre outros critérios, cheguei aos seguintes pontos:

- Resultado determinístico injetado externamente: a animação não decide o resultado.
  Trade-off: quem chama o componente precisa fornecer resultados válidos.
- Mapeamento dos rolos em função pura: melhora clareza e testabilidade.
  Trade-off: adiciona uma camada entre fluxo e renderização.
- Texturas placeholder geradas no código: simplifica setup sem depender de assets externos.
  Trade-off: visual funcional, mas menos refinado.
- Logger próprio no lugar de biblioteca externa: menor complexidade e menos dependências.
  Trade-off: menos recursos avançados de observabilidade.

**Tempo:** Sinceramente, não faria nada diferente com MAIS tempo. De acordo com as instruções, visto que o componente foi muito simples e rápido de criar, não vejo que mais tempo poderia trazer muitos benefícios além de estéticos. O que eu precisaria para esse projeto seriam mais informações de qual o objetivo do produto, o que não encontrei na descrição da task. Eu precisaria entender, primeiramente Onde, Como e Por Quem esse componente seria usado, para então me perguntar como eu deveria disponibilizá-lo, se por uma `CDN`, uma tag `SCRIPT`, uma `URL` a ser usada dentro de um `iFrame` ou diretamente no naveador mesmo, ou uma `Lambda Function` para extrair a funcionalidade da roleta, quem sabe, existem muitas possibilidades. Esse pop-up apareceria durante a navegação do usuário em um website, em um aplicativo, dentro de um dashboard? Todas essas perguntas moldariam não apenas a forma como programei o componente, mas como embrulhá-lo e torná-lo realmente um produto reutilizável. Para esse MVP, eu considerei a descrição da task como fonte da verdade.

**Performance:** O componente foi testado apenas na minha própria máquina, em um navegador desktop. Não encontrei informações sobre responsividade nem acessibilidade na task, portanto não implementei nenhuma das duas. Acredito que fazer a mais pode ser bom, mas também tem um custo de tempo, recurso e tokens, portanto me mantive apenas nos requerimentos. O ideal seria ter uma bateria de testes em diferentes devices, navegadores, e velocidade de internet, para realizar possíveis ajustes de performance e responsividade.
