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
          <h2 class="text-xl font-semibold">Register</h2>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Create a new account to get started.
          </p>
        </div>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="fullName" required>
          <UInput v-model="state.fullName" placeholder="Enter your name" />
        </UFormField>
        <UFormField
          label="Email"
          name="email"
          required
          help="We'll never share your email with anyone else."
        >
          <UInput v-model="state.email" placeholder="Enter your email" />
        </UFormField>

        <div class="space-y-2">
          <UFormField label="Password" name="password" required>
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

          <UProgress
            :color="color"
            :indicator="text"
            :model-value="score"
            :max="4"
            size="sm"
          />

          <p id="password-strength" class="text-sm font-medium">
            {{ text }}. Must contain:
          </p>

          <ul class="space-y-1" aria-label="Password requirements">
            <li
              v-for="(req, index) in strength"
              :key="index"
              class="flex items-center gap-0.5"
              :class="
                req.met ? 'text-(--ui-success)' : 'text-(--ui-text-muted)'
              "
            >
              <UIcon
                :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                class="size-4 shrink-0"
              />

              <span class="text-xs font-light">
                {{ req.text }}
                <span class="sr-only">
                  {{
                    req.met ? " - Requirement met" : " - Requirement not met"
                  }}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <UButton
          type="submit"
          class="w-full justify-center py-2"
          :trailing-icon="loading ? 'i-lucide-loader' : 'i-lucide-arrow-right'"
          :disabled="!submitActive"
        >
          Continue
        </UButton>
      </UForm>
    </UCard>
    <div class="mt-4 text-center text-sm">
      <ULink to="/login">Have already an account?</ULink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "login",
});

import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  fullName: z.string().min(3, "Must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  fullName: undefined,
  email: undefined,
  password: undefined,
});

const show = ref(false);
const loading = ref(false);

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /\d/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

const strength = computed(() => checkStrength(state.value.password || ""));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 2) return "warning";
  if (score.value === 3) return "warning";
  return "success";
});

const text = computed(() => {
  if (score.value === 0) return "Enter a password";
  if (score.value <= 2) return "Weak password";
  if (score.value === 3) return "Medium password";
  return "Strong password";
});

const emailValid = computed(() =>
  schema
    .pick({
      email: true,
    })
    .safeParse({ email: state.value.email })
);

const errors = ref<Record<string, string> | null>(null);

const submitActive = computed(() => !!(score.value === 4 && emailValid.value));

const toast = useToast();
const { $jwtAuth } = useNuxtApp();

async function onSubmit() {
  loading.value = true;
  errors.value = null;
  try {
    await $jwtAuth.signup(
      {
        fullName: state.value.fullName,
        email: state.value.email,
        password: state.value.password,
      },
      // optional callback function
      (data) => {
        toast.add({
          title: "Welcome!",
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
