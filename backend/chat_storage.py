import json
import os
from datetime import datetime
import uuid

CHAT_FILE = "chat_sessions.json"

if not os.path.exists(CHAT_FILE):
    with open(CHAT_FILE, "w") as f:
        json.dump([], f)

def create_new_chat(title="Untitled"):
    with open(CHAT_FILE, "r") as f:
        sessions = json.load(f)
    
    chat_id = str(uuid.uuid4())
    session = {
        "id": chat_id,
        "title": title,
        "messages": [],
        "timestamp": datetime.now().isoformat()
    }

    sessions.append(session)

    with open(CHAT_FILE, "w") as f:
        json.dump(sessions, f, indent=2)
    
    return chat_id

def append_message_to_chat(chat_id, message):
    with open(CHAT_FILE, "r") as f:
        sessions = json.load(f)

    for session in sessions:
        if session["id"] == chat_id:
            session["messages"].append(message)

            if (
                message.get("isUser")
                and session["title"].lower() in {"untitled", "untitled chat"}
                and len(session["messages"]) == 1
            ):
                raw_text = message["text"].strip()
                session["title"] = " ".join(raw_text.split()[:6]) + ("..." if len(raw_text.split()) > 6 else "")
            break

    with open(CHAT_FILE, "w") as f:
        json.dump(sessions, f, indent=2)


def get_all_chats():
    with open(CHAT_FILE, "r") as f:
        return json.load(f)

def get_chat_by_id(chat_id):
    with open(CHAT_FILE, "r") as f:
        sessions = json.load(f)

    for session in sessions:
        if session["id"] == chat_id:
            return session

    return None
