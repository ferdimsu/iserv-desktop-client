const dotenv = require("dotenv");
const { app, BrowserWindow, ipcMain } = require("electron");

dotenv.config({ path: "./.env" });

const createMainWindow = require("./util/createMainWindow");
const IservClient = require("./util/IservClient");

// Create iserv client
const iservClient = new IservClient({});

// for development
let devCacheInbox = [];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

/*
##########################
ipcMain Handler functions
#########################
*/

async function tryLogin() {
  try {
    await iservClient.login();
    return true;
  } catch (e) {
    return false;
  }
}

ipcMain.handle("session", async (e) => {
  return await tryLogin();
});

ipcMain.handle("login", async (e, auth) => {
  iservClient.setAuth({ username: auth.username, password: auth.password });
  return await tryLogin();
});

ipcMain.handle("fetch-inbox", async (e) => {
  // for development and ddos reasons
  // => caching the inbox
  if (devCacheInbox.length === 0) {
    console.log("actually requesting");
    try {
      const inbox = await iservClient.fetchInbox();

      // for development
      devCacheInbox = inbox;

      return devCacheInbox;
    } catch (e) {
      console.log(e, "Error: Failed to fetch inbox or session tempered");
    }
  }

  return devCacheInbox;
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
