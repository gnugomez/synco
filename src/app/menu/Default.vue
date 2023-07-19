<template>
  <div class="wrapper">
    <header>
      <h1>Create a room and start sharing</h1>
      <p class="text-white/60 text-sm italic">
        Once you create a room a link and a code will be generated in order to let you start a peer
        to peer connection with your colleges and start sharng content!
      </p>
    </header>
    <main>
      <router-link to="/other" class="button secondary">
        Join
      </router-link>
      <router-link to="/other" class="button primary">
        Create
      </router-link>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply grid gap-5;
}
header {
	@apply grid gap-1;

  h1 {
    @apply text-3xl font-extrabold;
  }
}
main {
  @apply grid grid-cols-2 gap-5;

  .button {
    @apply px-6 py-4 text-sm text-center rounded-md font-semibold cursor-default;

    &.secondary {
      @apply bg-gray-500/40 text-white;
    }

    &.primary {
      @apply bg-gradient-to-br from-white to-slate-300 text-gray-950;
    }
  }
}
</style>
