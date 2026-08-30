<template>
  <!--begin::Navbar-->
  <div class="mb-5 rounded-lg bg-white dark:bg-gray-900">
    <div class="px-9 pb-0 pt-9">
      <!--begin::Details-->
      <div class="mb-3 flex flex-wrap sm:flex-nowrap">
        <!--begin: Pic-->
        <div class="mb-4 mr-7">
          <div class="relative h-[100px] w-[100px] lg:h-[160px] lg:w-[160px]">
            <img
              :src="getAssetPath('media/avatars/300-1.jpg')"
              alt="image"
              class="h-full w-full rounded-md object-cover"
            />
            <div
              class="absolute bottom-0 right-0 h-5 w-5 -translate-y-1/4 translate-x-1/4 rounded-full border-4 border-white bg-success dark:border-gray-900"
            ></div>
          </div>
        </div>
        <!--end::Pic-->

        <!--begin::Info-->
        <div class="flex-grow">
          <!--begin::Title-->
          <div class="mb-2 flex flex-wrap items-start justify-between">
            <!--begin::User-->
            <div class="flex flex-col">
              <!--begin::Name-->
              <div class="mb-2 flex items-center">
                <a
                  href="#"
                  class="mr-1 text-2xl font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
                  >Max Smith</a
                >
                <a href="#">
                  <KTIcon icon-name="verify" icon-class="fs-1 text-primary" />
                </a>
              </div>
              <!--end::Name-->

              <!--begin::Info-->
              <div class="mb-4 flex flex-wrap text-sm font-semibold">
                <a
                  href="#"
                  class="mb-2 mr-5 flex items-center text-gray-500 transition-colors hover:text-primary"
                >
                  <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                  Developer
                </a>
                <a
                  href="#"
                  class="mb-2 mr-5 flex items-center text-gray-500 transition-colors hover:text-primary"
                >
                  <KTIcon icon-name="geolocation" icon-class="fs-4 me-1" />
                  SF, Bay Area
                </a>
                <a
                  href="#"
                  class="mb-2 flex items-center text-gray-500 transition-colors hover:text-primary"
                >
                  <KTIcon icon-name="sms" icon-class="fs-4 me-1" />
                  max@kt.com
                </a>
              </div>
              <!--end::Info-->
            </div>
            <!--end::User-->

            <!--begin::Actions-->
            <div class="my-4 flex">
              <a
                href="#"
                class="mr-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                id="kt_user_follow_button"
              >
                Follow
              </a>

              <!-- ponytail: original targeted a modal id (#kt_modal_offer_a_deal)
              with no matching modal anywhere in the app - already a dead
              link before this migration, left inert. -->
              <a
                href="#"
                class="mr-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
                >Hire Me</a
              >

              <!--begin::Menu-->
              <div class="relative" :ref="(el) => (menuDropdown.containerRef.value = el as HTMLElement | null)">
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition-colors hover:text-primary dark:bg-gray-800"
                  @click="menuDropdown.toggle"
                >
                  <KTIcon icon-name="dots-horizontal" icon-class="fs-3" />
                </button>
                <div v-show="menuDropdown.isOpen.value" class="absolute right-0 top-full z-20 mt-2">
                  <Dropdown3 @close="menuDropdown.close"></Dropdown3>
                </div>
              </div>
              <!--end::Menu-->
            </div>
            <!--end::Actions-->
          </div>
          <!--end::Title-->

          <!--begin::Stats-->
          <div class="flex flex-wrap items-center justify-between">
            <!--begin::Wrapper-->
            <div class="flex flex-grow flex-col pr-8">
              <!--begin::Stats-->
              <div class="flex flex-wrap">
                <!--begin::Stat-->
                <div
                  class="mb-3 mr-6 min-w-[125px] rounded border border-dashed border-gray-300 px-4 py-3 dark:border-gray-700"
                >
                  <!--begin::Number-->
                  <div class="flex items-center">
                    <KTIcon
                      icon-name="arrow-up"
                      icon-class="fs-3 text-success me-2"
                    />
                    <div class="text-2xl font-bold">4,500$</div>
                  </div>
                  <!--end::Number-->

                  <!--begin::Label-->
                  <div class="text-sm font-semibold text-gray-500">
                    Earnings
                  </div>
                  <!--end::Label-->
                </div>
                <!--end::Stat-->

                <!--begin::Stat-->
                <div
                  class="mb-3 mr-6 min-w-[125px] rounded border border-dashed border-gray-300 px-4 py-3 dark:border-gray-700"
                >
                  <!--begin::Number-->
                  <div class="flex items-center">
                    <KTIcon
                      icon-name="arrow-down"
                      icon-class="fs-3 text-danger me-2"
                    />
                    <div class="text-2xl font-bold">75</div>
                  </div>
                  <!--end::Number-->

                  <!--begin::Label-->
                  <div class="text-sm font-semibold text-gray-500">
                    Projects
                  </div>
                  <!--end::Label-->
                </div>
                <!--end::Stat-->

                <!--begin::Stat-->
                <div
                  class="mb-3 mr-6 min-w-[125px] rounded border border-dashed border-gray-300 px-4 py-3 dark:border-gray-700"
                >
                  <!--begin::Number-->
                  <div class="flex items-center">
                    <KTIcon
                      icon-name="arrow-up"
                      icon-class="fs-3 text-success me-2"
                    />
                    <div class="text-2xl font-bold">60%</div>
                  </div>
                  <!--end::Number-->

                  <!--begin::Label-->
                  <div class="text-sm font-semibold text-gray-500">
                    Success Rate
                  </div>
                  <!--end::Label-->
                </div>
                <!--end::Stat-->
              </div>
              <!--end::Stats-->
            </div>
            <!--end::Wrapper-->

            <!--begin::Progress-->
            <div class="mt-3 flex w-[200px] flex-col items-center sm:w-[300px]">
              <div class="mb-2 mt-auto flex w-full justify-between">
                <span class="text-sm font-semibold text-gray-500"
                  >Profile Compleation</span
                >
                <span class="text-sm font-bold">50%</span>
              </div>

              <div class="mb-3 h-[5px] w-full rounded bg-gray-100 dark:bg-gray-800">
                <div class="h-[5px] w-1/2 rounded bg-success"></div>
              </div>
            </div>
            <!--end::Progress-->
          </div>
          <!--end::Stats-->
        </div>
        <!--end::Info-->
      </div>
      <!--end::Details-->

      <!--begin::Navs-->
      <div class="flex h-[55px] overflow-auto">
        <ul class="flex flex-nowrap gap-6 text-base font-bold">
          <!--begin::Nav item-->
          <li>
            <router-link
              to="/controlplane/pages/profile/overview"
              class="inline-block border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
              active-class="!border-primary !text-primary"
            >
              Overview
            </router-link>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li>
            <router-link
              to="/controlplane/pages/profile/projects"
              class="inline-block border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
              active-class="!border-primary !text-primary"
            >
              Projects
            </router-link>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li>
            <router-link
              to="/controlplane/pages/profile/campaigns"
              class="inline-block border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
              active-class="!border-primary !text-primary"
            >
              Campaigns
            </router-link>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li>
            <router-link
              to="/controlplane/pages/profile/documents"
              class="inline-block border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
              active-class="!border-primary !text-primary"
            >
              Documents
            </router-link>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li>
            <router-link
              to="/controlplane/pages/profile/connections"
              class="inline-block border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
              active-class="!border-primary !text-primary"
            >
              Connections
            </router-link>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li>
            <router-link
              to="/controlplane/pages/profile/activity"
              class="inline-block border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
              active-class="!border-primary !text-primary"
            >
              Activity
            </router-link>
          </li>
          <!--end::Nav item-->
        </ul>
      </div>
      <!--begin::Navs-->
    </div>
  </div>
  <!--end::Navbar-->
  <router-view></router-view>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { useDropdown } from "@/composables/useDropdown";

export default defineComponent({
  name: "profile-page-layout",
  components: {
    Dropdown3,
  },
  setup() {
    const menuDropdown = useDropdown();
    return {
      getAssetPath,
      menuDropdown,
    };
  },
});
</script>
