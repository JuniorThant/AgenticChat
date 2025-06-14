from litestar import Litestar
from litestar.config.cors import CORSConfig
from controllers.chat_controller import ChatController

cors_config = CORSConfig(
    allow_origins=["*"], 
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["*"]
)

app = Litestar(
    route_handlers=[
        ChatController
    ],
    cors_config=cors_config
)