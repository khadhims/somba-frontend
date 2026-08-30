<template>
  <!--begin::Step 2-->
  <div v-show="active">
    <!--begin::Wrapper-->
    <div class="w-full">
      <!--begin::Heading-->
      <div class="pb-10 lg:pb-15">
        <!--begin::Title-->
        <h2 class="font-bold text-gray-900 dark:text-gray-100">Account Info</h2>
        <!--end::Title-->

        <!--begin::Notice-->
        <div class="text-sm font-semibold text-gray-500">
          If you need more info, please check out
          <a href="#" class="font-bold text-primary hover:underline">Help Page</a>.
        </div>
        <!--end::Notice-->
      </div>
      <!--end::Heading-->

      <!--begin::Input group-->
      <div class="mb-10 fv-row">
        <!--begin::Label-->
        <label class="mb-3 flex items-center text-sm font-medium">
          Specify Team Size
          <i
            class="fas fa-exclamation-circle ms-2 fs-7"
            title="Provide your team size to help us setup your billing"
          ></i>
        </label>
        <!--end::Label-->

        <!--begin::Row-->
        <div class="mb-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <!--begin::Col-->
          <div>
            <!--begin::Option-->
            <Field
              type="radio"
              class="peer sr-only"
              id="accountTeamSize1"
              name="accountTeamSize"
              value="1-1"
            />
            <label
              class="flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary-light dark:border-gray-700"
              for="accountTeamSize1"
            >
              <span class="text-lg font-bold">1-1</span>
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
              name="accountTeamSize"
              id="accountTeamSize2"
              value="2-10"
            />
            <label
              class="flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary-light dark:border-gray-700"
              for="accountTeamSize2"
            >
              <span class="text-lg font-bold">2-10</span>
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
              name="accountTeamSize"
              id="accountTeamSize3"
              value="10-50"
            />
            <label
              class="flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary-light dark:border-gray-700"
              for="accountTeamSize3"
            >
              <span class="text-lg font-bold">10-50</span>
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
              name="accountTeamSize"
              id="accountTeamSize4"
              checked
              value="50+"
            />
            <label
              class="flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary-light dark:border-gray-700"
              for="accountTeamSize4"
            >
              <span class="text-lg font-bold">50+</span>
            </label>
            <!--end::Option-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Row-->

        <!--begin::Hint-->
        <div class="mt-1 text-sm text-gray-500">
          Customers will see this shortened version of your statement descriptor
        </div>
        <!--end::Hint-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10 fv-row">
        <!--begin::Label-->
        <label class="mb-3 block text-sm font-medium">Team Account Name</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          type="text"
          :class="formInputClass"
          name="accountName"
        />
        <ErrorMessage
          name="accountName"
          class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
        <!--end::Input-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-0 fv-row">
        <!--begin::Label-->
        <label class="mb-5 flex items-center text-sm font-medium">
          Select Account Plan
          <i
            class="fas fa-exclamation-circle ms-2 fs-7"
            title="Monthly billing will be based on your account plan"
          ></i>
        </label>
        <!--end::Label-->

        <!--begin::Options-->
        <div class="mb-0">
          <!--begin:Option-->
          <label class="mb-5 flex cursor-pointer items-center justify-between">
            <!--begin:Label-->
            <span class="mr-2 flex items-center">
              <!--begin::Icon-->
              <span class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <KTIcon icon-name="bank" icon-class="fs-1 text-gray-600" />
              </span>
              <!--end::Icon-->

              <!--begin::Description-->
              <span class="flex flex-col">
                <span class="text-lg font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-200"
                  >Company Account</span
                >
                <span class="text-sm font-semibold text-gray-500"
                  >Use images to enhance your post flow</span
                >
              </span>
              <!--end:Description-->
            </span>
            <!--end:Label-->

            <!--begin:Input-->
            <span class="flex items-center">
              <Field
                class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
                type="radio"
                name="accountPlan"
                value="1"
              />
            </span>
            <!--end:Input-->
          </label>
          <!--end::Option-->

          <!--begin:Option-->
          <label class="mb-5 flex cursor-pointer items-center justify-between">
            <!--begin:Label-->
            <span class="mr-2 flex items-center">
              <!--begin::Icon-->
              <span class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <KTIcon icon-name="chart" icon-class="fs-1 text-gray-600" />
              </span>
              <!--end::Icon-->

              <!--begin::Description-->
              <span class="flex flex-col">
                <span class="text-lg font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-200"
                  >Developer Account</span
                >
                <span class="text-sm font-semibold text-gray-500"
                  >Use images to your post time</span
                >
              </span>
              <!--end:Description-->
            </span>
            <!--end:Label-->

            <!--begin:Input-->
            <span class="flex items-center">
              <Field
                class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
                type="radio"
                checked
                name="accountPlan"
                value="2"
              />
            </span>
            <!--end:Input-->
          </label>
          <!--end::Option-->

          <!--begin:Option-->
          <label class="mb-0 flex cursor-pointer items-center justify-between">
            <!--begin:Label-->
            <span class="mr-2 flex items-center">
              <!--begin::Icon-->
              <span class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <KTIcon
                  icon-name="chart-pie-4"
                  icon-class="fs-1 text-gray-600"
                />
              </span>
              <!--end::Icon-->

              <!--begin::Description-->
              <span class="flex flex-col">
                <span class="text-lg font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-200"
                  >Testing Account</span
                >
                <span class="text-sm font-semibold text-gray-500"
                  >Use images to enhance time travel rivers</span
                >
              </span>
              <!--end:Description-->
            </span>
            <!--end:Label-->

            <!--begin:Input-->
            <span class="flex items-center">
              <Field
                class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
                type="radio"
                name="accountPlan"
                value="3"
              />
            </span>
            <!--end:Input-->
          </label>
          <!--end::Option-->
        </div>
        <!--end::Options-->
      </div>
      <!--end::Input group-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::Step 2-->
</template>

<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";
import { formInputClass } from "@/core/helpers/badge";

defineProps<{ active: boolean }>();
</script>
