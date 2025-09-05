<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";

export default defineComponent({
  name: "organization",
  components: {
    Dropdown3,
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
