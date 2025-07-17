from litestar import Controller, post, get, Request
from litestar.response import Stream, Response
from connect import stream_response, analyze_image, thinking_response
from chat_storage import (
    create_new_chat,
    append_message_to_chat,
    get_all_chats,
    get_chat_by_id
)


class ChatController(Controller):
    path = "/chat"

    @post("/stream")
    async def describe_image(self, request: Request) -> Stream:
        form = await request.form()
        file = form.get("file")
        prompt = form.get("prompt", "Describe this image")
        chat_id = form.get("chat_id")
        user = request.headers.get("X-User", "anonymous")

        if file:
            image_bytes = await file.read()
            chunks = analyze_image(image_bytes, prompt)
        else:
            chunks = stream_response(prompt)

        full_response = ""

        async def stream_gen():
            nonlocal full_response
            for chunk in chunks:
                full_response += chunk
                yield chunk

        async def final_stream():
            async for piece in stream_gen():
                yield piece
            if chat_id:
                append_message_to_chat(chat_id, {"text": prompt, "isUser": True})
                append_message_to_chat(chat_id, {"text": full_response, "isUser": False})

        return Stream(content=final_stream())

    @post("/thinking")
    async def thinking(self, request: Request) -> Stream:
        form = await request.form()
        prompt = form.get("prompt", "Please think about the following")
        chat_id = form.get("chat_id")
        user = request.headers.get("X-User", "anonymous")

        chunks = thinking_response(prompt)
        full_response = ""

        async def stream_gen():
            nonlocal full_response
            for chunk in chunks:
                full_response += chunk
                yield chunk

        async def final_stream():
            async for piece in stream_gen():
                yield piece
            if chat_id:
                append_message_to_chat(chat_id, {"text": prompt, "isUser": True})
                append_message_to_chat(chat_id, {"text": full_response, "isUser": False})

        return Stream(content=final_stream())

    @get("/sessions")
    async def list_sessions(self, request: Request) -> Response:
        return Response(content=get_all_chats(), media_type="application/json")

    @get("/{chat_id:str}")
    async def get_chat(self, request: Request, chat_id: str) -> Response:
        chat = get_chat_by_id(chat_id)
        if chat:
            return Response(content=chat, media_type="application/json")
        return Response(content={"error": "Chat not found"}, status_code=404, media_type="application/json")

    @post("/new")
    async def new_chat(self, request: Request) -> Response:
        form = await request.form()
        title = form.get("title", "New Chat")
        chat_id = create_new_chat(title)
        return Response(content={"chat_id": chat_id}, media_type="application/json")

    @post("/{chat_id:str}/message")
    async def add_message(self, request: Request, chat_id: str) -> Response:
        form = await request.form()
        message = {
            "text": form.get("text"),
            "isUser": form.get("isUser") == "true"
        }
        append_message_to_chat(chat_id, message)
        return Response(content={"status": "ok"}, media_type="application/json")
