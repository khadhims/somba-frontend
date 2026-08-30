import { ref, computed } from "vue";

// Replaces Metronic's StepperComponent (src/assets/ts/components/_StepperComponent.ts)
// for the two wizard trees (create-account-wizard, create-app-wizard) - both
// need identical current/completed/pending + goNext/goPrev/goFirst semantics
// (2 concrete call sites, same shape), so this is extracted rather than
// duplicated. The original component only ever drove DOM class toggling
// (`current`/`completed`/`pending` on nav+content elements); actual
// step-advancement validation was already Vue-side (vee-validate's
// `handleSubmit` per step) in both wizard Form components - this composable
// just replaces the class-toggling half with reactive state.
export function useStepper(totalSteps: number) {
  // 0-indexed, matching the existing `currentStepIndex` convention already
  // used in both wizard Form components before this migration.
  const currentStepIndex = ref(0);

  const isFirstStep = computed(() => currentStepIndex.value === 0);
  const isLastStep = computed(() => currentStepIndex.value === totalSteps - 1);

  const goNext = () => {
    if (currentStepIndex.value < totalSteps - 1) currentStepIndex.value++;
  };

  const goPrev = () => {
    if (currentStepIndex.value > 0) currentStepIndex.value--;
  };

  const goFirst = () => {
    currentStepIndex.value = 0;
  };

  /** 0-indexed step position -> "current" | "completed" | "pending" */
  const stepState = (index: number): "current" | "completed" | "pending" => {
    if (index === currentStepIndex.value) return "current";
    return index < currentStepIndex.value ? "completed" : "pending";
  };

  return {
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    goNext,
    goPrev,
    goFirst,
    stepState,
  };
}

export type Stepper = ReturnType<typeof useStepper>;
