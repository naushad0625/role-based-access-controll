require("dotenv").config();
const http = require("http");
const App = require("./app/app.js");
const consola = require("consola");

class Server {
    constructor() {
        this.app = new App();
        this.configureAppServer = this.configureAppServer.bind(this);
    }

    async configureAppServer() {
        try {
            await this.app.configure();
            this.server = http.createServer(this.app.getApp());
            this.server.listen(process.env.PORT, () => {
                console.log(
                    `Server is running at http://localhost:${process.env.PORT}`,
                );
            });
        } catch (error) {
            consola.error(error);
        }
    }
}

let server = new Server();
server.configureAppServer();
