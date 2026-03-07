from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

def test_orbit():
    llm = ChatOpenAI(
        model=os.getenv("MODEL_NAME", "gemini-2.5-flash-lite"),
        openai_api_key=os.getenv("ORBIT_API_KEY"),
        openai_api_base=os.getenv("ORBIT_BASE_URL", "https://api.orbit-provider.com/v1"),
        temperature=0.3
    )
    try:
        res = llm.invoke("Hello, respond in 3 words.")
        print(f"SUCCESS: {res.content}")
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    test_orbit()
