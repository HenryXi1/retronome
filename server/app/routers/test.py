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
        <div>
            <label for=\"roomCode\">Room Code: </label>
            <input type=\"text\" id=\"roomCode\" placeholder=\"Enter room code\" />
        </div>
        <div id=\"messages\"></div>
        <button onclick=\"sendCreate()\">Create Room</button>
        <button onclick=\"sendJoin()\">Join Room</button>
        <button onclick=\"sendStartGame()\">Start Game</button>
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
            function getRoomCode() {
                return document.getElementById('roomCode').value || '';
            }
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
                var roomCode = getRoomCode();
                var jsonMsg = {
                    "type": "join_room",
                    "room_id": roomCode,
                    "player_name": "test1"
                };
                ws.send(JSON.stringify(jsonMsg));
                var messages = document.getElementById('messages');
                var sentMsg = document.createElement('div');
                sentMsg.textContent = '[SEND] ' + JSON.stringify(jsonMsg);
                sentMsg.style.color = 'gray';
                messages.appendChild(sentMsg);
            }
            function sendStartGame() {
                var roomCode = getRoomCode();
                var jsonMsg = {
                    "type": "start_game"
                };
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
