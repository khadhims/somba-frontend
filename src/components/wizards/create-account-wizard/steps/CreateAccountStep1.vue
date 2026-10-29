<template>
  <!--begin::Step 1-->
  <div v-show="active">
    <!--begin::Wrapper-->
    <div class="w-full">
      <!--begin::Heading-->
      <div class="pb-10 lg:pb-15">
        <!--begin::Title-->
        <h2
          class="flex items-center font-bold text-gray-900 dark:text-gray-100"
        >
          Choose Account Type
          <KTIcon
            icon-name="information"
            icon-class="ms-2 fs-7"
            title="Billing is issued based on your selected account type"
          />
        </h2>
        <!--end::Title-->

        <!--begin::Notice-->
        <div class="text-sm font-semibold text-gray-500">
          If you need more info, please check out
          <a href="#" class="font-bold text-primary hover:underline"
            >Help Page</a
          >.
        </div>
        <!--end::Notice-->
      </div>
      <!--end::Heading-->

      <!--begin::Input group-->
      <div>
        <!--begin::Row-->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!--begin::Col-->
          <div>
            <!--begin::Option-->
            <Field
              type="radio"
              class="peer sr-only"
              name="accountType"
              value="personal"
              id="kt_create_account_form_account_type_personal"
            />
            <label
              class="flex cursor-pointer items-center rounded-md border border-dashed border-gray-300 p-7 transition-colors peer-checked:border-primary peer-checked:bg-primary-light dark:border-gray-700"
              for="kt_create_account_form_account_type_personal"
            >
              <KTIcon icon-name="address-book" icon-class="fs-3x me-5" />

              <!--begin::Info-->
              <span class="block text-left font-semibold">
                <span
                  class="mb-2 block text-lg font-bold text-gray-900 dark:text-gray-100"
                >
                  Personal Account
                </span>
                <span class="text-sm font-semibold text-gray-500"
                  >If you need more info, please check it out</span
                >
              </span>
              <!--end::Info-->
            </label>
            <!--end::Option-->
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div>
            <!--begin::Option-->
            <Field
              type="radio"
              class="peer sr-only"
              name="accountType"
              value="corporate"
              id="kt_create_account_form_account_type_corporate"
            />
            <label
              class="flex cursor-pointer items-center rounded-md border border-dashed border-gray-300 p-7 transition-colors peer-checked:border-primary peer-checked:bg-primary-light dark:border-gray-700"
              for="kt_create_account_form_account_type_corporate"
            >
              <KTIcon icon-name="briefcase" icon-class="fs-3x me-5" />

              <!--begin::Info-->
              <span class="block text-left font-semibold">
                <span
                  class="mb-2 block text-lg font-bold text-gray-900 dark:text-gray-100"
                  >Corporate Account</span
                >
                <span class="text-sm font-semibold text-gray-500"
                  >Create corporate account to mane users</span
                >
              </span>
              <!--end::Info-->
            </label>
            <!--end::Option-->
          </div>
          <!--end::Col-->

          <ErrorMessage
            name="accountType"
            class="mt-1 block text-sm text-danger"
          ></ErrorMessage>
        </div>
        <!--end::Row-->
      </div>
      <!--end::Input group-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::Step 1-->
</template>

<script setup lang="ts">
defineOptions({
  name: "CreateAccountStep1Component",
});

import { ErrorMessage, Field } from "vee-validate";

defineProps<{ active: boolean }>();
</script>
