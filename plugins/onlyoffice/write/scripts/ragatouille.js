let client = null;
let connected = false;

function connectClick() {
    const statusElement = document.getElementById('status');
    const connectButton = document.querySelector('button');

    if (!connected) {
        client = new WebSocketClient('ws://localhost:8000/extensions/ws');

        client.onOpen = () => {
            statusElement.textContent = 'Connected';
            connectButton.textContent = 'Disconnect';
            connected = true;

            client.send(JSON.stringify({ type: "ping", payload: "Ping message" }));
        };

        client.onClose = () => {
            statusElement.textContent = 'Disconnected';
            connectButton.textContent = 'Connect';
            connected = false;
            client = null;
        };

        client.onError = (error) => {
            console.error('WebSocket Error:', error);
            statusElement.textContent = 'Error connecting';
        };

        client.onMessage = (event) => {
            console.log('Message from server:', event.data);
        };

        client.connect();
    } else {
        if (client) {
            client.disconnect();
        }
    }
}