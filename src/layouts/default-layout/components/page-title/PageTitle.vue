<template>
  <!--begin::Page title-->
  <div
    v-if="pageTitleDisplay"
    class="mr-3 flex flex-wrap justify-center"
    :class="directionClass"
  >
    <template v-if="pageTitle">
      <!--begin::Title-->
      <h1 class="my-0 flex flex-col justify-center text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ pageTitle }}
      </h1>
      <!--end::Title-->

      <span
        v-if="pageTitleDirection === 'row' && pageTitleBreadcrumbDisplay"
        class="mx-3 h-5 border-l border-gray-200 dark:border-gray-700"
      ></span>

      <!--begin::Breadcrumb-->
      <ul
        v-if="breadcrumbs && breadcrumbs.length && pageTitleBreadcrumbDisplay"
        class="my-0 flex items-center gap-3 pt-1 text-xs font-semibold"
      >
        <!--begin::Item-->
        <li class="text-gray-500">
          <router-link to="/" class="text-gray-500 transition-colors hover:text-primary"
            >{{ homeLabel }}</router-link
          >
        </li>
        <!--end::Item-->
        <template v-for="(item, i) in breadcrumbs" :key="i">
          <!--begin::Item-->
          <li>
            <span class="block h-0.5 w-1.5 rounded-full bg-gray-400"></span>
          </li>
          <!--end::Item-->
          <!--begin::Item-->
          <li class="text-gray-500">{{ item }}</li>
          <!--end::Item-->
        </template>
      </ul>
      <!--end::Breadcrumb-->
    </template>
  </div>
  <div v-else></div>
  <!--end::Page title-->
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import {
  pageTitleBreadcrumbDisplay,
  pageTitleDirection,
  pageTitleDisplay,
} from "@/layouts/default-layout/config/helper";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "layout-page-title",
  components: {},
  setup() {
    const route = useRoute();
    const { t, te, locale } = useI18n();

    const buildCandidateKeys = (value: string): string[] => {
      const trimmed = value.trim();
      if (!trimmed) {
        return [];
      }

      const words = trimmed.split(/[^A-Za-z0-9]+/).filter(Boolean);
      const camelCase = words
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");

      const lower = trimmed.toLowerCase();
      const joined = words.join("").toLowerCase();
      const snake = words.join("_").toLowerCase();
      const kebab = words.join("-").toLowerCase();

      return Array.from(
        new Set([
          trimmed,
          lower,
          camelCase,
          joined,
          snake,
          kebab,
        ])
      ).filter(Boolean);
    };

    const translateLabel = (label: unknown, _locale?: string): string => {
      void _locale;
      if (typeof label !== "string") {
        return label ? String(label) : "";
      }

      const candidates = buildCandidateKeys(label);
      for (const key of candidates) {
        if (te(key)) {
          return t(key);
        }
      }

      return label;
    };

    const pageTitle = computed(() => {
      return translateLabel(route.meta.pageTitle ?? "", locale.value);
    });

    const breadcrumbs = computed(() => {
      const raw = route.meta.breadcrumbs;
      if (!Array.isArray(raw)) {
        return null;
      }

      return raw
        .map((item) => translateLabel(item, locale.value))
        .filter((item): item is string => Boolean(item));
    });

    const homeLabel = computed(() => translateLabel("Home", locale.value));

    // Tailwind's build-time scanner can't see `flex-${direction}`
    // template-literal interpolation - same trap documented in
    // core/helpers/badge.ts. Explicit map instead ("row" | "column" only).
    const directionClass = computed(() =>
      pageTitleDirection.value === "column" ? "flex-col" : "flex-row"
    );

    return {
      pageTitle,
      breadcrumbs,
      pageTitleDisplay,
      pageTitleBreadcrumbDisplay,
      pageTitleDirection,
      directionClass,
      homeLabel,
    };
  },
});
</script>
