from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from datetime import datetime, timedelta
import json
import os

load_dotenv()

# DEMO STABLE CONFIG
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.1,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_and_optimize(campaigns: list, customers: list, iteration: int) -> dict:
    """Analyze campaign metric results and output the next optimization strategy."""
    future_time_example = (datetime.now() + timedelta(days=2)).strftime("%d:%m:%y %H:%M:%S")
    prompt = ChatPromptTemplate.from_template(f"""
You are a campaign analytics expert for Aetheris.

Previous campaigns and their performance (Open Rate, Click Rate etc): 
{campaigns}

Full customer cohort sample preview: 
{customers}

Optimization run iteration: {iteration}

Analyze the performance metrics (note: Click rate holds 70% weight, Open rate 30% weight) and do the following:
1. Identify which segments performed best and worst.
2. Determine WHY based on variables: time sent, tone used, emoji usage, demographic variations.
3. Suggest new, highly optimized micro-segments using the underperforming cohorts.
4. Suggest content, font, tone, and time changes for the next iteration.
5. Create optimization actions. Ensure the `suggested_send_time` is strictly formatted as 'DD:MM:YY HH:MM:SS' and is a future time in IST.

Return ONLY a valid JSON object with this structure (DO NOT use markdown tags):
{{
  "analysis_summary": "...",
  "top_performing_segment": "...",
  "underperforming_segments": ["..."],
  "optimization_actions": [
    {{
      "action": "retarget",
      "segment_name": "...",
      "customer_ids": ["id1", "id2"],
      "reason": "...",
      "suggested_tone": "...",
      "suggested_send_time": "{future_time_example}",
      "content_changes": "..."
    }}
  ]
}}
""")

    chain = prompt | llm
    
    # Restrict customers sent for context-safety
    try:
        customers_str = json.dumps(customers[:50])
    except:
        customers_str = "[]"
        
    try:
        campaigns_str = json.dumps(campaigns)
    except:
        campaigns_str = "[]"
        
    try:
        result = chain.invoke({
            "campaigns": campaigns_str,
            "customers": customers_str,
            "iteration": iteration
        })
        
        content = result.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
            
        return json.loads(content)
    except Exception as e:
        raise Exception(f"Analyzer LLM API Error: {str(e)}")
