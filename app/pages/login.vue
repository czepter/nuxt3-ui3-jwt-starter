<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex flex-col items-center space-y-2">
          <div
            class="rounded-full p-3 size-17 border-2 border-gray-200 dark:border-white"
          >
            <UIcon name="i-lucide-user" class="size-10" />
          </div>
          <h2 class="text-xl font-semibold">Login</h2>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Welcome back! Please login to your account.
          </p>
        </div>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" placeholder="Enter your email" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            placeholder="Enter your password"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          type="submit"
          class="w-full justify-center py-2"
          :trailing-icon="loading ? 'i-lucide-loader' : 'i-lucide-arrow-right'"
        >
          Continue
        </UButton>
      </UForm>
    </UCard>
    <div class="mt-4 text-center text-sm">
      <ULink to="/register">Need an account?</ULink><br />
      <ULink to="/forgot-password">Forgot password?</ULink>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "login",
});

import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const show = ref(false);

const toast = useToast();
const { $jwtAuth } = useNuxtApp();
const errors = ref<Record<string, string> | null>(null);
const loading = ref(false);
async function onSubmit() {
  loading.value = true;
  errors.value = null;
  try {
    await $jwtAuth.login(
      {
        email: state.value.email,
        password: state.value.password,
      },
      // optional callback function
      (data) => {
        toast.add({
          title: "Welcome back!",
          color: "success",
        });
        navigateTo("/");
      }
    );
  } catch (e) {
    errors.value = e.errors;
  }

  loading.value = false;
}
</script>
