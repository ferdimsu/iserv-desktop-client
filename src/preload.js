// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("iserv", {
  restoreSession: async () => await ipcRenderer.invoke("restore-session"),
  login: async (auth) => await ipcRenderer.invoke("login", auth),
  fetchInbox: async () => await ipcRenderer.invoke("fetch-inbox"),
  fetchUserInfo: async (username) =>
    await ipcRenderer.invoke("fetch-user-info", username),
});
