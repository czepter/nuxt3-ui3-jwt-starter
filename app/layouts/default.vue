<template>
  <div class="relative min-h-screen" ref="wrapper">
    <div
      class="fixed h-screen border-r border-gray-200 dark:border-gray-800 w-72 flex-shrink-0"
      ref="nav"
      v-if="$viewport.isGreaterThan('tablet')"
    ></div>

    <main
      class="w-full min-h-screen"
      ref="content"
      :class="{
        'pl-72 ': $viewport.isGreaterThan('tablet'),
      }"
    >
      <slot />
    </main>

    <template v-if="$viewport.isLessOrEquals('tablet')"> </template>
  </div>
</template>

<script setup>
import { useNuxtApp } from "#app";
const { $viewport } = useNuxtApp();
</script>
