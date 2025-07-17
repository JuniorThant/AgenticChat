from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

text_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", 
    system_instruction="Your name is Agentic Chatbot and you are the AI of the chatbot application, therefore, be wise and sharp"
)

vision_model = genai.GenerativeModel("gemini-1.5-flash")

thinking_model=genai.GenerativeModel("gemini-2.0-flash-001")

def stream_response(prompt:str):
    response=text_model.start_chat().send_message(prompt,stream=True)
    for chunk in response:
        yield chunk.text if chunk.text else ""

def analyze_image(image_bytes:bytes,prompt:str):
    image_part = {
        "mime_type": "image/jpeg",  
        "data": image_bytes
    }

    response = vision_model.generate_content(
        [prompt, image_part],
        stream=True
    )
    for chunk in response:
        yield chunk.text if chunk.text else ""

def thinking_response(prompt: str):
        response = thinking_model.generate_content([prompt], stream=True)
        for chunk in response:
            yield chunk.text if chunk.text else ""







