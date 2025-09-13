from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>FastAPI WebSocket JSON Test</title>
    </head>
    <body>
        <h1>WebSocket JSON Test Client</h1>
        <div id="messages"></div>
        <input
            type="text"
            id="messageText"
            placeholder='Type a message (will be sent as JSON)...'
        >
        <button onclick="sendMessage()">Send JSON</button>
        <script>
            var ws = new WebSocket("ws://localhost:8000/game/");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages');
                var message = document.createElement('div');
                try {
                    var data = JSON.parse(event.data);
                    message.textContent = '[RECV] ' + JSON.stringify(data);
                } catch (e) {
                    message.textContent = '[RECV] ' + event.data;
                }
                messages.appendChild(message);
            };
            function sendMessage() {
                var input = document.getElementById('messageText');
                var text = input.value;
                var jsonMsg = {"message": text};
                ws.send(JSON.stringify(jsonMsg));
                var messages = document.getElementById('messages');
                var sentMsg = document.createElement('div');
                sentMsg.textContent = '[SEND] ' + JSON.stringify(jsonMsg);
                sentMsg.style.color = 'gray';
                messages.appendChild(sentMsg);
                input.value = '';
            }
        </script>
    </body>
</html>
"""


@router.get('/')
async def get():
    return HTMLResponse(html)
