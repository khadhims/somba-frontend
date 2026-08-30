<template>
  <div class="py-5">
    <div class="group relative rounded-md bg-gray-900 p-6">
      <button
        class="highlight-copy absolute right-7 top-6 hidden rounded px-4 py-1 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white group-hover:flex"
        title="Copy code"
      >
        copy
      </button>
      <div class="highlight-code overflow-auto">
        <pre
          :class="`language-${lang}`"
          :style="{ height: getHeightInPixesls, background: 'transparent', margin: 0, padding: 0 }"
        ><code :class="`language-${lang}`">
          <slot></slot>
        </code></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useCopyClipboard } from "@/core/helpers/system";
import Prism from "prismjs";

export default defineComponent({
  name: "CodeHighlighter",
  props: {
    lang: String,
    fieldHeight: Number,
  },
  setup(props) {
    const height = ref(props.fieldHeight);

    const { init } = useCopyClipboard();

    const getHeightInPixesls = computed(() => {
      return height.value + "px";
    });

    onMounted(() => {
      Prism.highlightAll();
      init();
    });

    return {
      getHeightInPixesls,
    };
  },
  components: {},
});
</script>
