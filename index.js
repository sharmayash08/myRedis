const net = require('net');
const RedisParser = require('redis-parser');
const inMemoryStore = require('./store');

const store = new inMemoryStore();

const server = net.createServer((socket) => {
    // Create a Redis parser instance
    const parser = new RedisParser({
        returnReply: (reply) => {
            let response;

            const [command, key, value] = reply;

            switch (command.toLowerCase()) {
                case "set":
                    store.set(key, value);
                    response = "+OK";
                    break;
                case "get":
                    const result = store.get(key);
                    response = result !== undefined ? `$${result.length}\r\n${result}` : "$-1";
                    break;
                case "del":
                    const deleted = store.del(key);
                    response = deleted ? "+OK" : "$-1";
                    break;
                default:
                    response = "-ERROR: Unknown command";
            }

            // Write response back to the client
            socket.write(response + "\r\n");
        },
        returnError: (error) => {
            socket.write(`-ERROR: ${error.message}\r\n`);
        }
    });

    socket.on("data", (data) => {
        parser.execute(data);
    });
});

server.listen(6379, () => {
    console.log("Server listening on port 6379");
});
