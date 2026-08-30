<template>
  <!--begin::Step 3-->
  <div v-show="active">
    <div class="w-full">
      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="mb-2 block text-base font-semibold after:content-['*'] after:ml-0.5 after:text-danger"> Database Name </label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          type="text"
          :class="formInputClass"
          name="dbName"
          placeholder=""
        />
        <ErrorMessage
          class="fv-plugins-message-container invalid-feedback"
          name="dbName"
        />
        <!--end::Input-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row">
        <!--begin::Label-->
        <label class="mb-4 flex items-center text-base font-semibold">
          <span class="after:content-['*'] after:ml-0.5 after:text-danger">Select Database Engine</span>

          <i
            class="fas fa-exclamation-circle ms-2 fs-7"
            title="Select your app database engine"
          ></i>
        </label>
        <!--end::Label-->

        <!--begin:Option-->
        <label class="mb-5 flex cursor-pointer items-center justify-between">
          <!--begin::Label-->
          <span class="mr-2 flex items-center">
            <!--begin::Icon-->
            <span class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-success-light">
              <i class="fas fa-database text-success fs-2x"></i>
            </span>
            <!--end::Icon-->

            <!--begin::Info-->
            <span class="flex flex-col">
              <span class="text-sm font-bold">MySQL</span>

              <span class="text-xs text-gray-500">Basic MySQL database</span>
            </span>
            <!--end::Info-->
          </span>
          <!--end::Label-->

          <!--begin::Input-->
          <span class="flex items-center">
            <Field
              class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
              type="radio"
              name="dbType"
              value="1"
            />
          </span>
          <!--end::Input-->
        </label>
        <!--end::Option-->

        <!--begin:Option-->
        <label class="mb-5 flex cursor-pointer items-center justify-between">
          <!--begin::Label-->
          <span class="mr-2 flex items-center">
            <!--begin::Icon-->
            <span class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-danger-light">
              <i class="fab fa-google text-danger fs-2x"></i>
            </span>
            <!--end::Icon-->

            <!--begin::Info-->
            <span class="flex flex-col">
              <span class="text-sm font-bold">Firebase</span>

              <span class="text-xs text-gray-500"
                >Google based app data management</span
              >
            </span>
            <!--end::Info-->
          </span>
          <!--end::Label-->

          <!--begin::Input-->
          <span class="flex items-center">
            <Field
              class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
              type="radio"
              name="dbType"
              value="2"
            />
          </span>
          <!--end::Input-->
        </label>
        <!--end::Option-->

        <!--begin:Option-->
        <label class="flex cursor-pointer items-center justify-between">
          <!--begin::Label-->
          <span class="mr-2 flex items-center">
            <!--begin::Icon-->
            <span class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-warning-light">
              <i class="fab fa-amazon text-warning fs-2x"></i>
            </span>
            <!--end::Icon-->

            <!--begin::Info-->
            <span class="flex flex-col">
              <span class="text-sm font-bold">DynamoDB</span>

              <span class="text-xs text-gray-500">Amazon Fast NoSQL Database</span>
            </span>
            <!--end::Info-->
          </span>
          <!--end::Label-->

          <!--begin::Input-->
          <span class="flex items-center">
            <Field
              class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
              type="radio"
              name="dbType"
              value="3"
            />
          </span>
          <!--end::Input-->
        </label>
        <!--end::Option-->

        <ErrorMessage
          class="fv-plugins-message-container invalid-feedback"
          name="dbType"
        />
      </div>
      <!--end::Input group-->
    </div>
  </div>
  <!--end::Step 3-->
</template>

<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";
import { formInputClass } from "@/core/helpers/badge";

defineProps<{ active: boolean }>();
</script>
