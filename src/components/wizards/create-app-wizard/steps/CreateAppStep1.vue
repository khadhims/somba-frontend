<template>
  <!--begin::Step 1-->
  <div v-show="active">
    <div class="w-full">
      <!--begin::Input group-->
      <div class="mb-10">
        <!--begin::Label-->
        <label class="mb-2 flex items-center text-base font-semibold">
          <span class="after:content-['*'] after:ml-0.5 after:text-danger"
            >App Name</span
          >
          <KTIcon
            icon-name="information"
            icon-class="ms-2 fs-7"
            title="Specify your unique app name"
          />
        </label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          type="text"
          :class="formInputClass"
          name="appName"
          placeholder=""
        />
        <ErrorMessage
          class="mt-1 block text-sm text-danger"
          name="appName"
        />
        <!--end::Input-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div>
        <!--begin::Label-->
        <label class="mb-4 flex items-center text-base font-semibold">
          <span class="after:content-['*'] after:ml-0.5 after:text-danger"
            >Category</span
          >

          <KTIcon
            icon-name="information"
            icon-class="ms-2 fs-7"
            title="Select your app category"
          />
        </label>
        <!--end::Label-->

        <!--begin:Options-->
        <div>
          <!--begin:Option-->
          <label class="mb-5 flex cursor-pointer items-center justify-between">
            <!--begin:Label-->
            <span class="mr-2 flex items-center">
              <!--begin:Icon-->
              <span
                class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary-light"
              >
                <KTIcon icon-name="compass" icon-class="fs-1 text-primary" />
              </span>
              <!--end:Icon-->

              <!--begin:Info-->
              <span class="flex flex-col">
                <span class="text-sm font-bold">Quick Online Courses</span>

                <span class="text-xs text-gray-500"
                  >Creating a clear text structure is just one SEO</span
                >
              </span>
              <!--end:Info-->
            </span>
            <!--end:Label-->

            <!--begin:Input-->
            <span class="flex items-center">
              <Field
                class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
                type="radio"
                name="category"
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
              <!--begin:Icon-->
              <span
                class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-danger-light"
              >
                <KTIcon icon-name="category" icon-class="fs-1 text-danger" />
              </span>
              <!--end:Icon-->

              <!--begin:Info-->
              <span class="flex flex-col">
                <span class="text-sm font-bold">Face to Face Discussions</span>

                <span class="text-xs text-gray-500"
                  >Creating a clear text structure is just one aspect</span
                >
              </span>
              <!--end:Info-->
            </span>
            <!--end:Label-->

            <!--begin:Input-->
            <span class="flex items-center">
              <Field
                class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
                type="radio"
                name="category"
                value="2"
              />
            </span>
            <!--end:Input-->
          </label>
          <!--end::Option-->

          <!--begin:Option-->
          <label class="flex cursor-pointer items-center justify-between">
            <!--begin:Label-->
            <span class="mr-2 flex items-center">
              <!--begin:Icon-->
              <span
                class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-success-light"
              >
                <KTIcon icon-name="timer" icon-class="fs-1 text-success" />
              </span>
              <!--end:Icon-->

              <!--begin:Info-->
              <span class="flex flex-col">
                <span class="text-sm font-bold">Full Intro Training</span>

                <span class="text-xs text-gray-500"
                  >Creating a clear text structure copywriting</span
                >
              </span>
              <!--end:Info-->
            </span>
            <!--end:Label-->

            <!--begin:Input-->
            <span class="flex items-center">
              <Field
                class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
                type="radio"
                name="category"
                value="3"
              />
            </span>
            <!--end:Input-->
          </label>
          <!--end::Option-->
          <ErrorMessage
            class="mt-1 block text-sm text-danger"
            name="category"
          />
        </div>
        <!--end:Options-->
      </div>
      <!--end::Input group-->
    </div>
  </div>
  <!--end::Step 1-->
</template>

<script setup lang="ts">
defineOptions({
  name: "CreateAppStep1Component",
});

import { ErrorMessage, Field } from "vee-validate";
import { formInputClass } from "@/core/helpers/badge";

defineProps<{ active: boolean }>();
</script>
