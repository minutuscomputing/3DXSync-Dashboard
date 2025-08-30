import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    title: "Application",
    searchInput: "",
    snackbar: {
      visible: false,
      message: "",
      color: "success", // 'success' | 'error' | 'info' | etc.
      timeout: 3000,
    },
  }),

  actions: {
    setTitle(title) {
      this.title = title;
    },

    setSearchInput(value) {
      this.searchInput = value;
    },

    showSnackbar(message, color = "success", timeout = 3000) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.timeout = timeout;
      this.snackbar.visible = true;
    },

    hideSnackbar() {
      this.snackbar.visible = false;
    },
  },
});