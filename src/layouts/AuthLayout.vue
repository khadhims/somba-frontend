<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-center flex-column-fluid auth-layout-bg">
    <!--begin::Content-->
    <div class="d-flex flex-center w-100 p-10">
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

    return {};
  },
});
</script>

<style scoped>
.auth-layout-bg {
  background-color: #0f172a; /* Dark background */
  background-image: 
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
  min-height: 100vh;
}
</style>
