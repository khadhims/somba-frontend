<template>
  <!--begin::Step 3-->
  <div v-show="active">
    <!--begin::Wrapper-->
    <div class="w-full">
      <!--begin::Heading-->
      <div class="pb-10 lg:pb-12">
        <!--begin::Title-->
        <h2 class="font-bold text-gray-900 dark:text-gray-100">Business Details</h2>
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
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="mb-2 block text-sm font-medium after:content-['*'] after:ml-0.5 after:text-danger">Business Name</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          name="businessName"
          :class="formInputClass"
          value="Keenthemes Inc."
        />
        <ErrorMessage
          name="businessName"
          class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
        <!--end::Input-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="mb-2 flex items-center text-sm font-medium">
          <span class="after:content-['*'] after:ml-0.5 after:text-danger">Shortened Descriptor</span>
        </label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          name="businessDescriptor"
          :class="formInputClass"
          value="KEENTHEMES"
        />
        <!--end::Input-->
        <ErrorMessage
          name="businessDescriptor"
          class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>

        <!--begin::Hint-->
        <div class="mt-1 text-sm text-gray-500">
          Customers will see this shortened version of your statement descriptor
        </div>
        <!--end::Hint-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="mb-2 block text-sm font-medium after:content-['*'] after:ml-0.5 after:text-danger">Corporation Type</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          name="businessType"
          :class="formInputClass"
          as="select"
        >
          <option></option>
          <option value="1">S Corporation</option>
          <option value="1">C Corporation</option>
          <option value="2">Sole Proprietorship</option>
          <option value="3">Non-profit</option>
          <option value="4">Limited Liability</option>
          <option value="5">General Partnership</option>
        </Field>
        <!--end::Input-->
        <ErrorMessage
          name="businessType"
          class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--end::Label-->
        <label class="mb-2 block text-sm font-medium">Business Description</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          type="text"
          name="businessDescription"
          :class="formInputClass"
          rows="3"
        ></Field>
        <!--end::Input-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-0">
        <!--begin::Label-->
        <label class="text-sm font-medium after:content-['*'] after:ml-0.5 after:text-danger"
          >Contact Email</label
        >
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          name="businessEmail"
          :class="formInputClass"
          value="corp@support.com"
        />
        <!--end::Input-->
        <ErrorMessage
          name="businessEmail"
          class="fv-plugins-message-container invalid-feedback"
        ></ErrorMessage>
      </div>
      <!--end::Input group-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::Step 3-->
</template>

<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";
import { formInputClass } from "@/core/helpers/badge";

defineProps<{ active: boolean }>();
</script>
