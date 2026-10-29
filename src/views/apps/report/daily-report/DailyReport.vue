<template>
  <!--begin::Report Harian Overview-->
  <div class="mb-5 p-4" :class="cardClass">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h4 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">Report Harian Dapur Makassar</h4>
        <p class="m-0 text-gray-500">
          Laporan distribusi makanan area Pantai Losari &amp; sekitarnya
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-end gap-2">
        <!-- Date Filter -->
        <div class="flex items-center">
          <label class="mr-2 mb-0 font-semibold text-gray-700 dark:text-gray-300">Filter Tanggal:</label>
          <input
            type="date"
            v-model="filterDate"
            @change="onDateFilterChange"
            class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <!-- Settings Target Button -->
        <button
          @click="openTargetModal"
          title="Atur Target"
          class="inline-flex items-center gap-1 rounded-md bg-warning-light px-3 py-2 text-sm font-semibold text-warning transition-colors hover:bg-warning hover:text-white active:scale-[0.98]"
        >
          <i class="ki-duotone ki-abstract-26 fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Target
        </button>
        <!-- Add New Report Button -->
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98]"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Tambah Report
        </button>
      </div>
    </div>
  </div>

  <!--begin::Statistics Cards-->
  <div class="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <!--begin::Col - Total Report Hari Ini-->
    <div :class="cardClass">
      <div class="p-6">
        <div class="flex items-center">
          <div class="mr-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary-light">
            <i class="ki-duotone ki-calendar-tick fs-2x text-primary">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
          <div class="flex-1">
            <span class="block text-sm font-semibold text-gray-400">Report Hari Ini</span>
            <span class="block text-2xl font-bold tabular-nums text-gray-800 dark:text-gray-100">{{ todayReportCount }}</span>
          </div>
        </div>
        <div class="mt-5 h-1.5 rounded-full bg-primary-light">
          <div
            class="h-full rounded-full bg-primary"
            role="progressbar"
            :style="`width: ${todayReportPercentage}%`"
          ></div>
        </div>
        <span class="mt-2 block text-sm font-semibold text-gray-400">
          {{ todayReportPercentage }}% dari target harian
        </span>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col - Total Porsi-->
    <div :class="cardClass">
      <div class="p-6">
        <div class="flex items-center">
          <div class="mr-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-success-light">
            <i class="ki-duotone ki-chart-simple fs-2x text-success">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
            </i>
          </div>
          <div class="flex-1">
            <span class="block text-sm font-semibold text-gray-400">Total Porsi</span>
            <span class="block text-2xl font-bold tabular-nums text-gray-800 dark:text-gray-100">{{ totalPorsiToday }}</span>
          </div>
        </div>
        <div class="mt-5 h-1.5 rounded-full bg-success-light">
          <div class="h-full w-full rounded-full bg-success" role="progressbar"></div>
        </div>
        <span class="mt-2 block text-sm font-semibold text-gray-400">
          Porsi didistribusikan hari ini
        </span>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col - Sekolah Dilayani-->
    <div :class="cardClass">
      <div class="p-6">
        <div class="flex items-center">
          <div class="mr-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-warning-light">
            <i class="ki-duotone ki-home-2 fs-2x text-warning">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
          <div class="flex-1">
            <span class="block text-sm font-semibold text-gray-400">Sekolah Dilayani</span>
            <span class="block text-2xl font-bold tabular-nums text-gray-800 dark:text-gray-100">{{ uniqueSchoolsToday }}</span>
          </div>
        </div>
        <div class="mt-5 h-1.5 rounded-full bg-warning-light">
          <div
            class="h-full rounded-full bg-warning"
            role="progressbar"
            :style="`width: ${schoolPercentage}%`"
          ></div>
        </div>
        <span class="mt-2 block text-sm font-semibold text-gray-400">
          Dari {{ totalSchoolsTarget }} sekolah target
        </span>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col - Driver Aktif-->
    <div :class="cardClass">
      <div class="p-6">
        <div class="flex items-center">
          <div class="mr-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-info-light">
            <i class="ki-duotone ki-profile-user fs-2x text-info">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
            </i>
          </div>
          <div class="flex-1">
            <span class="block text-sm font-semibold text-gray-400">Driver Aktif</span>
            <span class="block text-2xl font-bold tabular-nums text-gray-800 dark:text-gray-100">{{ uniqueDriversToday }}</span>
          </div>
        </div>
        <div class="mt-5 h-1.5 rounded-full bg-info-light">
          <div
            class="h-full rounded-full bg-info"
            role="progressbar"
            :style="`width: ${driverPercentage}%`"
          ></div>
        </div>
        <span class="mt-2 block text-sm font-semibold text-gray-400">
          Driver bertugas hari ini
        </span>
      </div>
    </div>
    <!--end::Col-->
  </div>
  <!--end::Statistics Cards-->

  <!--begin::Report List-->
  <div :class="cardClass">
    <!--begin::Card header-->
    <div class="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
      <h3 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">Daftar Report Harian</h3>

      <div class="flex flex-wrap items-center gap-3">
        <!--begin::Items per page-->
        <div class="flex items-center">
          <label class="mr-2 mb-0 text-sm font-semibold text-gray-700 dark:text-gray-300">Items per page</label>
          <select
            v-model.number="itemsPerPage"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm tabular-nums transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
        <!--end::Items per page-->

        <!--begin::Search-->
        <div class="relative flex items-center">
          <i class="ki-duotone ki-magnifier fs-3 pointer-events-none absolute left-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search"
            class="w-[200px] rounded-md border border-gray-300 bg-gray-100 py-1.5 pr-3 pl-12 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <!--end::Search-->

        <button
          @click="refreshReports"
          title="Refresh"
          class="flex h-8 w-8 items-center justify-center rounded-md bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.95]"
        >
          <i class="ki-duotone ki-arrows-circle fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
      <KTDataTable
        :data="filteredAndSortedReports"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="itemsPerPage"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        :empty-table-text="'Belum ada data report harian'"
      >
        <template v-slot:tanggal="{ row }">
          <span class="block font-bold tabular-nums text-gray-900 dark:text-gray-100">{{
            row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-'
          }}</span>
        </template>

        <template v-slot:jam="{ row }">
          <span class="font-bold tabular-nums text-gray-900 dark:text-gray-100">
            {{ row.jam || '-' }}
          </span>
        </template>

        <template v-slot:tujuan_sekolah="{ row }">
          <div class="max-w-[200px] min-w-[150px]">
            <span class="font-bold break-all text-gray-900 dark:text-gray-100">
              {{ row.tujuan_sekolah }}
            </span>
          </div>
        </template>

        <template v-slot:driver="{ row }">
          <span class="font-bold text-gray-900 dark:text-gray-100">
            {{ row.driver }}
          </span>
        </template>

        <template v-slot:total_porsi="{ row }">
          <span
            class="inline-flex rounded px-2 py-1 text-sm font-semibold tabular-nums"
            :class="badgeVariantClass('success')"
          >
            {{ row.total_porsi }} porsi
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="flex justify-end gap-1">
            <RowActionButton @click="viewReport(row)" title="View">
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </RowActionButton>
            <RowActionButton @click="editReport(row)" title="Edit">
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton @click="deleteReport(row)" title="Delete" variant="danger">
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </RowActionButton>
          </div>
        </template>
      </KTDataTable>

      <!--begin::Pagination-->
      <div class="mt-4 flex items-center justify-end">
        <Pagination
          :page="currentPage"
          :per-page="itemsPerPage"
          :total-items="totalItems"
          :total-pages="totalPages"
          @page-change="goToPage"
        />
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Report List-->

  <!--begin::Add/Edit Report Dialog-->
  <dialog
    ref="reportDialog"
    class="m-auto w-full max-w-2xl rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="closeModal"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ isEditMode ? 'Edit Report Harian' : 'Tambah Report Harian' }}
      </h3>
      <button
        type="button"
        @click="closeModal"
        aria-label="Close"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="saveReport">
      <div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">Tanggal</label>
          <input type="date" v-model="formData.tanggal" required :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">Jam Kirim</label>
          <input type="time" v-model="formData.jam" required :class="formInputClass" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">Tujuan Sekolah</label>
          <input
            type="text"
            v-model="formData.tujuan_sekolah"
            placeholder="Masukkan nama sekolah tujuan"
            required
            :class="formInputClass"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">Driver</label>
          <input
            type="text"
            v-model="formData.driver"
            placeholder="Masukkan nama driver"
            required
            :class="formInputClass"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">Total Porsi</label>
          <input
            type="number"
            v-model.number="formData.total_porsi"
            placeholder="Masukkan jumlah porsi"
            min="1"
            required
            :class="formInputClass"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Catatan</label>
          <textarea
            v-model="formData.catatan"
            rows="3"
            placeholder="Catatan tambahan (opsional)"
            :class="formInputClass"
          ></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          @click="closeModal"
          :class="secondaryButtonClass"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="isModalLoading"
          class="inline-flex items-center gap-2" :class="primaryButtonClass"
        >
          <span
            v-if="isModalLoading"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          {{ isEditMode ? 'Update' : 'Simpan' }}
        </button>
      </div>
    </form>
  </dialog>
  <!--end::Add/Edit Report Dialog-->
  <!--end::Add/Edit Report Dialog-->

  <!--begin::View Report Dialog-->
  <dialog
    ref="viewReportDialog"
    class="m-auto w-full max-w-2xl rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="closeViewModal"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Detail Report Harian</h3>
      <button
        type="button"
        @click="closeViewModal"
        aria-label="Close"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <div class="p-5" v-if="selectedReport">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div class="mb-4">
            <label class="mb-2 block font-semibold text-gray-500">Tanggal</label>
            <p class="m-0 text-gray-800 dark:text-gray-100">
              {{ selectedReport.tanggal ? new Date(selectedReport.tanggal).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-' }}
            </p>
          </div>
          <div class="mb-4">
            <label class="mb-2 block font-semibold text-gray-500">Jam Kirim</label>
            <p class="m-0 text-gray-800 dark:text-gray-100">{{ selectedReport.jam }}</p>
          </div>
          <div class="mb-4">
            <label class="mb-2 block font-semibold text-gray-500">Driver</label>
            <p class="m-0 text-gray-800 dark:text-gray-100">{{ selectedReport.driver }}</p>
          </div>
        </div>
        <div>
          <div class="mb-4">
            <label class="mb-2 block font-semibold text-gray-500">Tujuan Sekolah</label>
            <p class="m-0 text-gray-800 dark:text-gray-100">{{ selectedReport.tujuan_sekolah }}</p>
          </div>
          <div class="mb-4">
            <label class="mb-2 block font-semibold text-gray-500">Total Porsi</label>
            <p class="m-0">
              <span
                class="inline-flex rounded px-2 py-1 text-sm font-semibold tabular-nums"
                :class="badgeVariantClass('success')"
                >{{ selectedReport.total_porsi }} porsi</span
              >
            </p>
          </div>
        </div>
        <div class="sm:col-span-2" v-if="selectedReport.catatan">
          <div class="rounded-lg bg-info-light p-4">
            <label class="mb-2 block font-semibold text-gray-700">Catatan</label>
            <p class="m-0 text-gray-800" style="white-space: pre-wrap">{{ selectedReport.catatan }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end border-t border-gray-200 p-5 dark:border-gray-700">
      <button
        type="button"
        @click="closeViewModal"
        :class="secondaryButtonClass"
      >
        Tutup
      </button>
    </div>
  </dialog>
  <!--end::View Report Dialog-->

  <!--begin::Target Settings Dialog-->
  <dialog
    ref="targetSettingsDialog"
    class="m-auto w-full max-w-lg rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="closeTargetModal"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h3 class="m-0 flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
        <i class="ki-duotone ki-abstract-26 fs-1 mr-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        Pengaturan Target
      </h3>
      <button
        type="button"
        @click="closeTargetModal"
        aria-label="Close"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <div class="p-5">
      <div class="mb-4 flex items-start gap-4 rounded-lg border border-warning-light bg-warning-light p-4 text-warning">
        <i class="ki-duotone ki-information-5 fs-2hx">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
        <div class="flex flex-col">
          <h5 class="m-0 mb-1 font-semibold">Informasi Target</h5>
          <span>Target digunakan untuk menghitung persentase pencapaian harian pada dashboard.</span>
        </div>
      </div>

      <form @submit.prevent="saveTargetSettings">
        <div class="mb-4">
          <label class="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">
            Target Report Harian
            <i class="ki-duotone ki-information-5 fs-6 text-gray-500" title="Jumlah target report yang harus dibuat per hari">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </label>
          <div class="flex">
            <input
              type="number"
              v-model.number="targetSettings.dailyReportTarget"
              placeholder="Masukkan jumlah target report"
              min="1"
              max="100"
              required
              class="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            <span class="flex shrink-0 items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">report/hari</span>
          </div>
          <div class="mt-1 text-sm text-gray-500">Jumlah report yang ditargetkan dibuat setiap hari</div>
        </div>

        <div class="mb-4">
          <label class="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">
            Target Sekolah
            <i class="ki-duotone ki-information-5 fs-6 text-gray-500" title="Jumlah target sekolah yang harus dilayani per hari">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </label>
          <div class="flex">
            <input
              type="number"
              v-model.number="targetSettings.totalSchoolsTarget"
              placeholder="Masukkan jumlah target sekolah"
              min="1"
              max="100"
              required
              class="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            <span class="flex shrink-0 items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">sekolah/hari</span>
          </div>
          <div class="mt-1 text-sm text-gray-500">Jumlah sekolah yang ditargetkan dilayani setiap hari</div>
        </div>

        <div>
          <div class="my-3 border-t border-dashed border-gray-200 dark:border-gray-700"></div>
          <div class="rounded-lg bg-primary-light p-4">
            <div class="flex items-center">
              <i class="ki-duotone ki-chart-simple-2 fs-2x mr-3 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              <div>
                <h6 class="mb-1 text-primary">Preview Pencapaian Hari Ini</h6>
                <p class="m-0 text-sm text-gray-700">
                  Report: <strong>{{ todayReportCount }}</strong> / {{ targetSettings.dailyReportTarget }}
                  ({{ Math.round((todayReportCount / targetSettings.dailyReportTarget) * 100) }}%)
                </p>
                <p class="m-0 text-sm text-gray-700">
                  Sekolah: <strong>{{ uniqueSchoolsToday }}</strong> / {{ targetSettings.totalSchoolsTarget }}
                  ({{ Math.round((uniqueSchoolsToday / targetSettings.totalSchoolsTarget) * 100) }}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            @click="closeTargetModal"
            :class="secondaryButtonClass"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isTargetModalLoading"
            class="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              v-if="isTargetModalLoading"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            <i v-else class="ki-duotone ki-check fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  </dialog>
  <!--end::Target Settings Dialog-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import RowActionButton from "@/components/common/RowActionButton.vue";
import { formInputClass, badgeVariantClass, cardClass, secondaryButtonClass, primaryButtonClass } from "@/core/helpers/badge";

// Interface definitions
interface ReportHarian {
  uid: string;
  tanggal: string;
  jam: string;
  tujuan_sekolah: string;
  driver: string;
  total_porsi: number;
  catatan?: string;
}

// Reactive data
const reports = ref<ReportHarian[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const sortLabel = ref("tanggal");
const sortOrder = ref<"asc" | "desc">("desc");
const filterDate = ref(new Date().toISOString().split('T')[0]); // Today's date

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

// Constants for targets
const STORAGE_KEY_TARGETS = 'report_harian_targets';

// Load targets from localStorage or use defaults
const loadTargetsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TARGETS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading targets from storage:', error);
  }
  return {
    dailyReportTarget: 15,
    totalSchoolsTarget: 10
  };
};

const totalSchoolsTarget = ref(10); // Target sekolah untuk dilayani
const dailyReportTarget = ref(15); // Target report harian

// Target settings state
const targetSettings = ref(loadTargetsFromStorage());
const isTargetModalLoading = ref(false);
const targetSettingsDialog = ref<HTMLDialogElement | null>(null);

// Modal state
const reportDialog = ref<HTMLDialogElement | null>(null);
const viewReportDialog = ref<HTMLDialogElement | null>(null);
const selectedReport = ref<ReportHarian | null>(null);
const isEditMode = ref(false);
const isModalLoading = ref(false);
const formData = ref<Partial<ReportHarian>>({
  tanggal: '',
  jam: '',
  tujuan_sekolah: '',
  driver: '',
  total_porsi: 0,
  catatan: ''
});

// Date filter handler
const onDateFilterChange = () => {
  fetchReports();
};

// Target modal handlers
const openTargetModal = () => {
  // Load current values
  targetSettings.value = {
    dailyReportTarget: dailyReportTarget.value,
    totalSchoolsTarget: totalSchoolsTarget.value
  };

  targetSettingsDialog.value?.showModal();
};

const closeTargetModal = () => {
  targetSettingsDialog.value?.close();
};

const saveTargetSettings = async () => {
  try {
    isTargetModalLoading.value = true;
    
    // Update reactive values
    dailyReportTarget.value = targetSettings.value.dailyReportTarget;
    totalSchoolsTarget.value = targetSettings.value.totalSchoolsTarget;
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY_TARGETS, JSON.stringify(targetSettings.value));
    
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Pengaturan target berhasil disimpan',
      timer: 2000,
      showConfirmButton: false
    });
    
    closeTargetModal();
  } catch (error) {
    console.error('Error saving target settings:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan saat menyimpan pengaturan target'
    });
  } finally {
    isTargetModalLoading.value = false;
  }
};


