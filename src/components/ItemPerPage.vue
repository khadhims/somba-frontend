<template>
  <div class="items-per-page-container d-flex align-items-center">
    <span v-if="label" class="form-label me-3 mb-0">{{ label }}</span>
    <select
      :id="id"
      v-model="localValue"
      :class="selectClasses"
      :disabled="disabled"
      @change="handleChange"
    >
      <option 
        v-for="option in availableOptions" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span v-if="showItemsText" class="text-muted ms-2">
      {{ itemsText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Option {
  value: number
  label: string
}

interface Props {
  modelValue?: number
  label?: string
  id?: string
  disabled?: boolean
  options?: number[]
  customOptions?: Option[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline'
  showItemsText?: boolean
  itemsText?: string
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 10,
  label: 'Items per page:',
  options: () => [10, 20, 30, 50],
  size: 'sm',
  variant: 'solid',
  showItemsText: true,
  itemsText: 'items'
})

const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)

// Computed properties
const availableOptions = computed(() => {
  if (props.customOptions && props.customOptions.length > 0) {
    return props.customOptions
  }
  
  return props.options.map(value => ({
    value,
    label: value.toString()
  }))
})

const selectClasses = computed(() => {
  const classes = ['form-select']
  
  if (props.size === 'sm') classes.push('form-select-sm')
  if (props.size === 'lg') classes.push('form-select-lg')
  
  if (props.variant === 'outline') classes.push('form-select-outline')
  
  return classes.join(' ')
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// Methods
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = parseInt(target.value)
  localValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

// Validate initial value
if (!props.options.includes(props.modelValue) && !props.customOptions?.some(opt => opt.value === props.modelValue)) {
  const firstOption = props.customOptions?.[0]?.value ?? props.options[0]
  localValue.value = firstOption
  emit('update:modelValue', firstOption)
}
</script>

<style scoped>
.items-per-page-container {
  white-space: nowrap;
}

.form-select {
  width: auto;
  min-width: 80px;
}

.form-select-sm {
  min-width: 70px;
}

.form-select-lg {
  min-width: 90px;
}

.form-label {
  font-weight: 500;
  color: var(--bs-gray-700);
}

.text-muted {
  font-size: 0.875rem;
}

.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
</style>