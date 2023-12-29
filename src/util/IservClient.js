const superagent = require("superagent");
const fs = require("fs");
const { CookieAccessInfo } = require("cookiejar");

const logger = require("./logger");

/**
 * Represents a client for interacting with the IServ API.
 */
class IservClient {
  /**
   * Creates a new IservClient.
   * @param {Object} options - The options for the client.
   */
  constructor(options) {
    this.client = superagent.agent();

    this.options = {
      sessionFilePath: options.sessionFilePath || "./sessionCookie.json",
      host: options.host || "mykhg.de",
    };
  }

  loadSessionFromFile() {
    if (!fs.existsSync(this.options.sessionFilePath)) {
      return false;
    }

    logger.info("loadSessionFromFile (IservClient) - session file exists");

    const content = fs.readFileSync(this.options.sessionFilePath, "utf-8");

    const dataJson = JSON.parse(content);
    this.client.jar.setCookie(
      `${dataJson.name}=${dataJson.value}; path=${dataJson.path}; secure; httponly; samesite=lax`,
      this.options.host,
    );

    return true;
  }

  saveSessionToFile() {
    const sessionCookie = this.client.jar.getCookie(
      "IServAuthSession",
      new CookieAccessInfo("mykhg.de", "/iserv/auth", true, false),
    );

    fs.writeFile(
      this.options.sessionFilePath,
      JSON.stringify(sessionCookie),
      {
        encoding: "utf-8",
      },
      () => {
        logger.success("saveSessionToFile (IservClient) - session file saved");
      },
    );
  }

  async restoreSession() {
    if (this.loadSessionFromFile()) {
      try {
        const res = await this.client.get(`https://${this.options.host}/iserv`);
        if (res.headers["x-iserv-user"]) {
          logger.success(
            "restoreSession (IservClient) - found valid session file",
          );
          return Promise.resolve(res.headers["x-iserv-user"]);
        }
      } catch (e) {
        logger.fail(
          "restoreSession (IservClient) - found invalid session file",
        );

        fs.rmSync(this.options.sessionFilePath);
      }
    }

    logger.info("restoreSession (IservClient) - no session file found");
    return Promise.reject();
  }

  async login(credentials) {
    // Never throws an error because the response of endpoint is always 200 => no try/catch
    const res = await this.client
      .post(`https://${this.options.host}/iserv/auth/login`)
      .type("form")
      .send({ _username: credentials.username })
      .send({ _password: credentials.password });

    if (res.headers["x-iserv-user"]) {
      this.saveSessionToFile();
      logger.success("login (IservClient) - success");

      return Promise.resolve(res);
    }

    logger.fail("login (IservClient) - failed");
    return Promise.reject(res);
  }

  async fetchInbox() {
    try {
      const res = await this.client.get(
        `https://${this.options.host}/iserv/mail/api/message/list?path=INBOX&length=50&start=0&order%5Bcolumn%5D=date&order%5Bdir%5D=desc`,
      );

      return Promise.resolve(JSON.parse(res.text));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async fetchMail(mailId) {
    try {
      const res = await this.client.get(
        `https://${this.options.host}/iserv/mail/api/message?path=INBOX&msg=${mailId}`,
      );

      return Promise.resolve(JSON.parse(res.text));
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

module.exports = IservClient;
