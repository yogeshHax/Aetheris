from cerebras.cloud.sdk import Cerebras
from dotenv import load_dotenv
import os

load_dotenv()

def test_cerebras():
    key = os.getenv("CEREBRAS_API_KEY")
    client = Cerebras(api_key=key)
    try:
        completion = client.chat.completions.create(
            messages=[{"role":"user","content":"Hi"}],
            model="llama-3.3-70b",
        )
        print(f"SUCCESS: {completion.choices[0].message.content}")
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    test_cerebras()
