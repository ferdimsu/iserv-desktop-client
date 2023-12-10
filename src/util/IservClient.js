const superagent = require("superagent");
const fs = require("fs");
const { CookieAccessInfo } = require("cookiejar");

class IservClient {
  constructor(credentials) {
    this.client = superagent.agent();
    this.credentials = credentials;
    this.isLoggedIn = false;
  }

  setAuth(credentials) {
    this.credentials = credentials;
  }

  loadSession() {
    if (!fs.existsSync("./sessionCookie.json")) return false;

    console.log("using cached session");

    const content = fs.readFileSync("./sessionCookie.json", "utf-8");

    const dataJson = JSON.parse(content);
    this.client.jar.setCookie(
      `${dataJson.name}=${dataJson.value}; path=${dataJson.path}; secure; httponly; samesite=lax`,
      "mykhg.de"
    );

    return true;
  }

  saveSession() {
    const sessionCookie = this.client.jar.getCookie(
      "IServAuthSession",
      new CookieAccessInfo("mykhg.de", "/iserv/auth", true, false)
    );

    fs.writeFile(
      "./sessionCookie.json",
      JSON.stringify(sessionCookie),
      {
        encoding: "utf-8",
      },
      () => {}
    );
  }

  async login() {
    if (this.loadSession()) {
      this.isLoggedIn = true;
      return Promise.resolve();
    }

    const res = await this.client
      .post("https://mykhg.de/iserv/auth/login")
      .type("form")
      .send({ _username: this.credentials.username })
      .send({ _password: this.credentials.password });

    if (res.headers["x-iserv-user"]) {
      this.saveSession();
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
