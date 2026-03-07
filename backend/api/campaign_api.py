import os
import httpx
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("CAMPAIGN_API_BASE", "https://campaignx.inxiteout.ai")
API_KEY = os.getenv("CAMPAIGN_API_KEY", "")

def get_headers():
    return {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json"
    }

def signup(team_name: str, team_email: str) -> dict:
    """
    POST /api/v1/signup
    Registers a new team and generates an API key.
    """
    url = f"{BASE_URL}/api/v1/signup"
    payload = {
        "team_name": team_name,
        "team_email": team_email
    }
    response = httpx.post(url, json=payload)
    response.raise_for_status()
    return response.json()

def get_customer_cohort() -> dict:
    """
    GET /api/v1/get_customer_cohort
    Requires API Key. Rate limited 100 calls/day.
    Returns: {"data": [...], "total_count": 5000, "response_code": 200, "message": "..."}
    """
    url = f"{BASE_URL}/api/v1/get_customer_cohort"
    response = httpx.get(url, headers=get_headers())
    response.raise_for_status()
    return response.json()

def send_campaign(subject: str, body: str, customer_ids: List[str], send_time: str) -> dict:
    """
    POST /api/v1/send_campaign
    Submits a campaign.
    Send Time format MUST be 'DD:MM:YY HH:MM:SS' (in IST).
    """
    url = f"{BASE_URL}/api/v1/send_campaign"
    payload = {
        "subject": subject,
        "body": body,
        "list_customer_ids": customer_ids,
        "send_time": send_time
    }
    response = httpx.post(url, headers=get_headers(), json=payload)
    response.raise_for_status()
    return response.json()

def get_report(campaign_id: str) -> dict:
    """
    GET /api/v1/get_report
    Retrieves the report for a campaign.
    """
    url = f"{BASE_URL}/api/v1/get_report"
    params = {"campaign_id": campaign_id}
    response = httpx.get(url, headers=get_headers(), params=params)
    response.raise_for_status()
    return response.json()

def list_endpoints_for_llm() -> str:
    """
    To satisfy the 'dynamic discovery' requirement, we provide a description of the endpoints
    based on the OpenAPI documentation.
    """
    return '''
    Available CampaignX Endpoints:
    1. GET /api/v1/get_customer_cohort
       - Returns list of customers inside the `data` array parameter.
    2. POST /api/v1/send_campaign
       - Body params: `subject` (string max 200 chars), `body` (string max 5000 chars), `list_customer_ids` (List of strings), `send_time` (string formatted 'DD:MM:YY HH:MM:SS' in IST time).
       - Returns `campaign_id`.
    3. GET /api/v1/get_report
       - Query params: `campaign_id` (string).
       - Returns campaign analytics in `data`.
    '''
