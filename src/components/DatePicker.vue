<template>
  <div class="relative">
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <div class="flex h-[31px]">
      <span class="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-2 text-sm dark:border-gray-700 dark:bg-gray-800">
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
        :class="inputClasses + ' w-[90px]'"
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
    <div v-if="errorMessage" class="mt-1 block text-sm text-danger">
      {{ errorMessage }}
    </div>
    <div v-if="helpText" class="mt-1 text-sm text-gray-500">
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
  storageKey?: string
}

// Note: default date types removed — initialization uses `modelValue` or `storageKey` only.

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
  storageKey: undefined
})

const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)
const dateInput = ref<HTMLInputElement>()

// Initialize value from props, localStorage, or defaultType
onMounted(async () => {
  let initialValue = props.modelValue

  // If no modelValue provided, try to get from localStorage (storageKey)
  if (!initialValue && props.storageKey) {
    const storedValue = localStorage.getItem(props.storageKey)
    if (storedValue) {
      initialValue = storedValue
    }
  }

  // Update local value and emit if we found a value
  if (initialValue) {
    localValue.value = initialValue
    await nextTick()
    emit('update:modelValue', initialValue)
  }
})

// Computed classes
// Note: `size`/`variant` props are kept for API compat with existing call
// sites, but the original CSS forced every size to the same compact 28px
// height via `!important`, so there was never a real visual difference to
// preserve here.
const inputClasses = computed(() => {
  const classes = [
    'h-[28px] rounded-r-md border border-gray-300 px-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
  ]
  if (props.errorMessage) classes.push('border-danger focus:border-danger focus:ring-danger/30')
  return classes.join(' ')
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
  if (props.storageKey && newValue) {
    localStorage.setItem(props.storageKey, newValue)
  } else if (props.storageKey && newValue === null) {
    localStorage.removeItem(props.storageKey)
  }
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
