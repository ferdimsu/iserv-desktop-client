const superagent = require("superagent");
const fs = require("fs");
const { CookieAccessInfo } = require("cookiejar");

/**
 * Represents a client for interacting with the IServ API.
 */
class IservClient {
  /**
   * Creates a new IservClient.
   * @param {Object} options - The options for the client.
   * @param {string} options.sessionFilePath - The path to the session file. (default: "./sessionCookie.json")
   */
  constructor(options) {
    this.client = superagent.agent();
    this.isLoggedIn = false;

    this.options = {
      sessionFilePath: options.sessionFilePath || "./sessionCookie.json",
    };
  }

  loadSessionFromFile() {
    if (!fs.existsSync(this.options.sessionFilePath)) {
      return false;
    }

    console.log("[INFO] using cached session");
    const content = fs.readFileSync(this.options.sessionFilePath, "utf-8");

    const dataJson = JSON.parse(content);
    this.client.jar.setCookie(
      `${dataJson.name}=${dataJson.value}; path=${dataJson.path}; secure; httponly; samesite=lax`,
      "mykhg.de"
    );

    return true;
  }

  saveSessionToFile() {
    const sessionCookie = this.client.jar.getCookie(
      "IServAuthSession",
      new CookieAccessInfo("mykhg.de", "/iserv/auth", true, false)
    );

    fs.writeFile(
      this.options.sessionFilePath,
      JSON.stringify(sessionCookie),
      {
        encoding: "utf-8",
      },
      () => {}
    );
  }

  async restoreSession() {
    if (this.loadSessionFromFile()) {
      this.isLoggedIn = true;
      return Promise.resolve();
    }
    return Promise.reject();
  }

  async login(credentials) {
    // Never throws an error because the response of endpoint is always 200 => no try/catch
    const res = await this.client
      .post("https://mykhg.de/iserv/auth/login")
      .type("form")
      .send({ _username: credentials.username })
      .send({ _password: credentials.password });

    if (res.headers["x-iserv-user"]) {
      this.saveSessionToFile();
      this.isLoggedIn = true;
      return Promise.resolve(res);
    }

    return Promise.reject(res);
  }

  async fetchInbox() {
    try {
      const res = await this.client.get(
        "https://mykhg.de/iserv/mail/api/message/list?path=INBOX&length=50&start=0&order%5Bcolumn%5D=date&order%5Bdir%5D=desc"
      );

      return Promise.resolve(JSON.parse(res.text));
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

module.exports = IservClient;
