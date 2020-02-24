require('dotenv').config();
const http = require('http');
const App = require('./app/app.js');

class Server {
    constructor() {
        this.app = new App();

        this.configureAppServer = this.configureAppServer.bind(this);

    }

    configureAppServer() {
        this.app.configure()
            .then(() => {
                this.server = http.createServer(this.app.getApp());
                this.server.listen(process.env.PORT || 3000, () => {
                    console.log(`University Demo server is running at http://localhost:${process.env.PORT}`);
                })
            })
            .catch(err => { console.log(err) });
    }
}

let server = new Server();
server.configureAppServer();