// Computed properties for statistics
const todayReportCount = computed(() => {
  const today = filterDate.value;
  return reports.value.filter(r => r.tanggal === today).length;
});

const totalPorsiToday = computed(() => {
  const today = filterDate.value;
  return reports.value
    .filter(r => r.tanggal === today)
    .reduce((sum, r) => sum + r.total_porsi, 0);
});

const uniqueSchoolsToday = computed(() => {
  const today = filterDate.value;
  const schools = new Set(
    reports.value
      .filter(r => r.tanggal === today)
      .map(r => r.tujuan_sekolah)
  );
  return schools.size;
});

const uniqueDriversToday = computed(() => {
  const today = filterDate.value;
  const drivers = new Set(
    reports.value
      .filter(r => r.tanggal === today)
      .map(r => r.driver)
  );
  return drivers.size;
});

const todayReportPercentage = computed(() => {
  const target = dailyReportTarget.value;
  return target > 0 ? Math.min(Math.round((todayReportCount.value / target) * 100), 100) : 0;
});

const schoolPercentage = computed(() => {
  const target = totalSchoolsTarget.value;
  return target > 0 ? Math.min(Math.round((uniqueSchoolsToday.value / target) * 100), 100) : 0;
});

const driverPercentage = computed(() => {
  // Assume we have 5 max drivers per day
  const maxDrivers = 5;
  return Math.min(Math.round((uniqueDriversToday.value / maxDrivers) * 100), 100);
});


