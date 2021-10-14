# yt-dlp.js
[![Build Status](https://travis-ci.org/Delivator/yt-dlp.js.svg?branch=master)](https://travis-ci.org/Delivator/yt-dlp.js)
[![npm version](https://badge.fury.io/js/yt-dlp.js.svg)](https://www.npmjs.com/package/yt-dlp.js)

## Installation

### Requirements

FFmpeg has to be installed to PATH

To install yt-dlp.js run `npm install yt-dlp.js --save`

To update the yt-dlp binary, run `npm run updateytdl` or run the setup script (`node setup.js`)

## Usage

```javascript
const ytdl = require("yt-dlp.js");

let url = "https://youtu.be/q5weS3aY-Qc",
    filename = `${new Date().getTime()}.%(ext)s`,
    args = ["-o", filename, "-x", "--audio-format=mp3", "--restrict-filenames", "--external-downloader=ffmpeg", "--audio-quality=96k"];

ytdl(url, args)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
```

## Warning

> If it works, it ain't stupid.

I'm a noob. Don't judge me.
Pullrequests are very welcome!