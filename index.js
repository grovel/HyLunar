var mc = require("minecraft-protocol");
const states = mc.states;

const srv = mc.createServer({
	"online-mode": true,
	host: "localhost",
	port: 25565,
	keepAlive: false,
	version: "1.8.9",
});

srv.on("login", function (client) {
	console.log(client.profile.properties);
	const addr = client.socket.remoteAddress;
	console.log("Incoming connection", "(" + addr + ")");
	let endedClient = false;
	let endedTargetClient = false;
	client.on("end", function () {
		endedClient = true;
		console.log("Connection closed by client", "(" + addr + ")");
		if (!endedTargetClient) {
			targetClient.end("End");
		}
	});
	client.on("error", function (err) {
		endedClient = true;
		console.log("Connection error by client", "(" + addr + ")");
		console.log(err.stack);
		if (!endedTargetClient) {
			targetClient.end("Error");
		}
	});

	const targetClient = mc.createClient({
		host: "hypixel.net",
		port: 25565,
		username: "", //CHANGE THIS TO YOUR MINECRAFT EMAIL
		password: "", //CHANGE THIS TO YOUR MINECRAFT PASSWORD
		keepAlive: false,
		version: "1.8.9",
	});
	client.on("packet", function (data, meta) {
		if (targetClient.state === states.PLAY && meta.state === states.PLAY) {
			if (!endedTargetClient) {
				targetClient.write(meta.name, data);
			}
		}
	});

	targetClient.on("packet", function (data, meta) {
		if (meta.name === 'custom_payload' && data.channel === 'MC|Brand') {
			data.data = Buffer.from('<XeBungee (git:XeBungee-Bootstrap:1.16-R0.5-SNAPSHOT:a2e1df4)')
		  }
		if (meta.state === states.PLAY && client.state === states.PLAY) {
			if (!endedClient) {
				client.write(meta.name, data);
				if (meta.name === "login") {
				}
				if (meta.name === "set_compression") {
					client.compressionThreshold = data.threshold;
				}
			}
		}
	});

	const bufferEqual = require("buffer-equal");
	targetClient.on("raw", function (buffer, meta) {
		if (client.state !== states.PLAY || meta.state !== states.PLAY) {
			return;
		}
		const packetData =
			targetClient.deserializer.parsePacketBuffer(buffer).data.params;
		const packetBuff = client.serializer.createPacketBuffer({
			name: meta.name,
			params: packetData,
		});
		if (!bufferEqual(buffer, packetBuff)) {
			console.log(
				"client<-server: Error in packet " + meta.state + "." + meta.name
			);
			console.log("received buffer", buffer.toString("hex"));
			console.log("produced buffer", packetBuff.toString("hex"));
			console.log("received length", buffer.length);
			console.log("produced length", packetBuff.length);
		}
	});
	client.on("raw", function (buffer, meta) {
		if (meta.state !== states.PLAY || targetClient.state !== states.PLAY) {
			return;
		}
		const packetData =
			client.deserializer.parsePacketBuffer(buffer).data.params;
		const packetBuff = targetClient.serializer.createPacketBuffer({
			name: meta.name,
			params: packetData,
		});
		if (!bufferEqual(buffer, packetBuff)) {
			console.log(
				"client->server: Error in packet " + meta.state + "." + meta.name
			);
			console.log("received buffer", buffer.toString("hex"));
			console.log("produced buffer", packetBuff.toString("hex"));
			console.log("received length", buffer.length);
			console.log("produced length", packetBuff.length);
		}
	});
	targetClient.on("end", function () {
		endedTargetClient = true;
		console.log("Connection closed by server", "(" + addr + ")");
		if (!endedClient) {
			client.end("End");
		}
	});
	targetClient.on("error", function (err) {
		endedTargetClient = true;
		console.log("Connection error by server", "(" + addr + ") ", err);
		console.log(err.stack);
		if (!endedClient) {
			client.end("Error");
		}
	});
});
