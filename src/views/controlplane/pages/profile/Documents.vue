<template>
  <!--begin::Documents toolbar-->
  <div class="flex flex-wrap items-center justify-between mb-6">
    <!--begin::Title-->
    <h3 class="my-2 font-bold">
      My Documents
      <span class="ml-1 text-sm font-semibold text-gray-500">100+ resources</span>
    </h3>
    <!--end::Title-->

    <!--begin::Controls-->
    <div class="my-2 flex">
      <!--begin::Search-->
      <div class="relative mr-4 flex items-center">
        <KTIcon
          icon-name="magnifier"
          icon-class="fs-3 position-absolute ms-3"
        />
        <input
          type="text"
          id="kt_filter_search"
          :class="[formInputClass, 'w-[150px] pl-9 py-1 text-xs']"
          placeholder="Search"
        />
      </div>
      <!--end::Search-->

      <a
        href="#"
        class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-active"
        title="Coming soon"
      >
        File Manager
      </a>
    </div>
    <!--end::Controls-->
  </div>
  <!--end::Documents toolbar-->

  <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:mb-9 xl:grid-cols-5 xl:gap-9">
    <KTFolder folder-name="Finance" files="7"></KTFolder>

    <KTFolder folder-name="Customers" files="3"></KTFolder>

    <KTFolder folder-name="CRM Project" files="25"></KTFolder>
  </div>

  <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:mb-9 xl:grid-cols-5 xl:gap-9">
    <KTFile
      file-title="Project Reqs.."
      file-type="pdf"
      created-at="3 days ago"
    ></KTFile>

    <KTFile
      file-title="CRM App Docs.."
      file-type="doc"
      created-at="3 days ago"
    ></KTFile>

    <KTFile
      file-title="User CRUD Styles"
      file-type="css"
      created-at="4 days ago"
    ></KTFile>

    <KTFile
      file-title="Somba Logo"
      file-type="ai"
      created-at="5 days ago"
    ></KTFile>

    <KTFile
      file-title="Orders backup"
      file-type="sql"
      created-at="1 week ago"
    ></KTFile>
  </div>

  <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:mb-9 xl:grid-cols-5 xl:gap-9">
    <KTFile
      file-title="UTAIR CRM API Co.."
      file-type="xml"
      created-at="2 weeks ago"
    ></KTFile>

    <KTFile
      file-title="Tower Hill App.."
      file-type="tif"
      created-at="3 weeks ago"
    ></KTFile>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTFolder from "@/components/files/Folder.vue";
import KTFile from "@/components/files/File.vue";
import { formInputClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "profile-documents",
  components: {
    KTFolder,
    KTFile,
  },
  setup() {
    return {
      getAssetPath,
      formInputClass,
    };
  },
});
</script>
