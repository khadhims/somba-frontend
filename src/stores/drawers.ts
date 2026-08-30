import { ref } from "vue";
import { defineStore } from "pinia";

// Replaces Metronic's DrawerComponent (src/assets/ts/components/_DrawerComponent.ts)
// for the app shell's 4 slide-in drawers (aside mobile menu, help, messenger,
// activity). Each drawer used to be its own independent DOM-attribute-driven
// instance, opened via a trigger button living in a *different* component
// than the drawer panel itself - that cross-component relationship is why
// this is a shared store rather than 4 separate local refs.
export const useDrawersStore = defineStore("drawers", () => {
  const asideMobileOpen = ref(false);
  const helpOpen = ref(false);
  const messengerOpen = ref(false);
  const activityOpen = ref(false);
  // Same cross-component problem as the drawers above: the only live
  // trigger ("Invite Contacts" in MessengerDrawer's Dropdown4) lives in a
  // different component than InviteFriendsModal (mounted by DefaultLayout).
  const inviteFriendsOpen = ref(false);

  const closeAll = () => {
    asideMobileOpen.value = false;
    helpOpen.value = false;
    messengerOpen.value = false;
    activityOpen.value = false;
  };

  return {
    asideMobileOpen,
    helpOpen,
    messengerOpen,
    activityOpen,
    inviteFriendsOpen,
    closeAll,
  };
});
