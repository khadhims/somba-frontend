<template>
  <!--begin::Followers toolbar-->
  <div class="flex flex-wrap items-center justify-between mb-6">
    <!--begin::Title-->
    <h3 class="my-2 font-bold">
      My Connections
      <span class="ml-1 text-sm font-semibold text-gray-500">(29)</span>
    </h3>
    <!--end::Title-->

    <!--begin::Controls-->
    <div class="my-2 flex">
      <!--begin::Select-->
      <select
        name="status"
        :class="[formInputClass, 'w-[125px] py-1 text-xs']"
      >
        <option value="Active" selected>Active</option>
        <option value="Approved">In Progress</option>
        <option value="Declined">To Do</option>
        <option value="In Progress">Completed</option>
      </select>
      <!--end::Select-->
    </div>
    <!--end::Controls-->
  </div>
  <!--end::Followers toolbar-->

  <!--begin::Row-->
  <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3 xl:mb-9 xl:gap-9">
    <!--begin::Followers-->
    <Card3
      name="Patric Watson"
      position="Art Director at Novica Co."
      :online="true"
      :avatar="getAssetPath('media/avatars/300-11.jpg')"
      :connected="true"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Olivia Larson"
      position="Art Director at Seal Inc."
      :online="false"
      :avatar="getAssetPath('media/avatars/300-6.jpg')"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Adam Williams"
      position="System Arcitect at Wolto Co."
      :online="true"
      initials="A"
      color="warning"
      :connected="true"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Paul Marcus"
      position="Art Director at Novica Co."
      :online="true"
      initials="P"
      color="primary"
      :connected="true"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Neil Owen"
      position="Accountant at Numbers Co."
      :online="false"
      initials="N"
      color="success"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Sean Paul"
      position="Developer at Loop Inc"
      :online="true"
      initials="S"
      color="info"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Kitona Johnson"
      position="Web Designer at Nextop Ltd."
      :online="false"
      :avatar="getAssetPath('media/avatars/300-1.jpg')"
      :connected="true"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Robert Doe"
      position="Marketing Analytic at Avito Ltd."
      :online="false"
      :avatar="getAssetPath('media/avatars/300-14.jpg')"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Soul Jacob"
      position="Art Director at Novica Co."
      :online="false"
      :avatar="getAssetPath('media/avatars/300-12.jpg')"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Nina Strong"
      position="CTO at Kilp Ltd."
      :online="true"
      :avatar="getAssetPath('media/avatars/300-7.jpg')"
      :connected="true"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Patric Watson"
      position="Art Director at Novica Co."
      :online="true"
      :avatar="getAssetPath('media/avatars/300-11.jpg')"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>

    <Card3
      name="Olivia Larson"
      position="Art Director at Seal Inc."
      :online="false"
      :avatar="getAssetPath('media/avatars/300-6.jpg')"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card3>
    <!--end::Followers-->
  </div>
  <!--end::Row-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Card3 from "@/components/cards/Card3.vue";
import { formInputClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "profile-connections",
  components: {
    Card3,
  },
  setup() {
    return {
      getAssetPath,
      formInputClass,
    };
  },
});
</script>
