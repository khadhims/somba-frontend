<template>
  <!--begin::Search-->
  <div class="flex w-full items-center">
    <InlineForm />
  </div>
  <!--end::Search-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InlineForm from "@/layouts/default-layout/components/aside/search/InlineForm.vue";

export default defineComponent({
  name: "kt-search",
  components: {
    InlineForm,
  },
  setup() {
    // No need for search initialization anymore
    // InlineForm handles the trigger to open GlobalSearch
    return {
      /* empty */
    };
  },
});
</script>
