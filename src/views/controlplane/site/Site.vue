<template>
  <!--begin::Site Management Layout-->
  <div class="d-flex flex-column">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid">
      <!--begin::Tab content-->
      <div class="tab-content" id="myTabContent">
        <router-view />
      </div>
      <!--end::Tab content-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Site Management Layout-->
</template>

<script setup lang="ts">
defineOptions({
  name: "SiteComponent",
});

// This component serves as a layout wrapper for site management
// Child routes will be rendered in the router-view
</script>
