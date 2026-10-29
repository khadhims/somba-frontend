<template>
  <!--begin::Menu 1-->
  <div
    class="w-[250px] rounded-lg bg-white shadow-lg dark:bg-gray-900 md:w-[300px]"
  >
    <!--begin::Header-->
    <div class="px-7 py-5">
      <div class="text-base font-bold text-gray-900 dark:text-gray-100">
        Filter Options
      </div>
    </div>
    <!--end::Header-->

    <div class="border-t border-gray-200 dark:border-gray-700"></div>

    <!--begin::Form-->
    <div class="px-7 py-5">
      <!--begin::Input group-->
      <div class="mb-10">
        <!--begin::Label-->
        <label
          class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >Status:</label
        >
        <!--end::Label-->

        <!--begin::Input-->
        <select v-model="data.status" :class="formInputClass">
          <option label="Approved" value="1">Approved</option>
          <option label="Pending" value="2">Pending</option>
          <option label="In Process" value="3">In Process</option>
          <option label="Rejected" value="4">Rejected</option>
        </select>
        <!--end::Input-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10">
        <!--begin::Label-->
        <label
          class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >Member Type:</label
        >
        <!--end::Label-->

        <!--begin::Options-->
        <div class="flex gap-5">
          <label
            class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              value="1"
              v-model="data.author"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            Author
          </label>

          <label
            class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              value="2"
              v-model="data.customer"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            Customer
          </label>
        </div>
        <!--end::Options-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10">
        <!--begin::Label-->
        <label
          class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >Notifications:</label
        >
        <!--end::Label-->

        <!--begin::Switch-->
        <label class="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            v-model="data.notifications"
            class="peer sr-only"
            name="notifications"
          />
          <span
            class="h-5 w-9 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary dark:bg-gray-700"
          ></span>
        </label>
        <!--end::Switch-->
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="flex justify-end gap-2">
        <button
          type="reset"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          @click="$emit('close')"
        >
          Reset
        </button>

        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
          @click="$emit('close')"
        >
          Apply
        </button>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
  <!--end::Menu 1-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { formInputClass } from "@/core/helpers/badge";

interface Filter {
  status: string;
  author: boolean;
  customer: boolean;
  notifications: boolean;
}

export default defineComponent({
  name: "dropdown-1",
  components: {},
  emits: ["close"],
  setup() {
    const data = ref<Filter>({
      status: "1",
      author: true,
      customer: true,
      notifications: true,
    });

    return {
      data,
      formInputClass,
    };
  },
});
</script>
