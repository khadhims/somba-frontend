<template>
  <!--begin::Authentication Layout -->
  <div
    class="auth-layout-bg flex min-h-screen flex-col items-center justify-center bg-[#0f172a] bg-[radial-gradient(at_0%_0%,hsla(253,16%,7%,1)_0,transparent_50%),radial-gradient(at_50%_0%,hsla(225,39%,30%,1)_0,transparent_50%),radial-gradient(at_100%_0%,hsla(339,49%,30%,1)_0,transparent_50%)]"
  >
    <!--begin::Content-->
    <div class="flex w-full items-center justify-center p-10">
      <router-view></router-view>
    </div>
    <!--end::Content-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "auth-layout",
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);
      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
    });

    return {
      /* empty */
    };
  },
});
</script>
