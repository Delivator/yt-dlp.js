const { existsSync } = require("fs");
const ytdlp = require("./index.js");

const versionFile = __dirname + "/bin/version.json";
const alreadyInstalled = existsSync(versionFile);

if (alreadyInstalled) {
  console.log("Checking for yt-dlp updates...");
} else {
  console.log("Downloading yt-dlp...");
}

ytdlp.updateBinary()
  .then((callback) => {
    if (callback.isUpToDate) {
      console.log(`yt-dlp version ${callback.version} is already up-to-date`)
    } else {
      if (alreadyInstalled) {
        console.log(`Updated yt-dlp to version ${callback.version} (${callback.time}s)`);
      } else {
        console.log(`Downloaded yt-dlp version ${callback.version} (${callback.time}s)`);
      }
    }
  })
  .catch(console.error);