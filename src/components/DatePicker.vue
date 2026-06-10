<template>
  <div class="date-picker-container">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="input-group">
      <span class="input-group-text">
        <i class="ki-duotone ki-calendar-2 fs-4">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
          <span class="path4"></span>
          <span class="path5"></span>
        </i>
      </span>
      <input
        :id="id"
        ref="dateInput"
        v-model="localValue"
        type="date"
        :class="inputClasses + ' w-90px'"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="minDate"
        :max="maxDate"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
    <div v-if="errorMessage" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
    <div v-if="helpText" class="form-text">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "DatePickerComponent",
});

import { ref, computed, watch, nextTick, onMounted } from "vue";

interface Props {
  modelValue?: string | null;
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  minDate?: string;
  maxDate?: string;
  errorMessage?: string;
  helpText?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
  storageKey?: string;
}

// Note: default date types removed — initialization uses `modelValue` or `storageKey` only.

interface Emits {
  (e: "update:modelValue", value: string | null): void;
  (e: "change", value: string | null): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: "Pilih tanggal",
  size: "md",
  variant: "solid",
  clearable: true,
  storageKey: undefined,
});

const emit = defineEmits<Emits>();

const localValue = ref(props.modelValue);
const dateInput = ref<HTMLInputElement>();

// Initialize value from props, localStorage, or defaultType
onMounted(async () => {
  let initialValue = props.modelValue;

  // If no modelValue provided, try to get from localStorage (storageKey)
  if (!initialValue && props.storageKey) {
    const storedValue = localStorage.getItem(props.storageKey);
    if (storedValue) {
      initialValue = storedValue;
    }
  }

  // Update local value and emit if we found a value
  if (initialValue) {
    localValue.value = initialValue;
    await nextTick();
    emit("update:modelValue", initialValue);
  }
});

// Computed classes
const inputClasses = computed(() => {
  const classes = ["form-control"];

  if (props.size === "sm") classes.push("form-control-sm");
  if (props.size === "lg") classes.push("form-control-lg");

  if (props.variant === "outline") classes.push("form-control-outline");

  if (props.errorMessage) classes.push("is-invalid");

  return classes.join(" ");
});

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
    if (props.storageKey && newValue) {
      localStorage.setItem(props.storageKey, newValue);
    } else if (props.storageKey && newValue === null) {
      localStorage.removeItem(props.storageKey);
    }
  }
);

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value || null;
  localValue.value = value;
  emit("update:modelValue", value);
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value || null;
  emit("change", value);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const clearDate = () => {
  localValue.value = null;
  emit("update:modelValue", null);
  emit("change", null);
  dateInput.value?.focus();
};

// Expose methods for parent component
defineExpose({
  focus: () => dateInput.value?.focus(),
  blur: () => dateInput.value?.blur(),
  clear: clearDate,
});
</script>

<style scoped>
.date-picker-container {
  position: relative;
}

/* Compact DatePicker - sama tinggi dengan btn btn-sm */
.input-group {
  height: 31px;
}

.input-group-text {
  background-color: var(--bs-gray-100);
  border-color: var(--bs-border-color);
  padding: 0.25rem 0.5rem;
  height: 28px;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.form-control {
  height: 28px !important;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.form-control-sm {
  height: 28px !important;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.date-clear-btn {
  height: 28px;
  width: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--bs-border-color);
  border-left: 0;
  background-color: var(--bs-gray-100);
  flex: 0 0 auto;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-control.is-invalid {
  border-color: var(--bs-danger);
}

.form-control.is-invalid:focus {
  border-color: var(--bs-danger);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.25);
}
</style>
