const ytdl = require("./index.js");

console.log("Updating yt-dlp binary...");

ytdl.updateBinary()
  .then(output => {
    console.log(`yt-dlp updated to version ${output.version} (${output.time}s)`);
  })
  .catch(console.error);