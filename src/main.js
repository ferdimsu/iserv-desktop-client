const dotenv = require("dotenv");
const { app, BrowserWindow, ipcMain } = require("electron");

dotenv.config({ path: "./.env" });

const createMainWindow = require("./util/createMainWindow");
const IservClient = require("./util/IservClient");

// Create iserv client
const iservClient = new IservClient({});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let devInboxCache = {};

/*
##########################
ipcMain Handler functions
#########################
*/

ipcMain.handle("restore-session", async (e) => {
  console.log("[INFO] restore-session (ipcMain)");

  try {
    await iservClient.restoreSession();
    console.log("[INFO] restore-session (ipcMain) - success");
    return true;
  } catch (err) {
    return false;
  }
});

ipcMain.handle("login", async (e, auth) => {
  console.log("[INFO] login (ipcMain)");

  // sleep for one second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    await iservClient.login({
      username: auth.username,
      password: auth.password
    });
    return true;
  } catch (err) {
    return false;
  }
});

ipcMain.handle("fetch-inbox", async (e) => {
  if (
    process.env.NODE_ENV === "development" &&
    Object.keys(devInboxCache).length > 0
  ) {
    // return cached data
    console.log("[INFO] fetch-inbox (ipcMain) - cached data");
    return devInboxCache;
  }

  console.log("[INFO] fetch-inbox (ipcMain)");

  try {
    // prod: return await iservClient.fetchInbox();
    // dev: return cached data
    devInboxCache = await iservClient.fetchInbox();
    return devInboxCache;
  } catch (e) {
    console.log(e, "Error: Failed to fetch inbox or session tempered");
    return {};
  }
});

ipcMain.handle("fetch-user-info", async (e, username) => {
  console.log("[INFO] fetch-user-info (ipcMain)");

  try {
    return await iservClient.fetchUserInfo(username);
  } catch (e) {
    console.log(e, "Error: Failed to fetch user info or session tempered");
    return {};
  }
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    // On macOS, it's common to re-create a window in the app when the
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
