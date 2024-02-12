# HLedger Viewer

![Screenshot 2024-02-12 at 12 17 23](https://github.com/matthewroche/hledger-viewer/assets/7015238/456f799d-0e42-4c89-a021-743dcd9cba54)

## What is hledger?
[hledger](https://hledger.org) is a terminal based program enabling double entry accounting on the command line, following the [Plain Text Accounting](https://plaintextaccounting.org) philosophy. In their own words hledger is “free GPL-licensed accounting software that runs on unix, mac, windows and the web based on readable, version-controllable, future-proof plain text files”

## What is hledger viewer?
hledger itself allows users to produce reports in the terminal, but these are not easy to share and can be intimidating or confusing when shared with those less technically minded. hledger-viewer provides a modern, web-based and mobile friendly interface into the basic hledger reports and displays some simple graphs. The reports are printable. The periods of time covered and reporting intervals are easily adjusted. 

## Where can I run hledger-viewer?
Binaries are provided for Linux, MacOS and Alpine operating systems. The project is open source if you wish to build your own binary. 

## Are you affiliated with hLedger?
No

## What is the projects status?
Currently in Alpha. Expect bugs and major changes. 

## How to I run hLedger-viewer?
1. [Download the binary](https://github.com/matthewroche/hledger-viewer/releases) for your operating system. For example `wget https://github.com/matthewroche/hledger-viewer/releases/download/v0.0.3-alpha/hledger-viewer-alpine-x64 `
2. Allow execution of the binary eg `chmod u+x hledger-viewer-alpine-x64`
3. Run the executable eg `./hledger-viewer-alpine-x64 `
4. Go to `http://localhost:3200`

## Which options are there for the executable?
* `--origin` defines which origins to include in the site’s `Access-Control-Allow-Origin `header. By default only localhost is allowed. 
* `--port` defines which port the webpage is served on. The default is 3200.
* `--dev` tells the server to listen on all interfaces. By default it only listens on `localhost`

# How secure is this?
This project is still in development and provides no guarantees regarding security. You are responsible for securing the server endpoint. By default the server only listens on the localhost interface, which helps prevent unintended access from elsewhere in your network. However, there is no authentication provided, so anyone with access to the server endpoint can see your data.

## How does hledger-viewer work?
This is a very simple app. The server is written in javascript using [express](https://expressjs.com). This runs hledger commands in the background, producing CSV data. This is parsed and served as an API. The frontend webpage is written in [Vue](https://vuejs.org), and displays data from the above API.

## Contributing
hledger-viewer was started as a hobby project by a self-taught coder with no professional experience. The code is average at best and likely laden with bugs. With that caveat, if you wish to contribute feel free to send a pull request. 

The app uses a traditional [Vue](https://vuejs.org) app structure. All the server code is held within `server.js`. `npm run dev`will get you going once you have pulled the project locally. The development site is served on port 5173.

To build the binaries make sure you have [pkg](https://github.com/vercel/pkg) available and type `npm run build-release.` A build folder containing the binaries will be produced.
