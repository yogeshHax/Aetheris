import os
from langchain.tools import tool
from api.campaign_api import (
    get_customer_cohort, 
    send_campaign, 
    get_report, 
    list_endpoints_for_llm
)
import datetime

@tool
def fetch_customer_cohort() -> str:
    """
    Fetch all customers with demographic details from CampaignX API.
    Use this to get the cohort data for segmentation.
    """
    try:
        response = get_customer_cohort()
        return str(response.get("data", []))
    except Exception as e:
        return f"Error fetching customers: {e}"

@tool
def list_available_api_tools() -> str:
    """
    Dynamically list all available CampaignX API endpoints from the OpenAPI specification to satisfy the dynamic discovery requirement.
    """
    return list_endpoints_for_llm()

@tool
def execute_campaign(subject: str, body: str, customer_ids: str, send_time: str) -> str:
    """
    Submit a new marketing campaign to a targeted customer cohort.
    Args:
        subject (str): Email subject. Max 200 chars. Supports text and emojis.
        body (str): Email body. Max 5000 chars. Supports text, emojis, and urls.
        customer_ids (str): Comma-separated list of customer IDs string. e.g. "CUST001, CUST002"
        send_time (str): Planned send time in format 'DD:MM:YY HH:MM:SS' (IST). MUST be future time.
    """
    # Parse the comma separated string to list format
    ids_list = [c.strip() for c in customer_ids.split(",") if c.strip()]
    
    try:
        result = send_campaign(subject, body, ids_list, send_time)
        return str(result)
    except Exception as e:
        return f"Error scheduling campaign: {e}"

@tool
def fetch_campaign_report(campaign_id: str) -> str:
    """
    Retrieve campaign report data for an existing campaign.
    Args:
        campaign_id (str): The string campaign ID returned when executing the campaign.
    """
    try:
        return str(get_report(campaign_id))
    except Exception as e:
        return f"Error fetching report: {e}"
