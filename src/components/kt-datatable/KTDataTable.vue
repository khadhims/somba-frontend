<template>
  <div class="relative">
    <div class="overflow-x-auto">
      <table class="w-full text-sm" :class="{ 'pointer-events-none opacity-50': loading }">
        <!-- Table Header -->
        <thead class="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
          <tr>
            <th v-if="checkboxEnabled" class="w-[50px] px-6 py-4">
              <div class="flex justify-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                  v-model="headerChecked"
                  @change="selectAll"
                />
              </div>
            </th>
            <template v-for="(column, i) in header" :key="i">
              <th
                class="group whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-100"
                :class="{ 'cursor-pointer select-none': column.sortEnabled }"
                @click="handleSort(column.columnLabel, column.sortEnabled)"
                :style="{
                  width: column.columnWidth ? `${column.columnWidth}px` : 'auto',
                  minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
                }"
              >
                <div class="flex items-center justify-start gap-2">
                  <span>{{ column.columnName }}</span>
                  <div v-if="column.sortEnabled" class="flex items-center">
                    <ArrowUp
                      v-if="currentSort.label === column.columnLabel && currentSort.order === 'asc'"
                      :size="16"
                      class="text-primary"
                    />
                    <ArrowDown
                      v-else-if="currentSort.label === column.columnLabel && currentSort.order === 'desc'"
                      :size="16"
                      class="text-primary"
                    />
                    <ArrowUpDown
                      v-else
                      :size="16"
                      class="opacity-50 transition-opacity group-hover:opacity-80"
                    />
                  </div>
                </div>
              </th>
            </template>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody v-if="dataToDisplay.length !== 0" class="font-semibold text-gray-600 dark:text-gray-300">
          <template v-for="(row, i) in dataToDisplay" :key="i">
            <tr>
              <td v-if="checkboxEnabled" class="px-6 py-4">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                    :value="row[checkboxLabel]"
                    v-model="selectedItems"
                    @change="onItemsChange"
                  />
                </div>
              </td>
              <template v-for="(properties, j) in header" :key="j">
                <td class="px-6 py-4 text-left">
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
          <tr>
            <td :colspan="header.length + (checkboxEnabled ? 1 : 0)" class="px-6 py-8 text-center text-gray-500">
              {{ emptyTableText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center rounded bg-black/5">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, onMounted } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-vue-next';

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
    ArrowUpDown
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
      const totalSelectableItems = props.data.filter((item: any) => item[props.checkboxLabel]).length;
      headerChecked.value = selectedItems.value.length === totalSelectableItems && totalSelectableItems > 0;
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
