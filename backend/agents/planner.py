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

def parse_brief_and_plan(brief: str, customers: list) -> dict:
    """LLM parses brief + customer data -> returns campaign plan."""
    future_time_example = (datetime.now() + timedelta(days=2)).strftime("%d:%m:%y %H:%M:%S")
    prompt = ChatPromptTemplate.from_template(f"""
You are a senior digital marketing strategist for Aetheris, an advanced AI marketing platform.

Campaign Brief: {brief}

Customer Cohort (JSON Preview): {customers}

Your job:
1. Parse the brief and extract key campaign goals, constraints, CTAs.
2. Segment customers into 2-3 groups for A/B testing based on age, location, and activity status.
3. For each segment, recommend:
   - Best send time (must be in format 'DD:MM:YY HH:MM:SS' and a future time in IST)
   - Email tone and style (formal/friendly/urgent)
   - Whether to use emojis
   - Subject line strategy

Return ONLY a valid JSON object with this exact structure (no markdown tags):
{{
  "campaign_goal": "...",
  "product": "...",
  "cta_url": "...",
  "constraints": ["..."],
  "segments": [
    {{
      "segment_id": "A",
      "name": "...",
      "description": "...",
      "customer_ids": ["id1", "id2"],
      "send_time": "{future_time_example}",
      "tone": "formal",
      "use_emoji": false,
      "subject_strategy": "..."
    }}
  ]
}}
""")
    chain = prompt | llm
    try:
        result = chain.invoke({"brief": brief, "customers": json.dumps(customers[:50])})
        content = result.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
        return json.loads(content)
    except Exception as e:
        raise Exception(f"Planner LLM API Error: {str(e)}")

def generate_email_content(segment: dict, product_info: str, cta_url: str) -> dict:
    """Generate subject + body for a specific segment."""
    prompt = ChatPromptTemplate.from_template("""
You are an expert email copywriter for Aetheris.

Segment: {{segment_name}}
Description: {{segment_desc}}
Tone: {{tone}}
Use Emoji: {{use_emoji}}
Product Info: {{product_info}}
CTA URL: {{cta_url}}
Subject Strategy: {{subject_strategy}}

Generate a marketing email based on the product info.
Rules:
- Subject: English text only, no URLs. Max 200 characters.
- Body: English text, emojis allowed if use_emoji=true, MUST include CTA URL: {{cta_url}}
- Apply **bold**, _italic_, __underline__ where impactful
- Keep body under 500 characters
- Make it feel personal and relevant to this segment

Return ONLY valid JSON (no markdown tags):
{{
  "subject": "...",
  "body": "..."
}}
""")
    chain = prompt | llm
    try:
        result = chain.invoke({
            "segment_name": segment.get("name", "Cohort"),
            "segment_desc": segment.get("description", ""),
            "tone": segment.get("tone", ""),
            "use_emoji": str(segment.get("use_emoji", False)).lower(),
            "product_info": product_info,
            "cta_url": cta_url,
            "subject_strategy": segment.get("subject_strategy", "")
        })
        
        content = result.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
        return json.loads(content)
    except Exception as e:
        raise Exception(f"Content Generation LLM API Error: {str(e)}")
