<template>
  <!--begin::Site Management Layout-->
  <div class="flex flex-col">
    <router-view />
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
