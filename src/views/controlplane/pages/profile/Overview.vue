<template>
  <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
    <div>
      <KTWidget1 widget-classes="mb-5"></KTWidget1>
      <KTWidget2 widget-classes="mb-5"></KTWidget2>
      <KTWidget3 widget-classes="mb-5"></KTWidget3>
      <KTWidget4 widget-classes="mb-5"></KTWidget4>
      <KTWidget5 widget-classes="mb-5"></KTWidget5>
      <KTWidget6 widget-classes="mb-5"></KTWidget6>
    </div>

    <div>
      <KTChartWidget1 widget-classes="mb-5"></KTChartWidget1>

      <KTListWidget5 widget-classes="mb-5"></KTListWidget5>

      <KTEngageWidget1 widget-classes="mb-5"></KTEngageWidget1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTWidget1 from "@/components/widgets/feeds/Widget1.vue";
import KTWidget2 from "@/components/widgets/feeds/Widget2.vue";
import KTWidget3 from "@/components/widgets/feeds/Widget3.vue";
import KTWidget4 from "@/components/widgets/feeds/Widget4.vue";
import KTWidget5 from "@/components/widgets/feeds/Widget5.vue";
import KTWidget6 from "@/components/widgets/feeds/Widget6.vue";
import KTChartWidget1 from "@/components/widgets/charts/Widget1.vue";
import KTListWidget5 from "@/components/widgets/lists/Widget5.vue";
import KTEngageWidget1 from "@/components/widgets/engage/Widget1.vue";

export default defineComponent({
  name: "profile-overview",
  components: {
    KTWidget1,
    KTWidget2,
    KTWidget3,
    KTWidget4,
    KTWidget5,
    KTWidget6,
    KTChartWidget1,
    KTListWidget5,
    KTEngageWidget1,
  },
});
</script>
