# backend/src/models.py
# Pydantic data models used throughout the app:
# Article, BriefingStory, Briefing, AgentEvent, ToolCall, etc.
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class Article(BaseModel):
    title: str
    description: str
    source_name: str
    url: str
    published_at: datetime
    image_url: Optional[str] = None

class StoryCard(Article):
    summary: str
    category: str
    why_it_matters: str

class Briefing(BaseModel):
    date: datetime
    headline: str
    executive_summary: str
    topic_tags: list[str]
    stories: list[StoryCard]

class ProgressEvent(BaseModel):
    step: str
    status: Literal["running", "complete", "error"]
    message: Optional[str] = None