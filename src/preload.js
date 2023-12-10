// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("iserv", {
  fetchInbox: async () => await ipcRenderer.invoke("fetch-inbox"),
  login: async (auth) => await ipcRenderer.invoke("login", auth),
  session: async (auth) => await ipcRenderer.invoke("session"),
});
