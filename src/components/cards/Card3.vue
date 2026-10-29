<template>
  <!--begin::Col-->
  <div>
    <!--begin::Card-->
    <div
      class="h-full rounded-lg bg-white dark:bg-gray-900"
      :class="cardClasses"
    >
      <!--begin::Card body-->
      <div class="flex flex-col items-center justify-center p-9 text-center">
        <!--begin::Avatar-->
        <div
          v-if="avatar"
          class="relative mb-5 h-[65px] w-[65px] overflow-hidden rounded-full"
        >
          <img :src="avatar" alt="image" />
          <div
            v-if="online"
            class="absolute bottom-0 right-0 h-[15px] w-[15px] rounded-full border-[3px] border-white bg-success dark:border-gray-900"
          ></div>
        </div>
        <div
          v-else
          class="relative mb-5 h-[65px] w-[65px] overflow-hidden rounded-full"
        >
          <span
            :class="initialsClasses"
            class="flex h-full w-full items-center justify-center text-xl font-semibold"
            >{{ initials }}</span
          >
          <div
            v-if="online"
            class="absolute bottom-0 right-0 h-[15px] w-[15px] rounded-full border-[3px] border-white bg-success dark:border-gray-900"
          ></div>
        </div>
        <!--end::Avatar-->

        <!--begin::Name-->
        <a
          href="#"
          class="mb-0 text-lg font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
          >{{ name }}</a
        >
        <!--end::Name-->

        <!--begin::Position-->
        <div class="mb-6 font-semibold text-gray-400">{{ position }}</div>
        <!--end::Position-->

        <!--begin::Info-->
        <div class="mb-5 flex flex-wrap items-center justify-center">
          <!--begin::Stats-->
          <div
            class="mx-3 mb-3 min-w-[125px] rounded border border-dashed border-gray-300 px-4 py-3"
          >
            <div class="text-sm font-bold text-gray-700 dark:text-gray-300">
              {{ avgEarnings }}
            </div>
            <div class="font-semibold text-gray-500">Avg. Earnings</div>
          </div>
          <!--end::Stats-->

          <!--begin::Stats-->
          <div
            class="mx-3 mb-3 min-w-[125px] rounded border border-dashed border-gray-300 px-4 py-3"
          >
            <div class="text-sm font-bold text-gray-700 dark:text-gray-300">
              {{ totalSales }}
            </div>
            <div class="font-semibold text-gray-500">Total Sales</div>
          </div>
          <!--end::Stats-->
        </div>
        <!--end::Info-->

        <!--begin::Follow-->
        <a
          v-if="connected"
          href="#"
          class="inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <KTIcon icon-name="check" icon-class="fs-3" />
          Connected
        </a>
        <a
          v-else
          href="#"
          class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <KTIcon icon-name="plus" icon-class="fs-3" />
          Connect
        </a>
        <!--end::Follow-->
      </div>
      <!--begin::Card body-->
    </div>
    <!--begin::Card-->
  </div>
  <!--end::Col-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import { badgeVariantClass, type BadgeVariant } from "@/core/helpers/badge";

export default defineComponent({
  name: "card-3",
  components: {
    /* empty */
  },
  props: {
    cardClasses: String,

    avatar: String,

    online: Boolean,

    initials: String,

    color: String,

    name: String,

    position: String,

    avgEarnings: String,

    totalSales: String,

    connected: Boolean,
  },
  setup(props) {
    // Was `text-${color} bg-light-${color}` template-literal interpolation -
    // Tailwind's build-time scanner can't see runtime-computed class names,
    // same trap documented in core/helpers/badge.ts. Reuse the shared
    // variant map instead (adds "text-{variant}" alongside its own
    // "bg-{variant}-light text-{variant}").
    const initialsClasses = computed(() =>
      badgeVariantClass((props.color as BadgeVariant) || "primary")
    );
    return {
      getAssetPath,
      initialsClasses,
    };
  },
});
</script>
