// src/stores/adminStore.ts
import { defineStore } from "pinia";

export interface AdminState {
  token: string | unknown;
  username: string | unknown;
  userId?: string | unknown;
  permissionCode?: string[] | unknown;
  userCode?: string | unknown;
}

export const useAdminStore = defineStore("admin", {
  state: (): AdminState => ({
    token: null, // JSON Web Token for user's session
    userId: null, // Unique identifier for the user
    permissionCode: null, // An array of permission codes
    username: null, // User's full name
    userCode: null, // User's code or username
  }),

  actions: {
    // Action to set the user login data
    login(data: AdminState) {
      this.token = data.token;
      this.userId = data.userId;
      this.permissionCode = data.permissionCode;
      this.username = data.username;
      this.userCode = data.userCode;
    },

    // Action to clear the user login data on logout
    logout() {
      this.token = null;
      this.userId = null;
      this.permissionCode = null;
      this.username = null;
      this.userCode = null;
    },
  },
});
