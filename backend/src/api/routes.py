# backend/src/api/routes.py
# FastAPI route definitions:
#   POST /briefing  - triggers the agent to run and returns a briefing ID
#   GET  /briefing/{id}/stream - SSE stream of live agent progress events


import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..agent import Agent
from ..tools.search import SearchNewsTool
from ..tools.deduplicate import DeduplicateTool
from ..tools.categorize import CategorizeTool
from ..tools.summarize import SummarizeTool
from ..config import ANTHROPIC_API_KEY, NEWS_API_KEY

router = APIRouter()


@router.post("/api/briefing")
async def generate_briefing():
    tools = [
        SearchNewsTool(api_key=NEWS_API_KEY),
        DeduplicateTool(),
        CategorizeTool(),
        SummarizeTool(api_key=ANTHROPIC_API_KEY),
    ]

    agent = Agent(tools=tools)

    result = await agent.run(
        "You are a senior geopolitical analyst preparing a daily intelligence "
        "briefing. Your task:\n\n"
        "1. Search for today's most significant geopolitics news. Run multiple "
        "searches across key regions and themes: US-China, Middle East, "
        "Russia-Ukraine, NATO, trade wars, sanctions, elections, and nuclear "
        "diplomacy.\n\n"
        "2. Deduplicate the collected articles to remove overlapping coverage "
        "of the same story from different outlets.\n\n"
        "3. Categorize each unique story by its primary geopolitical theme.\n\n"
        "4. Summarize each story using the summarize tool — this will generate "
        "structured analysis including what_happened, why_it_matters, and "
        "potential_impact fields.\n\n"
        "5. Return the final briefing as a JSON object. IMPORTANT: preserve "
        "all fields returned by the summarize tool exactly as they are. "
        "Do NOT rewrite or omit any fields. The stories array must include: "
        "title, description, source_name, url, published_at, image_url, "
        "summary, category, what_happened, why_it_matters, and potential_impact.\n\n"
        "Be thorough in your search but concise in your analysis. "
        "Prioritise stories with the highest geopolitical significance."
    )
    return {"briefing": result}