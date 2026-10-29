<template>
  <!--begin::Campaigns toolbar-->
  <div class="flex flex-wrap items-center justify-between my-5">
    <!--begin::Title-->
    <h2 class="my-2 font-semibold">
      Campaigns
      <span class="ml-1 text-lg text-gray-500">30 Days</span>
    </h2>
    <!--end::Title-->

    <!--begin::Controls-->
    <div class="my-2 flex items-center">
      <!--begin::Select wrapper-->
      <div class="mr-5 w-[100px]">
        <!--begin::Select-->
        <select name="status" :class="[formInputClass, 'py-1 text-xs']">
          <option value="1" selected>30 Days</option>
          <option value="2">90 Days</option>
          <option value="3">6 Months</option>
          <option value="4">1 Year</option>
        </select>
        <!--end::Select-->
      </div>
      <!--end::Select wrapper-->

      <button
        class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-active"
        title="Coming soon"
      >
        Plan Campaigns
      </button>
    </div>
    <!--end::Controls-->
  </div>
  <!--end::Campaigns toolbar-->
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-9">
    <Card2
      card-classes="h-full"
      title="Twitch Posts"
      :icon="getAssetPath('media/svg/brand-logos/twitch.svg')"
      content="$500.00"
      color="success"
      arrow="arrow-up-right"
      footer-data="+40.5%"
      footer-text="more impressions"
      indicator-value="0.5%"
      indicator-label="MRR"
    ></Card2>
    <Card2
      card-classes="h-full"
      title="Twitter Followers"
      :icon="getAssetPath('media/svg/brand-logos/twitter.svg')"
      content="807k"
      color="success"
      arrow="arrow-up-right"
      footer-data="+17.62%"
      footer-text="Followers growth"
      indicator-label="New trials"
      indicator-value="5%"
    ></Card2>
    <Card2
      card-classes="h-full"
      title="Spotify Listeners"
      :icon="getAssetPath('media/svg/brand-logos/spotify.svg')"
      content="1,073"
      color="danger"
      arrow="arrow-down-right"
      footer-data="+10.45%"
      footer-text="Less comments than usual"
      indicator-label="Impressions"
      indicator-value="40%"
    ></Card2>
    <Card2
      card-classes="h-full"
      title="Pinterest Posts"
      :icon="getAssetPath('media/svg/brand-logos/pinterest-p.svg')"
      content="97"
      color="success"
      arrow="arrow-up-right"
      footer-data="+26.1%"
      footer-text="More posts"
      indicator-label="Spend"
      indicator-value="10%"
    ></Card2>
    <Card2
      card-classes="h-full"
      title="Github Contributes"
      :icon="getAssetPath('media/svg/brand-logos/github.svg')"
      content="4,109"
      color="danger"
      arrow="arrow-down-right"
      footer-data="+32.8%"
      footer-text="Less contributions"
      indicator-label="Dispute"
      indicator-value="40%"
    ></Card2>
    <Card2
      card-classes="h-full"
      title="Youtube Subscribers"
      :icon="getAssetPath('media/svg/brand-logos/youtube-3.svg')"
      content="354"
      color="success"
      arrow="arrow-up-right"
      footer-data="+29.45%"
      footer-text="Subscribers growth"
      indicator-label="Subscribers"
      indicator-value="40%"
    ></Card2>
    <Card2
      card-classes="h-full"
      title="Telegram Posts"
      :icon="getAssetPath('media/svg/brand-logos/telegram.svg')"
      content="566"
      color="success"
      arrow="arrow-up-right"
      footer-data="+11.4%"
      footer-text="more clicks"
      indicator-label="Profit"
      indicator-value="40%"
    ></Card2>
    <Card2
      card-classes="h-full"
      title="Reddit Awards"
      :icon="getAssetPath('media/svg/brand-logos/reddit.svg')"
      content="2.1M"
      color="success"
      arrow="arrow-down-right"
      footer-data="-46.7%"
      footer-text="more adds"
      indicator-label="Retention"
      indicator-value="0.0%"
    ></Card2>
  </div>

  <!--begin::Pagination-->
  <div class="flex flex-wrap items-center justify-between pt-10">
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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Card2 from "@/components/cards/Card2.vue";
import { formInputClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "profile-campaigns",
  components: {
    Card2,
  },
  setup() {
    return {
      getAssetPath,
      formInputClass,
    };
  },
});
</script>
