<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <div class="table-responsive">
      <table
        :class="[loading && 'overlay overlay-block']"
        class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
      >
        <!-- Table Header -->
        <thead class="table-header-modern">
          <tr>
            <th v-if="checkboxEnabled" class="checkbox-column">
              <div
                class="form-check form-check-sm form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="headerChecked"
                  @change="selectAll"
                />
              </div>
            </th>
            <template v-for="(column, i) in header" :key="i">
              <th
                class="table-header-cell text-start"
                :class="{
                  sortable: column.sortEnabled,
                  'active-sort': currentSort.label === column.columnLabel,
                }"
                @click="handleSort(column.columnLabel, column.sortEnabled)"
                :style="{
                  width: column.columnWidth
                    ? `${column.columnWidth}px`
                    : 'auto',
                  minWidth: column.columnWidth
                    ? `${column.columnWidth}px`
                    : '0',
                }"
              >
                <div class="header-content">
                  <span class="header-text">{{ column.columnName }}</span>
                  <div v-if="column.sortEnabled" class="sort-icon-wrapper">
                    <ArrowUp
                      v-if="
                        currentSort.label === column.columnLabel &&
                        currentSort.order === 'asc'
                      "
                      :size="16"
                      class="sort-icon active"
                    />
                    <ArrowDown
                      v-else-if="
                        currentSort.label === column.columnLabel &&
                        currentSort.order === 'desc'
                      "
                      :size="16"
                      class="sort-icon active"
                    />
                    <ArrowUpDown v-else :size="16" class="sort-icon inactive" />
                  </div>
                </div>
              </th>
            </template>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody
          v-if="dataToDisplay.length !== 0"
          class="fw-semibold text-gray-600"
        >
          <template v-for="(row, i) in dataToDisplay" :key="i">
            <tr>
              <td v-if="checkboxEnabled">
                <div
                  class="form-check form-check-sm form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="row[checkboxLabel]"
                    v-model="selectedItems"
                    @change="onItemsChange"
                  />
                </div>
              </td>
              <template v-for="(properties, j) in header" :key="j">
                <td class="text-start">
                  <slot :name="`${properties.columnLabel}`" :row="row">
                    {{ row[properties.columnLabel] }}
                  </slot>
                </td>
              </template>
            </tr>
          </template>
        </tbody>

        <!-- Empty State -->
        <tbody v-else>
          <tr class="odd">
            <td
              :colspan="header.length + (checkboxEnabled ? 1 : 0)"
              class="dataTables_empty"
            >
              {{ emptyTableText }}
            </td>
          </tr>
        </tbody>

        <!-- Loading Overlay -->
        <div v-if="loading" class="overlay-wrapper">
          <div class="overlay-layer bg-dark bg-opacity-5 rounded">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, onMounted } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-vue-next";

interface TableHeader {
  columnName: string;
  columnLabel: string;
  sortEnabled?: boolean;
  searchable?: boolean;
  columnWidth?: number;
}

