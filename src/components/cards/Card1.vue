<template>
  <!--begin::Card-->
  <a
    href="#"
    class="block rounded-lg border-2 border-gray-300 bg-white transition-colors hover:border-primary dark:bg-gray-900 dark:border-gray-700"
  >
    <!--begin::Card header-->
    <div class="flex items-center justify-between px-9 pt-9">
      <!--begin::Card Title-->
      <div class="m-0">
        <!--begin::Avatar-->
        <div
          class="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <img :src="icon" alt="image" class="p-3" />
        </div>
        <!--end::Avatar-->
      </div>
      <!--end::Car Title-->

      <!--begin::Card toolbar-->
      <div>
        <span
          class="mr-auto inline-flex rounded px-4 py-3 text-xs font-bold"
          :class="badgeVariantClass(statusVariant)"
          >{{ getStatus }}</span
        >
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end:: Card header-->

    <!--begin:: Card body-->
    <div class="p-9">
      <!--begin::Name-->
      <div class="text-xl font-bold text-gray-900 dark:text-gray-100">
        {{ title }}
      </div>
      <!--end::Name-->

      <!--begin::Description-->
      <p class="mb-7 mt-1 text-base font-semibold text-gray-500">
        {{ getDescription }}
      </p>
      <!--end::Description-->

      <!--begin::Info-->
      <div class="mb-5 flex flex-wrap">
        <!--begin::Due-->
        <div
          class="mb-3 mr-7 min-w-[125px] rounded border border-dashed border-gray-300 px-4 py-3"
        >
          <div class="text-sm font-bold text-gray-800 dark:text-gray-200">
            {{ getDate }}
          </div>
          <div class="font-semibold text-gray-500">Due Date</div>
        </div>
        <!--end::Due-->

        <!--begin::Budget-->
        <div
          class="mb-3 min-w-[125px] rounded border border-dashed border-gray-300 px-4 py-3"
        >
          <div class="text-sm font-bold text-gray-800 dark:text-gray-200">
            {{ getBudget }}
          </div>
          <div class="font-semibold text-gray-500">Budget</div>
        </div>
        <!--end::Budget-->
      </div>
      <!--end::Info-->

      <!--begin::Progress-->
      <div
        class="mb-5 h-1 w-full rounded bg-gray-100 dark:bg-gray-800"
        :title="`This project ${progress}% completed`"
      >
        <div
          class="h-1 rounded"
          :class="solidBgClass"
          role="progressbar"
          :style="{ width: progress + `%` }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <!--end::Progress-->

      <template v-if="users">
        <!--begin::Users-->
        <div class="flex -space-x-2">
          <template v-for="(user, index) in users" :key="index">
            <!--begin::User-->
            <div
              class="h-[35px] w-[35px] overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-900"
              :title="user.title"
            >
              <img v-if="user.src" alt="Pic" :src="user.src" />
              <span
                v-else
                class="flex h-full w-full items-center justify-center text-xs font-bold"
                :class="userSolidClass(user.state)"
                >{{ user.initials }}</span
              >
            </div>
            <!--begin::User-->
          </template>
        </div>
        <!--end::Users-->
      </template>
    </div>
    <!--end:: Card body-->
  </a>
  <!--end::Card-->
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { badgeVariantClass, type BadgeVariant } from "@/core/helpers/badge";

// Solid bg (+ white text for avatar initials) per variant - a different
// look from badgeVariantClass()'s light-pill style, needed for the
// progress-bar fill and the stacked user-initials avatars here. Was
// `bg-${state} text-inverse-${state}` template-literal interpolation,
// which Tailwind's build-time scanner can't see - same trap documented in
// core/helpers/badge.ts.
const SOLID_BG_CLASSES: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
  secondary: "bg-gray-400",
};

export default defineComponent({
  name: "card-1",
  components: {
    /* empty */
  },
  props: {
    progress: Number,

    // Was `statusDataBadgeColor`/`statusDataColor` string props holding raw
    // Bootstrap class names (e.g. "badge-light-success", "bg-primary") -
    // Tailwind needs a variant name + a literal class lookup instead (same
    // reasoning as badge.ts). No caller ever varied the two independently,
    // so they're unified into one variant prop.
    statusVariant: { type: String as () => BadgeVariant, default: "primary" },

    status: String,

    icon: String,

    title: String,

    description: String,

    date: String,

    budget: String,

    users: Array as () => Array<any>,
  },
  setup(props) {
    const getDescription = computed(() => {
      return props.description
        ? props.description
        : "CRM App application to HR efficiency";
    });

    const getDate = computed(() => {
      return props.date ? props.date : "Feb 21, 2021";
    });

    const getBudget = computed(() => {
      return props.budget ? props.budget : "$284,900.00";
    });

    const getStatus = computed(() => {
      return props.status ? props.status : "In Progress";
    });

    const solidBgClass = computed(
      () => SOLID_BG_CLASSES[props.statusVariant] || SOLID_BG_CLASSES.primary
    );

    const userSolidClass = (state: string) =>
      `text-white ${SOLID_BG_CLASSES[state] || SOLID_BG_CLASSES.primary}`;

    return {
      getDescription,
      getDate,
      getBudget,
      getStatus,
      badgeVariantClass,
      solidBgClass,
      userSolidClass,
    };
  },
});
</script>
