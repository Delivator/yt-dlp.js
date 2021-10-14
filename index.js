const fs = require("fs");
const got = require("got");
const { execFile } = require("child_process");

const isWin = /^win/.test(process.platform);

function getLatestRemote() {
  return new Promise((resolve, reject) => {
    const API_URL = "https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest";
    got.get(API_URL)
      .then(response => {
        if (response.statusCode === 200) {
          const json_body = JSON.parse(response.body);
          resolve(json_body.tag_name);
        } else {
          reject(response.body);
        }
      })
      .catch(reject);
  });
}

function getBinaryVersion() {
  return new Promise((resolve, reject) => {
    let binaryPath = __dirname + "/bin/yt-dlp";
    if (isWin) binaryPath += ".exe";
    if (!fs.existsSync(binaryPath)) {
      reject("Couldn't find yt-dlp binary. Try running 'npm run updateytdlp'");
    }
    execFile(binaryPath, ["--version"], (error, stdout, stderr) => {
      if (error) reject(error);
      const version = stdout.replace(/\r?\n|\r/g, "");
      resolve(version);
    });
  });
}

function downloadBinary() {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(__dirname + "/bin")) fs.mkdirSync(__dirname + "/bin");
      
      const latestVersion = await getLatestRemote();
      let url = `https://github.com/yt-dlp/yt-dlp/releases/download/${latestVersion}/yt-dlp`;
      let filePath = __dirname + "/bin/yt-dlp";
      
      if (isWin) {
        filePath += ".exe"
        url += ".exe"
      }

      got(url, { followRedirect: true, responseType: "buffer" })
        .then(resp => {
          fs.writeFileSync(filePath, resp.body, { mode: 0755 });
          resolve();
        });
    } catch (error) {
      reject(error);
    }
  });
}

run = (url, args, options) => {
  return new Promise((resolve, reject) => {
    let binaryPath = __dirname + "/bin/yt-dlp";
    args.push(url);
    if (isWin) binaryPath += ".exe";
    if (!fs.existsSync(binaryPath)) {
      reject("Couldn't find yt-dlp binary. Try running 'npm run updateytdlp'");
    }
    execFile(binaryPath, args, options, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout.trim());
    });
  });
};

run.updateBinary = () => {
  return new Promise(async (resolve, reject) => {
    const startTime = new Date().getTime();
    const versionFile = __dirname + "/bin/version.json";
    let currentVersion = "0";

    try {
      const latestRemote = await getLatestRemote();
      if (fs.existsSync(versionFile)) {
        currentVersion = require(versionFile).version;
      }
      if (new Date(latestRemote).getTime() > new Date(currentVersion).getTime()) {
        await downloadBinary();
        const version = await getBinaryVersion();
        fs.writeFileSync(versionFile, JSON.stringify({ version }, null, 2));
        resolve({ time: (new Date().getTime() - startTime) / 1000, version });
      } else {
        resolve({ time: (new Date().getTime() - startTime) / 1000, version: currentVersion });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = run;
