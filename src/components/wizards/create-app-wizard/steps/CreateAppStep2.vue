<template>
  <!--begin::Step 2-->
  <div v-show="active">
    <div class="w-full">
      <!--begin::Input group-->
      <div class="fv-row">
        <!--begin::Label-->
        <label class="mb-4 flex items-center text-base font-semibold">
          <span class="after:content-['*'] after:ml-0.5 after:text-danger"
            >Select Framework</span
          >
          <KTIcon
            icon-name="information"
            icon-class="ms-2 fs-7"
            title="Specify your apps framework"
          />
        </label>
        <!--end::Label-->

        <!--begin:Option-->
        <label class="mb-5 flex cursor-pointer items-center justify-between">
          <!--begin:Label-->
          <span class="mr-2 flex items-center">
            <!--begin:Icon-->
            <span
              class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-warning-light"
            >
              <i class="fab fa-html5 text-warning fs-2x"></i>
            </span>
            <!--end:Icon-->

            <!--begin:Info-->
            <span class="flex flex-col">
              <span class="text-sm font-bold">HTML5</span>

              <span class="text-xs text-gray-500">Base Web Projec</span>
            </span>
            <!--end:Info-->
          </span>
          <!--end:Label-->

          <!--begin:Input-->
          <span class="flex items-center">
            <Field
              class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
              type="radio"
              name="framework"
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
              class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-success-light"
            >
              <i class="fab fa-react text-success fs-2x"></i>
            </span>
            <!--end:Icon-->

            <!--begin:Info-->
            <span class="flex flex-col">
              <span class="text-sm font-bold">ReactJS</span>
              <span class="text-xs text-gray-500"
                >Robust and flexible app framework</span
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
              name="framework"
              value="2"
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
              <i class="fab fa-angular text-danger fs-2x"></i>
            </span>
            <!--end:Icon-->

            <!--begin:Info-->
            <span class="flex flex-col">
              <span class="text-sm font-bold">Angular</span>
              <span class="text-xs text-gray-500">Powerful data mangement</span>
            </span>
            <!--end:Info-->
          </span>
          <!--end:Label-->

          <!--begin:Input-->
          <span class="flex items-center">
            <Field
              class="h-4 w-4 cursor-pointer rounded-full border-gray-300 accent-primary dark:border-gray-600"
              type="radio"
              name="framework"
              value="3"
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
              class="mr-6 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary-light"
            >
              <i class="fab fa-vuejs text-primary fs-2x"></i>
            </span>
            <!--end:Icon-->

            <!--begin:Info-->
            <span class="flex flex-col">
              <span class="text-sm font-bold">Vue</span>
              <span class="text-xs text-gray-500"
                >Lightweight and responsive framework</span
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
              name="framework"
              value="4"
            />
          </span>
          <!--end:Input-->
        </label>
        <!--end::Option-->

        <ErrorMessage
          class="fv-plugins-message-container invalid-feedback"
          name="framework"
        />
      </div>
      <!--end::Input group-->
    </div>
  </div>
  <!--end::Step 2-->
</template>

<script setup lang="ts">
defineOptions({
  name: "CreateAppStep2Component",
});

import { ErrorMessage, Field } from "vee-validate";

defineProps<{ active: boolean }>();
</script>
