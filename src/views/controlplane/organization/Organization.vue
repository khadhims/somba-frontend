<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "OrganizationView",
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
