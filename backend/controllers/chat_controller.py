from litestar import Controller, post, Request
from litestar.response import Stream, Response
from connect import stream_response, analyze_image, thinking_response

class ChatController(Controller):
    path = "/chat"

    @post("/stream")
    async def describe_image(self, request: Request) -> Stream:
        form = await request.form()
        file = form.get("file")
        prompt = form.get("prompt", "Describe this image")

        if file:
            image_bytes = await file.read()
            return Stream(content=analyze_image(image_bytes, prompt))
        else:
            return Stream(content=stream_response(prompt))

    @post("/thinking")
    async def thinking(self,request:Request)->Stream:
        form=await request.form()
        prompt=form.get("prompt","Please think about the following")
        thinking_content=thinking_response(prompt)
        return Stream(content=thinking_content)
