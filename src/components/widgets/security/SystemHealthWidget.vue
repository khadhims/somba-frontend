<template>
  <!--begin::System Health Widget-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{ t('dashboard.systemHealth.title') }}</span>
        <span class="text-muted mt-1 fw-semibold fs-7">{{ t('dashboard.systemHealth.subtitle') }}</span>
      </h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::System Metrics-->
      <div class="mb-6">
        <!--begin::CPU Usage-->
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-40px me-4">
            <span class="symbol-label bg-light-primary">
              <KTIcon icon-name="cpu" icon-class="text-primary fs-2" />
            </span>
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-semibold text-gray-800">{{ t('dashboard.systemHealth.metrics.cpuUsage') }}</span>
              <span class="fw-bold text-gray-900">{{ systemMetrics.cpu }}%</span>
            </div>
            <div class="progress h-6px">
              <div 
                class="progress-bar bg-primary" 
                :style="`width: ${systemMetrics.cpu}%`"
              ></div>
            </div>
          </div>
        </div>
        <!--end::CPU Usage-->

        <!--begin::Memory Usage-->
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-40px me-4">
            <span class="symbol-label bg-light-info">
              <KTIcon icon-name="technology-1" icon-class="text-info fs-2" />
            </span>
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-semibold text-gray-800">{{ t('dashboard.systemHealth.metrics.memoryUsage') }}</span>
              <span class="fw-bold text-gray-900">{{ systemMetrics.memory }}%</span>
            </div>
            <div class="progress h-6px">
              <div 
                class="progress-bar bg-info" 
                :style="`width: ${systemMetrics.memory}%`"
              ></div>
            </div>
          </div>
        </div>
        <!--end::Memory Usage-->

        <!--begin::Storage Usage-->
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-40px me-4">
            <span class="symbol-label bg-light-warning">
              <KTIcon icon-name="folder" icon-class="text-warning fs-2" />
            </span>
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-semibold text-gray-800">{{ t('dashboard.systemHealth.metrics.storageUsage') }}</span>
              <span class="fw-bold text-gray-900">{{ systemMetrics.storage }}%</span>
            </div>
            <div class="progress h-6px">
              <div 
                class="progress-bar bg-warning" 
                :style="`width: ${systemMetrics.storage}%`"
              ></div>
            </div>
          </div>
        </div>
        <!--end::Storage Usage-->

        <!--begin::Network Usage-->
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-40px me-4">
            <span class="symbol-label bg-light-success">
              <KTIcon icon-name="router" icon-class="text-success fs-2" />
            </span>
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-semibold text-gray-800">{{ t('dashboard.systemHealth.metrics.networkTraffic') }}</span>
              <span class="fw-bold text-gray-900">{{ systemMetrics.network }} Mbps</span>
            </div>
            <div class="progress h-6px">
              <div 
                class="progress-bar bg-success" 
                :style="`width: ${(systemMetrics.network / 1000) * 100}%`"
              ></div>
            </div>
          </div>
        </div>
        <!--end::Network Usage-->
      </div>
      <!--end::System Metrics-->

      <!--begin::System Status-->
      <div class="separator separator-dashed mb-4"></div>
      <div class="row g-3">
        <div class="col-6">
          <div class="text-center">
            <div class="fw-bold text-gray-800">{{ t('dashboard.systemHealth.status.systemUptime') }}</div>
            <div class="text-primary fs-2 fw-bold">{{ systemUptime }}</div>
          </div>
        </div>
        <div class="col-6">
          <div class="text-center">
            <div class="fw-bold text-gray-800">{{ t('dashboard.systemHealth.status.lastBackup') }}</div>
            <div class="text-success fs-7 fw-semibold">{{ lastBackup }}</div>
          </div>
        </div>
      </div>
      <!--end::System Status-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::System Health Widget-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "SystemHealthWidget",
  props: {
    widgetClasses: String,
  },
  setup() {
    const { t } = useI18n();
    
    const systemMetrics = ref({
      cpu: 45,
      memory: 62,
      storage: 68,
      network: 234
    });

    const systemUptime = ref("72h 15m");
    const lastBackup = ref("2 hours ago");

    let metricsInterval: number;

    // Simulate real-time metrics updates
    const updateMetrics = () => {
      // Simulate fluctuating metrics
      systemMetrics.value.cpu = Math.floor(Math.random() * 30) + 30; // 30-60%
      systemMetrics.value.memory = Math.floor(Math.random() * 25) + 50; // 50-75%
      systemMetrics.value.network = Math.floor(Math.random() * 200) + 100; // 100-300 Mbps
    };

    onMounted(() => {
      // Update metrics every 5 seconds
      metricsInterval = setInterval(updateMetrics, 5000);
    });

    onUnmounted(() => {
      if (metricsInterval) {
        clearInterval(metricsInterval);
      }
    });

    return {
      t,
      systemMetrics,
      systemUptime,
      lastBackup,
    };
  },
});
</script>
