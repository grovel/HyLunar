const Proxy = require("./Proxy");

const config = require("config");

const configfile = {
	email: config.get("email"),
	password: config.get("password"),
	auth: config.get("auth"),
	port: config.get("port"),
	hypixelmods: config.get("hypixelmods"),
};

const proxy = new Proxy(
	configfile.email,
	configfile.password,
	configfile.auth,
	configfile.port,
	configfile.hypixelmods
);

proxy.start();
