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
        <button onclick="sendCreate()">Create Room</button>
        <button onclick="sendJoin()">Join Room</button>
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
            function sendCreate() {
                var jsonMsg = { "type": "create_room", "player_name": "test" };
                ws.send(JSON.stringify(jsonMsg));
                var messages = document.getElementById('messages');
                var sentMsg = document.createElement('div');
                sentMsg.textContent = '[SEND] ' + JSON.stringify(jsonMsg);
                sentMsg.style.color = 'gray';
                messages.appendChild(sentMsg);
            }
            function sendJoin() {
                var jsonMsg = { "type": "join_room", "room_id": "CEUK", "player_name": "test1" };
                ws.send(JSON.stringify(jsonMsg));
                var messages = document.getElementById('messages');
                var sentMsg = document.createElement('div');
                sentMsg.textContent = '[SEND] ' + JSON.stringify(jsonMsg);
                sentMsg.style.color = 'gray';
                messages.appendChild(sentMsg);
            }
        </script>
    </body>
</html>
"""


@router.get('/')
async def get():
    return HTMLResponse(html)
