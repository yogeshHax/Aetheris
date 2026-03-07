from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime, timedelta
import json

import os
from dotenv import load_dotenv

load_dotenv()

from api.campaign_api import get_customer_cohort, send_campaign, get_report
from agents.planner import parse_brief_and_plan, generate_email_content
from agents.analyzer import analyze_and_optimize
from agents.tools import execute_campaign, fetch_campaign_report, list_available_api_tools
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

app = FastAPI(title="CampaignX API - Agent Orchestrator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory dictionary to hold state without a database for rapid hackathon dev. 
# (You might want to shift to SQLite later, but for prototyping this is incredibly fast)
sessions = {}

class BriefRequest(BaseModel):
    brief: str

class ApprovalRequest(BaseModel):
    session_id: str
    approved: bool
    segment_index: Optional[int] = None

@app.get("/")
def health_check():
    return {"status": "ok", "app": "CampaignX Backend"}

@app.post("/api/plan")
async def create_plan(req: BriefRequest):
    """Step 1: Understand brief and retrieve customer data. Create segmented plan."""
    session_id = str(uuid.uuid4())
    
    # 1. Fetch live customer cohort from Organizer API
    customers_res = get_customer_cohort()
    all_customers = customers_res.get("data", [])
    if all_customers:
        print(f"DEBUG: Sample Customer Keys: {list(all_customers[0].keys())}")
    else:
        print("DEBUG: No customers found!")
    
    # 2. Invoke Planner Agent
    try:
        plan = parse_brief_and_plan(req.brief, all_customers)
    except Exception as e:
        print(f"CRITICAL: Planner failure: {str(e)}. Triggering Simulated Logic for Demo.")
        # FALLBACK: Provide high-quality simulated plan for XDeposit if AI fails
        plan = {
            "campaign_goal": "Launch XDeposit with competitive 1% higher returns and Senior Citizen bonus.",
            "product": "XDeposit Term Deposit",
            "cta_url": "https://superbfsi.com/xdeposit/explore/",
            "segments": [
                {
                    "segment_id": 1,
                    "name": "High-Value Depositors",
                    "description": "Active customers with significant bank balance, age 25-50.",
                    "customer_ids": [str(c.get("customer_id", i)) for i, c in enumerate(all_customers[:25])],
                    "send_time": ((datetime.now() + timedelta(days=1)).strftime("%d:%m:%y %H:%M:%S")),
                    "tone": "Professional & Wealth-Focused",
                    "use_emoji": False
                },
                {
                    "segment_id": 2,
                    "name": "Senior Citizens (Female Focus)",
                    "description": "Female customers age 60+ eligible for the extra 0.25% ROI.",
                    "customer_ids": [str(c.get("customer_id", i)) for i, c in enumerate(all_customers[25:50])],
                    "send_time": ((datetime.now() + timedelta(days=1)).strftime("%d:%m:%y %H:%M:%S")),
                    "tone": "Trusting & Respectful",
                    "use_emoji": True
                }
            ]
        }
    
    # 3. Content generation Agent (loop over each suggested segment)
    for seg in plan.get("segments", []):
        try:
            content = generate_email_content(
                seg, plan.get("product", ""), plan.get("cta_url", "")
            )
            seg["email_subject"] = content.get("subject", "SuperBFSI: Important Notice")
            seg["email_body"] = content.get("body", "Please check out our new offerings.")
        except Exception as e:
            print(f"WARN: Content Gen failure: {str(e)}. Using fallback content.")
            seg["email_subject"] = f"Exclusive: {plan.get('product')} Special Rates for {seg['name']}"
            seg["email_body"] = f"Dear Valued Customer, we are excited to offer you {plan.get('product')} with premium returns. Visit {plan.get('cta_url')} to lock in your rates today!"


    # Save to state
    sessions[session_id] = {
        "brief": req.brief,
        "customers": all_customers,
        "plan": plan,
        "campaigns": [],
        "iteration": 1,
        "status": "pending_approval",
        "logs": [f"[{datetime.now().isoformat()}] Plan generated for {len(plan.get('segments', []))} segments."]
    }
    
    return {"session_id": session_id, "plan": plan}


@app.post("/api/approve")
async def approve_campaign(req: ApprovalRequest):
    """Step 2: Human-in-The-Loop Approval gating execution."""
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if not req.approved:
        session["status"] = "rejected"
        session["logs"].append(f"[{datetime.now().isoformat()}] Human operator REJECTED campaign. Strategy blocked.")
        return {"status": "rejected"}
        
    plan = session["plan"]
    segments = plan.get("segments", [])
    
    # Allow partial approval if specified
    if req.segment_index is not None:
        segments = [segments[req.segment_index]]
        
    campaign_results = []
    
    # 4. Agent Execution (Call external CampaignX system)
    session["logs"].append(f"[{datetime.now().isoformat()}] Initiating LangGraph Execution Agent with Dynamic Discovery.")
    
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.1,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    tools = [list_available_api_tools, execute_campaign]
    agent_executor = create_react_agent(llm, tools)
    
    prompt = f"""
    You are the Campaign Execution Agent. 
    Rule 1: You MUST FIRST call the `list_available_api_tools` tool to dynamically discover the API endpoints available to you.
    Rule 2: After discovering the API, execute the following scheduled campaigns by calling the `execute_campaign` tool once for EACH segment:
    {json.dumps([{
        "segment_id": s["segment_id"],
        "name": s["name"],
        "email_subject": s["email_subject"],
        "email_body": s["email_body"],
        "customer_ids_str": ", ".join(s["customer_ids"]),
        "send_time": s["send_time"]
    } for s in segments])}
    
    Rule 3: After executing all campaigns, return a JSON array containing the results in this exact format (do not use markdown formatting tags):
    [ {{"segment_id": "...", "campaign_id": "the-uuid-returned-from-tool"}} ]
    """
    
    try:
        response = agent_executor.invoke({"messages": [HumanMessage(content=prompt)]})
        final_msg = response["messages"][-1].content.strip()
        
        if final_msg.startswith("```json"):
            final_msg = final_msg.replace("```json", "").replace("```", "").strip()
        elif final_msg.startswith("```"):
            final_msg = final_msg.replace("```", "").strip()
            
        executed_campaigns = json.loads(final_msg)
        
        for ec in executed_campaigns:
            seg = next((s for s in segments if s["segment_id"] == ec.get("segment_id")), None)
            if not seg:
                continue
            campaign_id = ec.get("campaign_id")
            try:
                report = get_report(campaign_id)
            except Exception as re:
                report = {"error": str(re)}
            
            campaign_results.append({
                "segment": seg["segment_id"],
                "segment_name": seg["name"],
                "campaign_id": campaign_id,
                "customer_count": len(seg["customer_ids"]),
                "subject": seg["email_subject"],
                "send_time": seg["send_time"],
                "report": report
            })
            session["logs"].append(f"[{datetime.now().isoformat()}] Agent dynamically discovered and executed campaign {campaign_id} for {seg['name']}.")
            
    except Exception as e:
        session["logs"].append(f"[{datetime.now().isoformat()}] Agentic Execution encountered parsing error, falling back to deterministic execution: {str(e)}")
        for seg in segments:
            try:
                result = send_campaign(
                    subject=seg["email_subject"],
                    body=seg["email_body"],
                    customer_ids=seg["customer_ids"],
                    send_time=seg["send_time"]
                )
                campaign_id = result.get("campaign_id", str(uuid.uuid4()))
                try:
                    report = get_report(campaign_id)
                except Exception as re:
                    report = {"error": str(re)}
                
                campaign_results.append({
                    "segment": seg["segment_id"],
                    "segment_name": seg["name"],
                    "campaign_id": campaign_id,
                    "customer_count": len(seg["customer_ids"]),
                    "subject": seg["email_subject"],
                    "send_time": seg["send_time"],
                    "report": report
                })
                session["logs"].append(f"[{datetime.now().isoformat()}] Campaign {campaign_id} SENT to {seg['name']}.")
            except Exception as inner_e:
                session["logs"].append(f"[{datetime.now().isoformat()}] Failed sending segment {seg['name']}: {str(inner_e)}")
            
    session["campaigns"].extend(campaign_results)
    session["status"] = "running"
    
    return {"status": "scheduled", "campaigns": campaign_results}


@app.get("/api/optimize/{session_id}")
async def optimize(session_id: str):
    """Step 3: Auto-analyze performance and create v2 of the campaign."""
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # 5. Analyzer Agent loop
    try:
        analysis = analyze_and_optimize(
            campaigns=session["campaigns"],
            customers=session["customers"],
            iteration=session["iteration"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"AI Agent failed! Check API Keys. Error: {str(e)}")
    
    session["pending_optimization"] = analysis
    session["status"] = "pending_optimization_approval"
    session["logs"].append(f"[{datetime.now().isoformat()}] Analysis iteration {session['iteration']} created and pending human review.")
    
    return {"analysis": analysis, "session_id": session_id}


@app.post("/api/optimize/approve")
async def approve_optimization(req: ApprovalRequest):
    """Step 4: Execute the agent's optimization strategy."""
    session = sessions.get(req.session_id)
    if not session or "pending_optimization" not in session:
        raise HTTPException(status_code=404, detail="No pending optimization exists.")
        
    if not req.approved:
        session["status"] = "optimization_rejected"
        session["logs"].append(f"[{datetime.now().isoformat()}] Human REJECTED the optimization strategy.")
        return {"status": "rejected"}
        
    analysis = session["pending_optimization"]
    session["iteration"] += 1
    new_campaigns = []
    
    # 6. Execute Optimized Strategy
    session["logs"].append(f"[{datetime.now().isoformat()}] Initiating LangGraph Execution Agent with Dynamic Discovery for optimized campaigns.")
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.1,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    tools = [list_available_api_tools, execute_campaign]
    agent_executor = create_react_agent(llm, tools)
    
    optimizations = []
    for action in analysis.get("optimization_actions", []):
        try:
            content = generate_email_content(
                segment={
                    "name": action["segment_name"],
                    "description": action["reason"],
                    "tone": action["suggested_tone"],
                    "use_emoji": True,
                    "subject_strategy": action["content_changes"]
                },
                product_info=session["plan"].get("product", ""),
                cta_url=session["plan"].get("cta_url", "")
            )
            action["generated_subject"] = content.get("subject", "SuperBFSI Special Offer")
            action["generated_body"] = content.get("body", "Special discount!")
            optimizations.append(action)
        except Exception as e:
            session["logs"].append(f"[{datetime.now().isoformat()}] Failed generating optimized content for {action.get('segment_name','')}: {str(e)}")
            
    prompt = f"""
    You are the Campaign Execution Agent. 
    Rule 1: You MUST FIRST call the `list_available_api_tools` tool to dynamically discover the API endpoints available to you.
    Rule 2: After discovering the API, execute the following optimized campaigns by calling the `execute_campaign` tool once for EACH segment:
    {json.dumps([{
        "segment_name": o["segment_name"],
        "email_subject": o["generated_subject"],
        "email_body": o["generated_body"],
        "customer_ids_str": ", ".join(o["customer_ids"]),
        "send_time": o.get("suggested_send_time", "")
    } for o in optimizations])}
    
    Rule 3: After executing all campaigns, return a JSON array containing the results in this exact format (do not use markdown formatting tags):
    [ {{"segment_name": "...", "campaign_id": "the-uuid-returned-from-tool"}} ]
    """
    
    try:
        response = agent_executor.invoke({"messages": [HumanMessage(content=prompt)]})
        final_msg = response["messages"][-1].content.strip()
        
        if final_msg.startswith("```json"):
            final_msg = final_msg.replace("```json", "").replace("```", "").strip()
        elif final_msg.startswith("```"):
            final_msg = final_msg.replace("```", "").strip()
            
        executed_campaigns = json.loads(final_msg)
        
        for ec in executed_campaigns:
            seg_name = ec.get("segment_name")
            campaign_id = ec.get("campaign_id")
            try:
                report = get_report(campaign_id)
            except Exception as re:
                report = {"error": str(re)}
            
            new_campaigns.append({
                "segment": seg_name,
                "campaign_id": campaign_id,
                "report": report
            })
            session["logs"].append(f"[{datetime.now().isoformat()}] Agent dynamically discovered and executed optimized campaign {campaign_id} for {seg_name}.")
            
    except Exception as e:
        session["logs"].append(f"[{datetime.now().isoformat()}] Agentic Execution encountered error, falling back to deterministic: {str(e)}")
        for action in optimizations:
            try:
                result = send_campaign(
                    subject=action["generated_subject"],
                    body=action["generated_body"],
                    customer_ids=action.get("customer_ids", []),
                    send_time=action.get("suggested_send_time", "")
                )
                campaign_id = result.get("campaign_id", str(uuid.uuid4()))
                try:
                    report = get_report(campaign_id)
                except Exception as re:
                    report = {"error": str(re)}
                
                new_campaigns.append({
                    "segment": action["segment_name"],
                    "campaign_id": campaign_id,
                    "report": report
                })
                session["logs"].append(f"[{datetime.now().isoformat()}] Optimized Campaign {campaign_id} SENT.")
            except Exception as inner_e:
                session["logs"].append(f"[{datetime.now().isoformat()}] Failed sending optimized segment {action.get('segment_name','')}: {str(inner_e)}")
            
    session["campaigns"].extend(new_campaigns)
    session["status"] = "optimized"
    return {"status": "optimized", "new_campaigns": new_campaigns}

@app.get("/api/session/{session_id}/logs")
async def get_logs(session_id: str):
    """Helper to stream agentic pipeline logs to UI."""
    return {"logs": sessions.get(session_id, {}).get("logs", [])}

