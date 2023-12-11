# ✋ synco

This repository contains the source code of "synco" a chrome extension that lets you sync videos with your colleagues seamlessly with low latency using peer to peer connections with webRTC.

Is proudly made with [Vite](https://vitejs.dev/), [Vue 3](https://v3.vuejs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)

## Features

- Multiple users per room (using peer to peer connections)
- Low latency commands (play, pause, seek) depending on the network conditions
- Lauch the extension from any website that contaians a video. **_Some websites are not supported yet such as netflix that blocks any extension that tries to interact with their video player._**

## Things to improve

- [ ] This extension works completely peer to peer, however it needs to do a handshake with a server in order to know the other peers in the room. This handshake is done using firebase that is not ideal as it is a third party service. **_This can be improved by using a custom server that does the handshake and then the peers can communicate directly with each other._**
- [ ] Tranform this into a monorepo to separate the extension from the core that uses webRTC to sync the videos.
- [ ] Add a way to create a room with a custom name **_this indeed is actually possible, you just only need to join a room that doesn't exist yet._**
- [ ] Add a way to share the room link with your colleagues without having to remove the current room id funcionaity as may be used as well.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm build
pnpm test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
