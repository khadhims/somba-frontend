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
        :class="inputClasses"
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
      <button
        v-if="clearable && localValue"
        type="button"
        class="btn btn-icon btn-active-light-primary w-30px h-16px"
        @click="clearDate"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
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
import { ref, computed, watch, nextTick, onMounted } from 'vue'

interface Props {
  modelValue?: string | null
  label?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  minDate?: string
  maxDate?: string
  errorMessage?: string
  helpText?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline'
  defaultType?: 'today' | 'monthAgo' | 'weekAgo' | 'yearAgo' | null
}

// Helper functions for default dates
const getDefaultDate = (type: string | null): string | null => {
  if (!type) return null
  
  const date = new Date()
  
  switch (type) {
    case 'today':
      return date.toISOString().split('T')[0]
    case 'monthAgo':
      date.setMonth(date.getMonth() - 1)
      return date.toISOString().split('T')[0]
    case 'weekAgo':
      date.setDate(date.getDate() - 7)
      return date.toISOString().split('T')[0]
    case 'yearAgo':
      date.setFullYear(date.getFullYear() - 1)
      return date.toISOString().split('T')[0]
    default:
      return null
  }
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Pilih tanggal',
  size: 'md',
  variant: 'solid',
  clearable: true,
  defaultType: null
})

const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue || getDefaultDate(props.defaultType))
const dateInput = ref<HTMLInputElement>()

// Use nextTick to emit initial default value to prevent immediate multiple calls
onMounted(async () => {
  // Emit initial default value if it exists, but only after component is mounted
  if (!props.modelValue && props.defaultType) {
    const defaultValue = getDefaultDate(props.defaultType)
    if (defaultValue && defaultValue !== localValue.value) {
      await nextTick()
      emit('update:modelValue', defaultValue)
    }
  }
})

// Computed classes
const inputClasses = computed(() => {
  const classes = ['form-control']
  
  if (props.size === 'sm') classes.push('form-control-sm')
  if (props.size === 'lg') classes.push('form-control-lg')
  
  if (props.variant === 'outline') classes.push('form-control-outline')
  
  if (props.errorMessage) classes.push('is-invalid')
  
  return classes.join(' ')
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value || null
  localValue.value = value
  emit('update:modelValue', value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value || null
  emit('change', value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const clearDate = () => {
  localValue.value = null
  emit('update:modelValue', null)
  emit('change', null)
  dateInput.value?.focus()
}

// Expose methods for parent component
defineExpose({
  focus: () => dateInput.value?.focus(),
  blur: () => dateInput.value?.blur(),
  clear: clearDate
})
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

.btn-icon {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  border: none;
  background: transparent;
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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