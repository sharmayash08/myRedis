const net = require('net');
const inMemoryStore = require('./store');

const store = new inMemoryStore;

const server = net.createServer((socket) => {
    socket.on("data" , (data) => {
        const [command , key , value] = data.toString().trim().split(" ");

        let response;

        switch (command) {
            case "set":
                response = store.set(key , value);
                break;
            case "get":
                response = store.get(key);
                break;
            case "del":
                response = store.del(key);
                break;
            default:
                response = "UNKNOWN COMMAND";
                break;
        }

        socket.write(response + "\n");
    });
});

server.listen(8000 , () => {
    console.log('Server is listening on port 8000');
});