// Pagination handlers
const goToPage = (page: number) => {
  currentPage.value = page;
  fetchReports();
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchReports();
});

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: 'Tanggal',
    columnLabel: 'tanggal',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: 'Jam Kirim',
    columnLabel: 'jam',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: 'Tujuan Sekolah',
    columnLabel: 'tujuan_sekolah',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: 'Driver',
    columnLabel: 'driver',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: 'Total Porsi',
    columnLabel: 'total_porsi',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: 'Actions',
    columnLabel: 'actions',
    sortEnabled: false,
    searchable: false,
  },
]);

// Fetch reports from API
const fetchReports = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API endpoint
    // const resp = await ApiService.query('report-harian', {
    //   params: {
    //     page: currentPage.value,
    //     per_page: itemsPerPage.value
    //   }
    // });
    
    // Mock data for development - Lokasi sekitar Rumah Makan Laelae Makassar
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
    
    const mockData: ReportHarian[] = [
      // Today's reports - Area Pantai Losari & sekitarnya
      {
        uid: '1',
        tanggal: today,
        jam: '06:00',
        tujuan_sekolah: 'SDN Inp. Gunung Sari Makassar',
        driver: 'Andi Mappasessu',
        total_porsi: 280,
        catatan: 'Pengiriman lancar, tepat waktu'
      },
      {
        uid: '2',
        tanggal: today,
        jam: '06:30',
        tujuan_sekolah: 'SDN Mangkura Makassar',
        driver: 'Arief Daeng Tompo',
        total_porsi: 320,
        catatan: 'Dekat area Pantai Losari'
      },
      {
        uid: '3',
        tanggal: today,
        jam: '07:00',
        tujuan_sekolah: 'SDN Lajangiru Makassar',
        driver: 'Nurhayati Daeng Sarro',
        total_porsi: 250,
        catatan: ''
      },
      {
        uid: '4',
        tanggal: today,
        jam: '07:15',
        tujuan_sekolah: 'SDN Baji Pamai Makassar',
        driver: 'Andi Mappasessu',
        total_porsi: 290,
        catatan: 'Pengiriman kedua, area dekat Fort Rotterdam'
      },
      {
        uid: '5',
        tanggal: today,
        jam: '07:30',
        tujuan_sekolah: 'SDN Cambaya Makassar',
        driver: 'Muhammad Rivai',
        total_porsi: 310,
        catatan: 'Dekat Jalan Metro Tanjung Bunga'
      },
      {
        uid: '6',
        tanggal: today,
        jam: '07:45',
        tujuan_sekolah: 'SDN Tanjung Merdeka Makassar',
        driver: 'Nurhayati Daeng Sarro',
        total_porsi: 270,
        catatan: 'Area pelabuhan'
      },
      // Yesterday's reports
      {
        uid: '7',
        tanggal: yesterday,
        jam: '06:00',
        tujuan_sekolah: 'SDN Inp. Gunung Sari Makassar',
        driver: 'Arief Daeng Tompo',
        total_porsi: 275,
        catatan: ''
      },
      {
        uid: '8',
        tanggal: yesterday,
        jam: '06:30',
        tujuan_sekolah: 'SDN Mangkura Makassar',
        driver: 'Andi Mappasessu',
        total_porsi: 315,
        catatan: ''
      },
      {
        uid: '9',
        tanggal: yesterday,
        jam: '07:00',
        tujuan_sekolah: 'SDN Lajangiru Makassar',
        driver: 'Muhammad Rivai',
        total_porsi: 245,
        catatan: 'Terlambat 10 menit karena hujan'
      },
      {
        uid: '10',
        tanggal: yesterday,
        jam: '07:30',
        tujuan_sekolah: 'SDN Cambaya Makassar',
        driver: 'Nurhayati Daeng Sarro',
        total_porsi: 305,
        catatan: ''
      },
      // Two days ago
      {
        uid: '11',
        tanggal: twoDaysAgo,
        jam: '06:00',
        tujuan_sekolah: 'SDN Inp. Gunung Sari Makassar',
        driver: 'Muhammad Rivai',
        total_porsi: 270,
        catatan: ''
      },
      {
        uid: '12',
        tanggal: twoDaysAgo,
        jam: '06:45',
        tujuan_sekolah: 'SDN Baji Pamai Makassar',
        driver: 'Arief Daeng Tompo',
        total_porsi: 285,
        catatan: 'Pengiriman lancar'
      },
      {
        uid: '13',
        tanggal: twoDaysAgo,
        jam: '07:15',
        tujuan_sekolah: 'SDN Tanjung Merdeka Makassar',
        driver: 'Andi Mappasessu',
        total_porsi: 265,
        catatan: ''
      }
    ];
    
    reports.value = mockData;
    totalItems.value = mockData.length;
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
    
  } catch (error) {
    console.error("Error fetching reports:", error);
    reports.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

// Computed properties
const filteredAndSortedReports = computed(() => {
  let filtered = reports.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((report) => {
      const tujuan = (report.tujuan_sekolah || '').toLowerCase();
      const driver = (report.driver || '').toLowerCase();
      const catatan = (report.catatan || '').toLowerCase();

      return (
        tujuan.includes(query) ||
        driver.includes(query) ||
        catatan.includes(query)
      );
    });
  }

  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[sortLabel.value as keyof ReportHarian];
      let bValue: any = b[sortLabel.value as keyof ReportHarian];

      if (sortLabel.value === 'tanggal') {
        aValue = aValue ? new Date(aValue as string).getTime() : 0;
        bValue = bValue ? new Date(bValue as string).getTime() : 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder.value === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortOrder.value === 'asc' ? comparison : -comparison;
      }

      return 0;
    });
  }

  return filtered;
});

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const openAddModal = () => {
  isEditMode.value = false;
  formData.value = {
    tanggal: new Date().toISOString().split('T')[0],
    jam: '',
    tujuan_sekolah: '',
    driver: '',
    total_porsi: 0,
    catatan: ''
  };

  reportDialog.value?.showModal();
};

