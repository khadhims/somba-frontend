import { ref, onBeforeUnmount, type Ref } from "vue";

// Replaces Metronic's MenuComponent (src/assets/ts/components/MenuComponent.ts,
// 1130 lines) for the app's few live "click a button, a small menu opens
// near it" cases (Dropdown3/Dropdown4 triggers). MenuComponent is a large
// generic engine (click/hover triggers, accordion-vs-dropdown submenu
// types, permanent menus, Popper-positioned nested submenus) built for a
// component-library demo covering every possible case; every live call
// site here just needs "click trigger, plain dropdown anchored to it,
// click-outside-to-close" - plain Tailwind `absolute` positioning on a
// `relative` wrapper covers that without pulling in @popperjs/core.
export function useDropdown() {
  const isOpen = ref(false);
  const containerRef: Ref<HTMLElement | null> = ref(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (isOpen.value && !containerRef.value?.contains(e.target as Node)) {
      close();
    }
  };

  const open = () => {
    isOpen.value = true;
    document.addEventListener("click", handleClickOutside, true);
  };

  const close = () => {
    isOpen.value = false;
    document.removeEventListener("click", handleClickOutside, true);
  };

  const toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside, true);
  });

  return { isOpen, containerRef, open, close, toggle };
}
