# HyLunar
HyLunar is a proxy made in node-minecraft-protocol, this one in specific forwards you to hypixel and intercepts the packet sent on the MC|Brand plugin channel, essentially enabling all blacklisted lunar mods on hypixel such as Freelook, and Auto-Text.

<h1>Will this get me banned?</h1>
No, this will not get you banned. This intercepts the packet sent on the MC|Brand plugin channel which tells Hypixel what your client version is (lunarclient, badlionclient, vanilla, etc), all this does is modify that data before it's sent to the server, so no, it won't get you banned.

<h1>Installation</h1>
The installation is very simple, make sure you have NodeJS 14 installed (https://nodejs.org/en/download/), then open a command prompt and cd to wherever you extracted the HyLunar-master folder, after that type the following commands:
- npm install (This installs all the dependencies for HyLunar)
- node index.js (This starts the proxy)

<h1>Joining the proxy</h1>
Joining the proxy is also very simple, if you have hypixelmods set to false in the config, join localhost, if you have it set to true in the config, join hypixel.net.hypixel.io

<h3>If you have any questions feel free to contact me on discord: deagan#1337</h3>
