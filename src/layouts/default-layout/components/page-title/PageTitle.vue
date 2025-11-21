<template>
  <!--begin::Page title-->
  <div
    v-if="pageTitleDisplay"
    :class="`page-title d-flex flex-${pageTitleDirection} justify-content-center flex-wrap me-3`"
  >
    <template v-if="pageTitle">
      <!--begin::Title-->
      <h1
        class="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ pageTitle }}
      </h1>
      <!--end::Title-->

      <span
        v-if="pageTitleDirection === 'row' && pageTitleBreadcrumbDisplay"
        class="h-20px border-gray-200 border-start mx-3"
      ></span>

      <!--begin::Breadcrumb-->
      <ul
        v-if="breadcrumbs && breadcrumbs.length && pageTitleBreadcrumbDisplay"
        class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1"
      >
        <!--begin::Item-->
        <li class="breadcrumb-item text-muted">
          <router-link to="/" class="text-muted text-hover-primary"
            >{{ homeLabel }}</router-link
          >
        </li>
        <!--end::Item-->
        <template v-for="(item, i) in breadcrumbs" :key="i">
          <!--begin::Item-->
          <li class="breadcrumb-item">
            <span class="bullet bg-gray-500 w-5px h-2px"></span>
          </li>
          <!--end::Item-->
          <!--begin::Item-->
          <li class="breadcrumb-item text-muted">{{ item }}</li>
          <!--end::Item-->
        </template>
      </ul>
      <!--end::Breadcrumb-->
    </template>
  </div>
  <div v-else class="align-items-stretch"></div>
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

    return {
      pageTitle,
      breadcrumbs,
      pageTitleDisplay,
      pageTitleBreadcrumbDisplay,
      pageTitleDirection,
      homeLabel,
    };
  },
});
</script>
