import { ref } from "vue";
import { defineStore } from "pinia";
import objectPath from "object-path";
import type LayoutConfigTypes from "@/layouts/default-layout/config/types";
import layoutConfig from "@/layouts/default-layout/config/DefaultLayoutConfig";

export const LS_CONFIG_NAME_KEY = "config_" + import.meta.env.VITE_APP_DEMO;

export const useConfigStore = defineStore("config", () => {
  const config = ref<LayoutConfigTypes>(layoutConfig);
  const initial = ref<LayoutConfigTypes>(layoutConfig);

  function getLayoutConfig(path: string, defaultValue?: string) {
    return objectPath.get(config.value, path, defaultValue);
  }

  function setLayoutConfigProperty(property: string, value: any) {
    try {
      objectPath.set(config.value, property, value);
      localStorage.setItem(LS_CONFIG_NAME_KEY, JSON.stringify(config.value));
    } catch (e) {
      console.warn("[config] Failed to set layout config property", e);
    }
  }

  function resetLayoutConfig() {
    config.value = Object.assign(
      {
        /* empty */
      },
      initial.value
    );
  }

  function overrideLayoutConfig() {
    try {
      const configStr = window.localStorage.getItem(LS_CONFIG_NAME_KEY);
      const parsedConfig = configStr ? JSON.parse(configStr) : {};
      config.value = initial.value = Object.assign(
        {
          /* empty */
        },
        initial.value,
        parsedConfig
      );
    } catch (e) {
      console.warn("[config] Failed to override layout config from localStorage", e);
      // Fallback to initial config on error
      config.value = initial.value;
    }
  }

  return {
    config,
    getLayoutConfig,
    setLayoutConfigProperty,
    resetLayoutConfig,
    overrideLayoutConfig,
  };
});
