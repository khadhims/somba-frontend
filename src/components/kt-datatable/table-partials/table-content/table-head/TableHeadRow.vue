<template>
  <thead class="table-header-modern">
    <tr>
      <th v-if="checkboxEnabled" class="checkbox-column">
        <div
          class="form-check form-check-sm form-check-custom form-check-solid"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-model="checked"
            @change="selectAll()"
          />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th
          class="table-header-cell"
          :class="{
            'text-center': i === header.length - 1,
            'text-start': i !== header.length - 1,
            sortable: column.sortEnabled,
            'active-sort': columnLabelAndOrder.label === column.columnLabel,
          }"
          @click="onSort(column.columnLabel, column.sortEnabled)"
          :style="{
            width: column.columnWidth ? `${column.columnWidth}px` : 'auto',
            minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
          }"
        >
          <div class="header-content">
            <span class="header-text">{{ column.columnName }}</span>
            <i
              v-if="
                columnLabelAndOrder.label === column.columnLabel &&
                column.sortEnabled
              "
              class="sort-icon"
              :class="{
                'ki-duotone ki-arrow-up': columnLabelAndOrder.order === 'asc',
                'ki-duotone ki-arrow-down':
                  columnLabelAndOrder.order === 'desc',
              }"
            >
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "table-head-row",
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    header: { type: Array as () => Array<any>, required: true },
  },
  emits: ["on-select", "on-sort"],
  components: {
    /* empty */
  },
  setup(props, { emit }) {
    const checked = ref<boolean>(false);
    const columnLabelAndOrder = ref<Sort>({
      label: props.sortLabel,
      order: props.sortOrder,
    });

    onMounted(() => {
      emit("on-sort", columnLabelAndOrder.value);
    });

    watch(
      () => props.checkboxEnabledValue,
      (currentValue) => {
        checked.value = currentValue;
      }
    );

    const selectAll = () => {
      emit("on-select", checked.value);
    };

    const onSort = (label: string, sortEnabled: boolean) => {
      if (sortEnabled) {
        if (columnLabelAndOrder.value.label === label) {
          if (columnLabelAndOrder.value.order === "asc") {
            columnLabelAndOrder.value.order = "desc";
          } else {
            if (columnLabelAndOrder.value.order === "desc") {
              columnLabelAndOrder.value.order = "asc";
            }
          }
        } else {
          columnLabelAndOrder.value.order = "asc";
          columnLabelAndOrder.value.label = label;
        }
        emit("on-sort", columnLabelAndOrder.value);
      }
    };

    const sortArrow = computed(() => {
      return columnLabelAndOrder.value.order === "asc" ? "↑" : "↓";
    });

    return {
      onSort,
      selectAll,
      checked,
      sortArrow,
      columnLabelAndOrder,
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
  padding: 1rem 1.5rem;
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

[data-bs-theme="dark"] .table-header-cell {
  color: #ffffff !important;
  background-color: var(--bs-gray-900) !important;
}

.table-header-cell.sortable {
  cursor: pointer;
  user-select: none;
}

/* .table-header-cell.sortable:hover {
  background-color: var(--bs-gray-200);
  color: var(--bs-gray-700);
} */

/* [data-bs-theme="dark"] .table-header-cell.sortable:hover {
  background-color: var(--bs-gray-800) !important;
  color: #ffffff !important;
} */

/* .table-header-cell.active-sort {
  color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle);
} */

/* [data-bs-theme="dark"] .table-header-cell.active-sort {
  color: #ffffff !important;
  background-color: var(--bs-gray-800) !important;
} */

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.header-text {
  font-weight: inherit;
}

.sort-icon {
  font-size: 0.875rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.table-header-cell:hover .sort-icon {
  opacity: 1;
}

.checkbox-column {
  width: 50px;
  padding: 1rem 1.5rem;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-header-cell {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }

  .checkbox-column {
    width: 40px;
    padding: 0.75rem 0.5rem;
  }
}
</style>
