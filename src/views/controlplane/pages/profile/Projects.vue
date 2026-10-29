<template>
  <!--begin::Toolbar-->
  <div class="flex flex-wrap items-center justify-between my-5">
    <!--begin::Heading-->
    <h2 class="my-2 text-2xl font-semibold">
      Projects
      <span class="ml-1 text-sm text-gray-500">by Status</span>
    </h2>
    <!--end::Heading-->

    <!--begin::Controls-->
    <div class="my-1 flex flex-wrap">
      <!--begin::Select wrapper-->
      <div class="m-0">
        <!--begin::Select-->
        <select
          name="status"
          :class="[formInputClass, 'w-[125px] py-1 text-xs font-bold']"
        >
          <option value="Active" selected>Active</option>
          <option value="Approved">In Progress</option>
          <option value="Declined">To Do</option>
          <option value="In Progress">Completed</option>
        </select>
        <!--end::Select-->
      </div>
      <!--end::Select wrapper-->
    </div>
    <!--end::Controls-->
  </div>
  <!--end::Toolbar-->

  <!--begin::Row-->
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-9">
    <!--begin::Col-->
    <div>
      <KTCard
        :progress="50"
        title="Fitnes App"
        :icon="getAssetPath('media/svg/brand-logos/plurk.svg')"
        :users="users1"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="Pending"
        status-variant="secondary"
        :progress="30"
        :icon="getAssetPath('media/svg/brand-logos/disqus.svg')"
        title="Leaf CRM"
        date="May 10, 2021"
        budget="$36,400.00"
        :users="users2"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="Completed"
        status-variant="success"
        :progress="100"
        :icon="getAssetPath('media/svg/brand-logos/figma-1.svg')"
        title="Atica Banking"
        date="Mar 14, 2021"
        budget="$605,100.00"
        :users="users3"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="Pending"
        :progress="60"
        status-variant="secondary"
        :icon="getAssetPath('media/svg/brand-logos/sentry-3.svg')"
        title="Finance Dispatch"
        budget="$36,400.00"
        :users="users4"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="In Progress"
        :progress="40"
        :icon="getAssetPath('media/svg/brand-logos/xing-icon.svg')"
        title="9 Degree"
        date="May 10, 2021"
        budget="$36,400.00"
        :users="users5"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="In Progress"
        :progress="70"
        :icon="getAssetPath('media/svg/brand-logos/tvit.svg')"
        title="GoPro App"
        date="May 10, 2021"
        budget="$36,400.00"
        :users="users6"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="In Progress"
        :progress="30"
        :icon="getAssetPath('media/svg/brand-logos/aven.svg')"
        title="Buldozer CRM"
        date="May 10, 2021"
        budget="$36,400.00"
        :users="users7"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="Overdue"
        :progress="10"
        status-variant="danger"
        :icon="getAssetPath('media/svg/brand-logos/treva.svg')"
        title="Aviasales App"
        date="May 10, 2021"
        budget="$36,400.00"
        :users="users8"
      ></KTCard>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div>
      <KTCard
        status="Completed"
        :progress="100"
        status-variant="success"
        :icon="getAssetPath('media/svg/brand-logos/kanba.svg')"
        title="Oppo CRM"
        date="May 10, 2021"
        budget="$36,400.00"
        :users="users9"
      ></KTCard>
    </div>
    <!--end::Row-->

    <!--begin::Pagination-->
    <div
      class="col-span-full flex flex-wrap items-center justify-between pt-10"
    >
      <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Showing 1 to 10 of 50 entries
      </div>

      <!--begin::Pages-->
      <ul class="flex items-center gap-1">
        <li>
          <a
            href="#"
            class="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >‹</a
          >
        </li>
        <li v-for="p in 6" :key="p">
          <a
            href="#"
            class="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors"
            :class="
              p === 1
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            "
            >{{ p }}</a
          >
        </li>
        <li>
          <a
            href="#"
            class="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >›</a
          >
        </li>
      </ul>
      <!--end::Pages-->
    </div>
    <!--end::Pagination-->
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTCard from "@/components/cards/Card1.vue";
import { formInputClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "profile-projects",
  components: {
    KTCard,
  },
  setup() {
    const users1 = [
      { name: "Emma Smith", src: getAssetPath("media/avatars/300-6.jpg") },
      { name: "Rudy Stone", src: getAssetPath("media/avatars/300-1.jpg") },
      { name: "Susan Redwood", initials: "S", state: "primary" },
    ];

    const users2 = [
      { name: "Alan Warden", initials: "A", state: "warning" },
      { name: "Brian Cox", src: getAssetPath("media/avatars/300-5.jpg") },
    ];

    const users3 = [
      { name: "Mad Masy", src: getAssetPath("media/avatars/300-6.jpg") },
      { name: "Cris Willson", src: getAssetPath("media/avatars/300-1.jpg") },
      { name: "Mike Garcie", initials: "M", state: "info" },
    ];

    const users4 = [
      { name: "Nich Warden", initials: "N", state: "warning" },
      { name: "Rob Otto", initials: "R", state: "success" },
    ];

    const users5 = [
      {
        name: "Francis Mitcham",
        src: getAssetPath("media/avatars/300-20.jpg"),
      },
      {
        name: "Michelle Swanston",
        src: getAssetPath("media/avatars/300-7.jpg"),
      },
      { name: "Susan Redwood", initials: "S", state: "primary" },
    ];

    const users6 = [
      { name: "Emma Smith", src: getAssetPath("media/avatars/300-6.jpg") },
      { name: "Rudy Stone", src: getAssetPath("media/avatars/300-1.jpg") },
      { name: "Susan Redwood", initials: "S", state: "primary" },
    ];

    const users7 = [
      { name: "Meloday Macy", src: getAssetPath("media/avatars/300-2.jpg") },
      { name: "Rabbin Watterman", initials: "S", state: "success" },
    ];

    const users8 = [
      { name: "Emma Smith", src: getAssetPath("media/avatars/300-6.jpg") },
      { name: "Rudy Stone", src: getAssetPath("media/avatars/300-1.jpg") },
      { name: "Susan Redwood", initials: "S", state: "primary" },
    ];

    const users9 = [
      { name: "Meloday Macy", src: getAssetPath("media/avatars/300-2.jpg") },
      { name: "Rabbin Watterman", initials: "S", state: "danger" },
    ];

    return {
      users1,
      users2,
      users3,
      users4,
      users5,
      users6,
      users7,
      users8,
      users9,
      getAssetPath,
      formInputClass,
    };
  },
});
</script>
