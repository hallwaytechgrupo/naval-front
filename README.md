# Batalha Naval com React, TypeScript e Vite

Este projeto é um jogo de Batalha Naval desenvolvido com React, TypeScript e Vite. Ele inclui um tabuleiro de jogo, um console para respostas do servidor e um componente para posicionamento de navios.

## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em sua máquina. Você pode baixá-los [aqui](https://nodejs.org/).

## Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/christopher-comdciber/front-natal-battle.git
   cd seu-repositorio
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

## Rodando o Projeto em Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento, execute:

```sh
npm run dev
```

Isso iniciará o Vite em modo de desenvolvimento com Hot Module Replacement (HMR). Você pode acessar o projeto em `http://localhost:5173`.

## Estrutura do Projeto

- [`src/`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fchristopher%2Ffatec%2Fmathematics_for_computer_science%2Ffront-naval-battle%2Fsrc%2F%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%226b23520f-8812-4bde-8a9c-221e0894090d%22%5D "/home/christopher/fatec/mathematics_for_computer_science/front-naval-battle/src/"): Contém todos os arquivos de código-fonte.
  - `App.tsx`: Componente principal do aplicativo.
  - `Board.tsx`: Componente que representa o tabuleiro do jogo.
  - `Console.tsx`: Componente que exibe as respostas do servidor.
  - `ShipPlacement.tsx`: Componente para posicionamento de navios.
  - `assets/`: Contém as imagens dos navios.
- [`public/`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fchristopher%2Ffatec%2Fmathematics_for_computer_science%2Ffront-naval-battle%2Fpublic%2F%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%226b23520f-8812-4bde-8a9c-221e0894090d%22%5D "/home/christopher/fatec/mathematics_for_computer_science/front-naval-battle/public/"): Contém o arquivo [`index.html`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fchristopher%2Ffatec%2Fmathematics_for_computer_science%2Ffront-naval-battle%2Findex.html%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%226b23520f-8812-4bde-8a9c-221e0894090d%22%5D "/home/christopher/fatec/mathematics_for_computer_science/front-naval-battle/index.html").
- [`package.json`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fchristopher%2Ffatec%2Fmathematics_for_computer_science%2Ffront-naval-battle%2Fpackage.json%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%226b23520f-8812-4bde-8a9c-221e0894090d%22%5D "/home/christopher/fatec/mathematics_for_computer_science/front-naval-battle/package.json"): Contém scripts e dependências do projeto.
- [`vite.config.ts`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fchristopher%2Ffatec%2Fmathematics_for_computer_science%2Ffront-naval-battle%2Fvite.config.ts%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%226b23520f-8812-4bde-8a9c-221e0894090d%22%5D "/home/christopher/fatec/mathematics_for_computer_science/front-naval-battle/vite.config.ts"): Configuração do Vite.

## Configuração do ESLint

Este projeto utiliza ESLint para linting de código. A configuração do ESLint está no arquivo [`eslint.config.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fchristopher%2Ffatec%2Fmathematics_for_computer_science%2Ffront-naval-battle%2Feslint.config.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%226b23520f-8812-4bde-8a9c-221e0894090d%22%5D "/home/christopher/fatec/mathematics_for_computer_science/front-naval-battle/eslint.config.js").