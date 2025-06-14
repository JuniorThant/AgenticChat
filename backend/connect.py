from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model=genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction="You are the AI of the chatbot application, therefore, be wise and sharp"
)

def stream_response(prompt:str):
    response=model.start_chat().send_message(prompt,stream=True)
    for chunk in response:
        yield chunk.text if chunk.text else ""