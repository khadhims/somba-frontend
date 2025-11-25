<template>
  <!--begin::Report Harian Overview-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Report Harian Dapur SPPG</h4>
          <p class="text-muted mb-0">
            Laporan produksi dan distribusi harian dapur
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end align-items-center gap-2">
            <!-- Date Filter -->
            <div class="d-flex align-items-center">
              <label class="form-label me-2 mb-0 fw-semibold">Filter Tanggal:</label>
              <input 
                type="date" 
                v-model="filterDate"
                class="form-control form-control-solid w-200px"
                @change="onDateFilterChange"
              />
            </div>
            <!-- Settings Target Button -->
            <button 
              @click="openTargetModal" 
              class="btn btn-sm btn-light-warning"
              title="Atur Target"
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
              class="btn btn-sm btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Tambah Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--begin::Statistics Cards-->
  <div class="row g-5 g-xl-8 mb-5">
    <!--begin::Col - Total Report Hari Ini-->
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-3">
              <span class="symbol-label bg-light-primary">
                <i class="ki-duotone ki-calendar-tick fs-2x text-primary">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-400 fw-semibold d-block fs-7">Report Hari Ini</span>
              <span class="text-gray-800 fw-bold d-block fs-2x">{{ todayReportCount }}</span>
            </div>
          </div>
          <div class="progress h-6px bg-light-primary mt-5">
            <div 
              class="progress-bar bg-primary" 
              role="progressbar" 
              :style="`width: ${todayReportPercentage}%`"
            ></div>
          </div>
          <span class="text-gray-400 fw-semibold fs-7 mt-2 d-block">
            {{ todayReportPercentage }}% dari target harian
          </span>
        </div>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col - Total Porsi-->
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-3">
              <span class="symbol-label bg-light-success">
                <i class="ki-duotone ki-chart-simple fs-2x text-success">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-400 fw-semibold d-block fs-7">Total Porsi</span>
              <span class="text-gray-800 fw-bold d-block fs-2x">{{ totalPorsiToday }}</span>
            </div>
          </div>
          <div class="progress h-6px bg-light-success mt-5">
            <div 
              class="progress-bar bg-success" 
              role="progressbar" 
              style="width: 100%"
            ></div>
          </div>
          <span class="text-gray-400 fw-semibold fs-7 mt-2 d-block">
            Porsi didistribusikan hari ini
          </span>
        </div>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col - Sekolah Dilayani-->
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-3">
              <span class="symbol-label bg-light-warning">
                <i class="ki-duotone ki-home-2 fs-2x text-warning">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-400 fw-semibold d-block fs-7">Sekolah Dilayani</span>
              <span class="text-gray-800 fw-bold d-block fs-2x">{{ uniqueSchoolsToday }}</span>
            </div>
          </div>
          <div class="progress h-6px bg-light-warning mt-5">
            <div 
              class="progress-bar bg-warning" 
              role="progressbar" 
              :style="`width: ${schoolPercentage}%`"
            ></div>
          </div>
          <span class="text-gray-400 fw-semibold fs-7 mt-2 d-block">
            Dari {{ totalSchoolsTarget }} sekolah target
          </span>
        </div>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col - Driver Aktif-->
    <div class="col-xl-3 col-md-6">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-3">
              <span class="symbol-label bg-light-info">
                <i class="ki-duotone ki-profile-user fs-2x text-info">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-400 fw-semibold d-block fs-7">Driver Aktif</span>
              <span class="text-gray-800 fw-bold d-block fs-2x">{{ uniqueDriversToday }}</span>
            </div>
          </div>
          <div class="progress h-6px bg-light-info mt-5">
            <div 
              class="progress-bar bg-info" 
              role="progressbar" 
              :style="`width: ${driverPercentage}%`"
            ></div>
          </div>
          <span class="text-gray-400 fw-semibold fs-7 mt-2 d-block">
            Driver bertugas hari ini
          </span>
        </div>
      </div>
    </div>
    <!--end::Col-->
  </div>
  <!--end::Statistics Cards-->

  <!--begin::Report List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Daftar Report Harian</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Items per page-->
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">Items per page</label>
          <select 
            class="form-select form-select-sm w-auto" 
            v-model.number="itemsPerPage"
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
        <div class="d-flex align-items-center position-relative my-1 me-3">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control form-control-sm form-control-solid w-200px ps-12"
            placeholder="Search"
          />
        </div>
        <!--end::Search-->

        <button @click="refreshReports" class="btn btn-sm btn-light-primary btn-icon" title="Refresh">
          <i class="ki-duotone ki-arrows-circle fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
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
          <span class="text-dark fw-bold d-block fs-6">{{
            row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-'
          }}</span>
        </template>

        <template v-slot:jam="{ row }">
          <span class="text-dark fw-bold fs-6">
            {{ row.jam || '-' }}
          </span>
        </template>

        <template v-slot:tujuan_sekolah="{ row }">
          <div style="max-width: 200px; min-width: 150px;">
            <span class="text-dark fw-bold fs-6" style="word-break: break-all;">
              {{ row.tujuan_sekolah }}
            </span>
          </div>
        </template>

        <template v-slot:driver="{ row }">
          <span class="text-dark fw-bold fs-6">
            {{ row.driver }}
          </span>
        </template>

        <template v-slot:total_porsi="{ row }">
          <span class="badge badge-light-success fs-6">
            {{ row.total_porsi }} porsi
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="viewReport(row)"
              title="View"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editReport(row)"
              title="Edit"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteReport(row)"
              title="Delete"
            >
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>
      
      <!--begin::Pagination-->
      <div class="d-flex justify-content-end align-items-center mt-4">
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

  <!--begin::Add/Edit Report Modal-->
  <div class="modal fade" id="reportModal" tabindex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title fw-bold" id="reportModalLabel">
            {{ isEditMode ? 'Edit Report Harian' : 'Tambah Report Harian' }}
          </h3>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveReport">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark required">Tanggal</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="formData.tanggal"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark required">Jam Kirim</label>
                <input 
                  type="time" 
                  class="form-control" 
                  v-model="formData.jam"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label fw-bold text-dark required">Tujuan Sekolah</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.tujuan_sekolah"
                  placeholder="Masukkan nama sekolah tujuan"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark required">Driver</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.driver"
                  placeholder="Masukkan nama driver"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-dark required">Total Porsi</label>
                <input 
                  type="number" 
                  class="form-control" 
                  v-model.number="formData.total_porsi"
                  placeholder="Masukkan jumlah porsi"
                  min="1"
                  required
                />
              </div>
              <div class="col-12">
                <label class="form-label fw-bold text-dark">Catatan</label>
                <textarea 
                  class="form-control" 
                  rows="3" 
                  v-model="formData.catatan"
                  placeholder="Catatan tambahan (opsional)"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary fs-5 px-4 py-2" @click="closeModal">Batal</button>
          <button 
            type="button" 
            class="btn btn-primary fs-5 px-4 py-2" 
            @click="saveReport"
            :disabled="isModalLoading"
          >
            <span v-if="isModalLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEditMode ? 'Update' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--end::Add/Edit Report Modal-->

  <!--begin::View Report Modal-->
  <div class="modal fade" id="viewReportModal" tabindex="-1" aria-labelledby="viewReportModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title fw-bold" id="viewReportModalLabel">Detail Report Harian</h3>
          <button type="button" class="btn-close" @click="closeViewModal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="selectedReport">
          <div class="row g-6">
            <div class="col-md-6">
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Tanggal</label>
                <p class="text-gray-800 mb-0 fs-4">
                  {{ selectedReport.tanggal ? new Date(selectedReport.tanggal).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-' }}
                </p>
              </div>
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Jam Kirim</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedReport.jam }}</p>
              </div>
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Driver</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedReport.driver }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Tujuan Sekolah</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedReport.tujuan_sekolah }}</p>
              </div>
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Total Porsi</label>
                <p class="text-gray-800 mb-0 fs-4">
                  <span class="badge badge-light-success fs-5">{{ selectedReport.total_porsi }} porsi</span>
                </p>
              </div>
            </div>
            <div class="col-12" v-if="selectedReport.catatan">
              <div class="bg-light-info p-4 rounded">
                <label class="fw-semibold fs-4 text-gray-700 mb-2 d-block">Catatan</label>
                <p class="text-gray-800 mb-0 fs-5" style="white-space: pre-wrap;">{{ selectedReport.catatan }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary fs-5 px-4 py-2" @click="closeViewModal">Tutup</button>
        </div>
      </div>
    </div>
  </div>
  <!--end::View Report Modal-->

  <!--begin::Target Settings Modal-->
  <div class="modal fade" id="targetSettingsModal" tabindex="-1" aria-labelledby="targetSettingsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title fw-bold" id="targetSettingsModalLabel">
            <i class="ki-duotone ki-abstract-26 fs-1 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Pengaturan Target
          </h3>
          <button type="button" class="btn-close" @click="closeTargetModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-warning d-flex align-items-center">
            <i class="ki-duotone ki-information-5 fs-2hx text-warning me-4">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            <div class="d-flex flex-column">
              <h5 class="mb-1">Informasi Target</h5>
              <span>Target digunakan untuk menghitung persentase pencapaian harian pada dashboard.</span>
            </div>
          </div>

          <form @submit.prevent="saveTargetSettings">
            <div class="row g-4">
              <div class="col-12">
                <label class="form-label fw-bold text-dark required">
                  Target Report Harian
                  <i class="ki-duotone ki-information-5 fs-6 text-gray-500" title="Jumlah target report yang harus dibuat per hari">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                </label>
                <div class="input-group">
                  <input 
                    type="number" 
                    class="form-control form-control-lg" 
                    v-model.number="targetSettings.dailyReportTarget"
                    placeholder="Masukkan jumlah target report"
                    min="1"
                    max="100"
                    required
                  />
                  <span class="input-group-text">report/hari</span>
                </div>
                <div class="form-text">Jumlah report yang ditargetkan dibuat setiap hari</div>
              </div>

              <div class="col-12">
                <label class="form-label fw-bold text-dark required">
                  Target Sekolah
                  <i class="ki-duotone ki-information-5 fs-6 text-gray-500" title="Jumlah target sekolah yang harus dilayani per hari">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                </label>
                <div class="input-group">
                  <input 
                    type="number" 
                    class="form-control form-control-lg" 
                    v-model.number="targetSettings.totalSchoolsTarget"
                    placeholder="Masukkan jumlah target sekolah"
                    min="1"
                    max="100"
                    required
                  />
                  <span class="input-group-text">sekolah/hari</span>
                </div>
                <div class="form-text">Jumlah sekolah yang ditargetkan dilayani setiap hari</div>
              </div>

              <div class="col-12">
                <div class="separator separator-dashed my-3"></div>
                <div class="bg-light-primary p-4 rounded">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-chart-simple-2 fs-2x text-primary me-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                    </i>
                    <div>
                      <h6 class="mb-1 text-primary">Preview Pencapaian Hari Ini</h6>
                      <p class="mb-0 text-gray-700 fs-7">
                        Report: <strong>{{ todayReportCount }}</strong> / {{ targetSettings.dailyReportTarget }} 
                        ({{ Math.round((todayReportCount / targetSettings.dailyReportTarget) * 100) }}%)
                      </p>
                      <p class="mb-0 text-gray-700 fs-7">
                        Sekolah: <strong>{{ uniqueSchoolsToday }}</strong> / {{ targetSettings.totalSchoolsTarget }} 
                        ({{ Math.round((uniqueSchoolsToday / targetSettings.totalSchoolsTarget) * 100) }}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary fs-5 px-4 py-2" @click="closeTargetModal">Batal</button>
          <button 
            type="button" 
            class="btn btn-primary fs-5 px-4 py-2" 
            @click="saveTargetSettings"
            :disabled="isTargetModalLoading"
          >
            <span v-if="isTargetModalLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i class="ki-duotone ki-check fs-2 me-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--end::Target Settings Modal-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Modal } from "bootstrap";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

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

// Modal state
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
  
  const modalElement = document.getElementById('targetSettingsModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const closeTargetModal = () => {
  const modalElement = document.getElementById('targetSettingsModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
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
    
    // Mock data for development - More comprehensive data
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
    
    const mockData: ReportHarian[] = [
      // Today's reports
      {
        uid: '1',
        tanggal: today,
        jam: '06:00',
        tujuan_sekolah: 'SDN 1 Jakarta Pusat',
        driver: 'Budi Santoso',
        total_porsi: 250,
        catatan: 'Pengiriman lancar'
      },
      {
        uid: '2',
        tanggal: today,
        jam: '06:30',
        tujuan_sekolah: 'SDN 2 Jakarta Selatan',
        driver: 'Ahmad Kusuma',
        total_porsi: 300,
        catatan: ''
      },
      {
        uid: '3',
        tanggal: today,
        jam: '07:00',
        tujuan_sekolah: 'SDN 3 Jakarta Timur',
        driver: 'Siti Nurhaliza',
        total_porsi: 200,
        catatan: ''
      },
      {
        uid: '4',
        tanggal: today,
        jam: '07:15',
        tujuan_sekolah: 'SDN 4 Jakarta Barat',
        driver: 'Budi Santoso',
        total_porsi: 280,
        catatan: 'Pengiriman kedua'
      },
      {
        uid: '5',
        tanggal: today,
        jam: '07:30',
        tujuan_sekolah: 'SDN 5 Jakarta Utara',
        driver: 'Rudi Hartono',
        total_porsi: 320,
        catatan: ''
      },
      // Yesterday's reports
      {
        uid: '6',
        tanggal: yesterday,
        jam: '06:00',
        tujuan_sekolah: 'SDN 1 Jakarta Pusat',
        driver: 'Ahmad Kusuma',
        total_porsi: 240,
        catatan: ''
      },
      {
        uid: '7',
        tanggal: yesterday,
        jam: '06:30',
        tujuan_sekolah: 'SDN 2 Jakarta Selatan',
        driver: 'Budi Santoso',
        total_porsi: 290,
        catatan: ''
      },
      {
        uid: '8',
        tanggal: yesterday,
        jam: '07:15',
        tujuan_sekolah: 'SDN 3 Jakarta Timur',
        driver: 'Siti Nurhaliza',
        total_porsi: 200,
        catatan: 'Terlambat 15 menit karena macet'
      },
      // Two days ago
      {
        uid: '9',
        tanggal: twoDaysAgo,
        jam: '06:00',
        tujuan_sekolah: 'SDN 1 Jakarta Pusat',
        driver: 'Rudi Hartono',
        total_porsi: 250,
        catatan: ''
      },
      {
        uid: '10',
        tanggal: twoDaysAgo,
        jam: '06:45',
        tujuan_sekolah: 'SDN 6 Jakarta Selatan',
        driver: 'Ahmad Kusuma',
        total_porsi: 310,
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
  
  const modalElement = document.getElementById('reportModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const editReport = (report: ReportHarian) => {
  isEditMode.value = true;
  formData.value = { ...report };
  
  const modalElement = document.getElementById('reportModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const viewReport = (report: ReportHarian) => {
  selectedReport.value = report;
  
  const modalElement = document.getElementById('viewReportModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
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
  const modalElement = document.getElementById('reportModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
  
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
  const modalElement = document.getElementById('viewReportModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
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
