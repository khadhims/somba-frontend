<template>
  <div class="flex items-center whitespace-nowrap">
    <span v-if="label" class="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
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
    <span v-if="showItemsText" class="ml-2 text-sm text-gray-500">
      {{ itemsText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { formInputClass } from '@/core/helpers/badge'

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
  const classes = [formInputClass, 'w-auto', 'min-w-20']
  if (props.size === 'sm') classes.push('py-1 text-xs')
  if (props.size === 'lg') classes.push('py-3 text-base')
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
