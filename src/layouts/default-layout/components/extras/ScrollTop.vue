<template>
  <!-- begin::Scrolltop -->
  <button
    v-if="scrolltopDispaly && visible"
    id="kt_scrolltop"
    type="button"
    class="fixed bottom-8 right-8 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary-active"
    @click="scrollToTop"
  >
    <KTIcon icon-name="arrow-up" icon-class="fs-2x" />
  </button>
  <!-- end::Scrolltop -->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { scrolltopDispaly } from "@/layouts/default-layout/config/helper";

// Replaces Metronic's ScrollTopComponent (src/assets/ts/components/_ScrollTopComponent.ts)
// - same 200px show threshold, native `scrollTo({behavior: "smooth"})`
// instead of its custom animation utility.
const SHOW_OFFSET = 200;

export default defineComponent({
  name: "KTScrollTop",
  components: {
    /* empty */
  },
  setup() {
    const visible = ref(false);

    const onScroll = () => {
      visible.value = window.scrollY > SHOW_OFFSET;
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    onMounted(() => {
      window.addEventListener("scroll", onScroll);
      onScroll();
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", onScroll);
    });

    return {
      visible,
      scrollToTop,
      scrolltopDispaly,
      getAssetPath,
    };
  },
});
</script>
