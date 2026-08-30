<template>
  <!--begin::Step 5-->
  <div v-show="active">
    <!--begin::Wrapper-->
    <div class="w-full">
      <!--begin::Heading-->
      <div class="pb-8 lg:pb-10">
        <!--begin::Title-->
        <h2 class="font-bold text-gray-900 dark:text-gray-100">Your Are Done!</h2>
        <!--end::Title-->

        <!--begin::Notice-->
        <div class="text-sm font-semibold text-gray-500">
          If you need more info, please
          <router-link to="/sign-in" class="font-bold text-primary hover:underline"
            >Sign In</router-link
          >.
        </div>
        <!--end::Notice-->
      </div>
      <!--end::Heading-->

      <!--begin::Body-->
      <div class="mb-0">
        <!--begin::Text-->
        <div class="mb-5 text-sm text-gray-600 dark:text-gray-400">
          Writing headlines for blog posts is as much an art as it is a science
          and probably warrants its own post, but for all advise is with what
          works for your great & amazing audience.
        </div>
        <!--end::Text-->

        <!--begin::Alert-->
        <div
          class="flex rounded border border-dashed border-warning bg-warning-light p-6"
        >
          <KTIcon
            icon-name="information-5"
            icon-class="fs-2tx text-warning me-4"
          />
          <!--begin::Wrapper-->
          <div class="flex flex-1 items-center justify-between">
            <!--begin::Content-->
            <div class="font-semibold">
              <h4 class="font-bold text-gray-800 dark:text-gray-200">We need your attention!</h4>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                To start using great tools, please, please
                <a href="#" class="font-bold">Create Team Platform</a>
              </div>
            </div>
            <!--end::Content-->
          </div>
          <!--end::Wrapper-->
        </div>
        <!--end::Alert-->
      </div>
      <!--end::Body-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::Step 5-->
</template>

<script setup lang="ts">
defineProps<{ active: boolean }>();
</script>