const editReport = (report: ReportHarian) => {
  isEditMode.value = true;
  formData.value = { ...report };

  reportDialog.value?.showModal();
};

const viewReport = (report: ReportHarian) => {
  selectedReport.value = report;

  viewReportDialog.value?.showModal();
};

const saveReport = async () => {
  try {
    isModalLoading.value = true;
    
    // TODO: API call to save/update report
    // if (isEditMode.value) {
    //   await ApiService.put(`report-harian/${formData.value.uid}`, formData.value);
    // } else {
    //   await ApiService.post('report-harian', formData.value);
    // }
    
    // Mock: Update local state
    if (isEditMode.value) {
      const index = reports.value.findIndex(r => r.uid === formData.value.uid);
      if (index !== -1) {
        reports.value[index] = formData.value as ReportHarian;
      }
    } else {
      const newReport = {
        ...formData.value,
        uid: `${Date.now()}`
      } as ReportHarian;
      reports.value.unshift(newReport);
    }
    
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: isEditMode.value ? 'Report berhasil diupdate' : 'Report berhasil ditambahkan',
      timer: 2000,
      showConfirmButton: false
    });
    
    closeModal();
    fetchReports();
    
  } catch (error) {
    console.error("Error saving report:", error);
    await Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan saat menyimpan report'
    });
  } finally {
    isModalLoading.value = false;
  }
};

const deleteReport = async (report: ReportHarian) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus report untuk ${report.tujuan_sekolah}?`,
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#d33',
  });
  
  if (result.isConfirmed) {
    try {
      // TODO: API call to delete report
      // await ApiService.delete(`report-harian/${report.uid}`);
      
      // Mock: Update local state
      reports.value = reports.value.filter(r => r.uid !== report.uid);
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Report berhasil dihapus',
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menghapus report'
      });
    }
  }
};

const refreshReports = () => {
  fetchReports();
};

const closeModal = () => {
  reportDialog.value?.close();

  formData.value = {
    tanggal: '',
    jam: '',
    tujuan_sekolah: '',
    driver: '',
    total_porsi: 0,
    catatan: ''
  };
  isEditMode.value = false;
};

const closeViewModal = () => {
  viewReportDialog.value?.close();
  selectedReport.value = null;
};

// Initialize data on component mount
onMounted(() => {
  // Load saved targets from localStorage
  const savedTargets = loadTargetsFromStorage();
  dailyReportTarget.value = savedTargets.dailyReportTarget;
  totalSchoolsTarget.value = savedTargets.totalSchoolsTarget;
  
  fetchReports();
});
</script>
