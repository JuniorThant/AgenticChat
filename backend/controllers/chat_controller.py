from litestar import Controller, post, get
from litestar.response import Stream
from connect import stream_response

class ChatController(Controller):
    path="/chat"

    @post("/message")
    async def send_message(self,data:dict)->Stream:
        prompt=data.get("message","")
        return Stream(content=stream_response(prompt))