export default defineComponent({
  name: "kt-datatable",
  components: {
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
  },
  props: {
    header: { type: Array as () => TableHeader[], required: true },
    data: { type: Array as () => any[], required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    emptyTableText: { type: String, required: false, default: "No data found" },
    currentPage: { type: Number, required: false, default: 1 },
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-items-per-page-change",
  ],
  setup(props, { emit }) {
    const currentPage = ref(props.currentPage);
    const itemsInTable = ref<number>(props.itemsPerPage);
    const selectedItems = ref<Array<unknown>>([]);
    const headerChecked = ref<boolean>(false);
    const currentSort = ref<Sort>({
      label: props.sortLabel,
      order: props.sortOrder,
    });

    // Sync itemsInTable with props.itemsPerPage
    watch(
      () => props.itemsPerPage,
      (newValue) => {
        itemsInTable.value = newValue;
      },
      { immediate: true }
    );

    watch(
      () => itemsInTable.value,
      (val) => {
        currentPage.value = 1;
        emit("on-items-per-page-change", val);
      }
    );

    // Watch data changes to reset selections
    watch(
      () => props.data,
      () => {
        selectedItems.value = [];
        headerChecked.value = false;
      }
    );

    // Watch selected items to emit changes
    watch(
      () => [...selectedItems.value],
      (currentValue) => {
        if (currentValue) {
          emit("on-items-select", currentValue);
        }
      }
    );

    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };

    const dataToDisplay = computed(() => {
      // For server-side pagination, just return all data as-is
      // The server already sends the correct page of data
      return props.data || [];
    });

    const totalItems = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.total;
        } else {
          return props.data.length;
        }
      }
      return 0;
    });

    const handleSort = (label: string, sortEnabled: boolean) => {
      if (sortEnabled) {
        if (currentSort.value.label === label) {
          if (currentSort.value.order === "asc") {
            currentSort.value.order = "desc";
          } else {
            currentSort.value.order = "asc";
          }
        } else {
          currentSort.value.order = "asc";
          currentSort.value.label = label;
        }
        emit("on-sort", currentSort.value);
      }
    };

    const selectAll = () => {
      if (headerChecked.value) {
        // Select all items
        selectedItems.value = [];
        // eslint-disable-next-line
        props.data.forEach((item: any) => {
          if (item[props.checkboxLabel]) {
            selectedItems.value.push(item[props.checkboxLabel]);
          }
        });
      } else {
        // Deselect all
        selectedItems.value = [];
      }
    };

    const onItemsChange = () => {
      // Update header checkbox state based on selected items
      const totalSelectableItems = props.data.filter(
        (item: any) => item[props.checkboxLabel]
      ).length;
      headerChecked.value =
        selectedItems.value.length === totalSelectableItems &&
        totalSelectableItems > 0;
    };

    watch(
      () => [props.sortLabel, props.sortOrder],
      ([newLabel, newOrder]) => {
        if (newLabel) {
          currentSort.value = {
            label: newLabel as string,
            order: newOrder as "asc" | "desc",
          };
        }
      }
    );

    onMounted(() => {
      // Initialize sort
      if (props.sortLabel) {
        currentSort.value = {
          label: props.sortLabel,
          order: props.sortOrder,
        };
        emit("on-sort", currentSort.value);
      }
    });

    return {
      pageChange,
      dataToDisplay,
      handleSort,
      selectAll,
      onItemsChange,
      selectedItems,
      headerChecked,
      currentSort,
      itemsInTable,
      totalItems,
    };
  },
});
</script>

<style scoped>
.table-header-modern {
  background: var(--bs-gray-100);
  border: none;
  position: sticky;
  top: 0;
  z-index: 10;
}

[data-bs-theme="dark"] .table-header-modern {
  background: var(--bs-gray-900) !important;
}

.table-header-cell {
  padding: 1rem 1.5rem !important;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: var(--bs-gray-600);
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
}

/* Ensure consistent padding for all table cells */
.table td {
  padding: 1rem 1.5rem !important;
}

/* Override any conflicting Bootstrap table styles */
.table > :not(caption) > * > * {
  padding: 1rem 1.5rem !important;
}

[data-bs-theme="dark"] .table-header-cell {
  color: #ffffff !important;
  background-color: var(--bs-gray-900) !important;
}

.table-header-cell.sortable {
  cursor: pointer;
  user-select: none;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}

.header-text {
  font-weight: inherit;
}

.sort-icon-wrapper {
  display: flex;
  align-items: center;
}

.sort-icon {
  opacity: 0.5;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sort-icon.active {
  opacity: 1;
  color: var(--bs-primary);
}

.sort-icon.inactive:hover {
  opacity: 0.8;
}

/* On hover of the header cell, highlight the inactive sort icon */
.table-header-cell:hover .sort-icon.inactive {
  opacity: 0.8;
}

.checkbox-column {
  width: 50px;
  padding: 1rem 1.5rem !important;
  border: none;
  background: inherit;
}

[data-bs-theme="dark"] .checkbox-column {
  background-color: var(--bs-gray-900) !important;
}

.checkbox-column .form-check {
  margin: 0;
  display: flex;
  justify-content: center;
}

/* Remove all table borders */
.table-header-modern tr,
.table-header-modern th {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
}

/* Loading overlay */
.overlay-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
}

.overlay-layer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-header-cell,
  .table td,
  .table > :not(caption) > * > * {
    padding: 0.75rem 1rem !important;
    font-size: 0.8rem;
  }

  .checkbox-column {
    width: 40px;
    padding: 0.75rem 0.5rem !important;
  }
}
</style>
