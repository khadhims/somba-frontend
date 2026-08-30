<template>
  <!--begin::Charts Widget 1-->
  <div class="rounded-lg bg-white dark:bg-gray-900" :class="widgetClasses">
    <!--begin::Header-->
    <div class="flex items-start justify-between p-6 pb-0">
      <!--begin::Title-->
      <h3 class="flex flex-col">
        <span class="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">Recent Statistics</span>

        <span class="text-sm font-semibold text-gray-500"
          >More than 400 new members</span
        >
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div class="relative" :ref="(el) => (menuDropdown.containerRef.value = el as HTMLElement | null)">
        <!--begin::Menu-->
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-light"
          @click="menuDropdown.toggle"
        >
          <KTIcon icon-name="category" icon-class="fs-2" />
        </button>
        <div v-show="menuDropdown.isOpen.value" class="absolute right-0 top-full z-20 mt-2">
          <Dropdown1 @close="menuDropdown.close"></Dropdown1>
        </div>
        <!--end::Menu-->
      </div>
      <!--end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="p-6">
      <!--begin::Chart-->
      <apexchart
        ref="chartRef"
        type="bar"
        :options="chart"
        :series="series"
        :height="height"
      ></apexchart>
      <!--end::Chart-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Charts Widget 1-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { useThemeStore } from "@/stores/theme";
import type { ApexOptions } from "apexcharts";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import type VueApexCharts from "vue3-apexcharts";
import { useDropdown } from "@/composables/useDropdown";

export default defineComponent({
  name: "widget-1",
  props: {
    widgetClasses: String,
    height: Number,
  },
  components: {
    Dropdown1,
  },
  setup() {
    const chartRef = ref<typeof VueApexCharts | null>(null);
    const chart = ref<ApexOptions>({});
    const store = useThemeStore();
    const menuDropdown = useDropdown();

    const series = [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58],
      },
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105],
      },
    ];

    const themeMode = computed(() => {
      return store.mode;
    });

    onBeforeMount(() => {
      Object.assign(chart.value, chartOptions());
    });

    const refreshChart = () => {
      if (!chartRef.value) {
        return;
      }

      chartRef.value.updateOptions(chartOptions());
    };

    watch(themeMode, () => {
      refreshChart();
    });

    return {
      chart,
      series,
      chartRef,
      menuDropdown,
      getAssetPath,
    };
  },
});

const chartOptions = (): ApexOptions => {
  const labelColor = getCSSVariableValue("--bs-gray-500");
  const borderColor = getCSSVariableValue("--bs-gray-200");
  const baseColor = getCSSVariableValue("--bs-primary");
  const secondaryColor = getCSSVariableValue("--bs-gray-300");

  return {
    chart: {
      fontFamily: "inherit",
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return "$" + val + " thousands";
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
};
</script>
