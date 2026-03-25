import json
import re
import anthropic
from .base import BaseTool


class SummarizeTool(BaseTool):
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)

    @property
    def name(self) -> str:
        return "summarize"

    @property
    def description(self) -> str:
        return "Generate a concise summary and structured analysis for each article."

    def schema(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": {
                "type": "object",
                "properties": {
                    "articles": {
                        "type": "string",
                        "description": "JSON string of categorized articles to summarize"
                    }
                },
                "required": ["articles"]
            }
        }

    async def execute(self, input: dict):
        raw = input["articles"]
        try:
            articles = json.loads(raw)
        except json.JSONDecodeError:
            arrays = re.findall(r'\[.*?\]', raw, re.DOTALL)
            articles = []
            for arr in arrays:
                try:
                    articles.extend(json.loads(arr))
                except json.JSONDecodeError:
                    continue

        # Build a single prompt with all articles
        articles_text = ""
        for i, article in enumerate(articles):
            articles_text += f"""
Article {i + 1}:
Title: {article.get('title', '')}
Description: {article.get('description', '')}
Source: {article.get('source_name', '')}
---
"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""Analyze these news articles. For each one, provide a structured analysis.

{articles_text}

Respond with ONLY a valid JSON array, no other text. Each element must have:
- "index": the article number (starting from 1)
- "summary": 2-3 sentence summary of the article
- "what_happened": 2-3 sentences explaining the key events or developments
- "why_it_matters": 2-3 sentences on why this is geopolitically significant
- "potential_impact": 2-3 sentences on possible consequences, second-order effects, or what to watch for next

Example format:
[{{"index": 1, "summary": "...", "what_happened": "...", "why_it_matters": "...", "potential_impact": "..."}}]"""
            }]
        )

        try:
            text = response.content[0].text.strip()
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            summaries = json.loads(text)
            for item in summaries:
                idx = item.get("index", 0) - 1
                if 0 <= idx < len(articles):
                    articles[idx]["summary"] = item.get("summary", "")
                    articles[idx]["what_happened"] = item.get("what_happened", "")
                    articles[idx]["why_it_matters"] = item.get("why_it_matters", "")
                    articles[idx]["potential_impact"] = item.get("potential_impact", "")
        except json.JSONDecodeError:
            for article in articles:
                if "summary" not in article:
                    article["summary"] = "Summary unavailable."
                    article["what_happened"] = "Analysis unavailable."
                    article["why_it_matters"] = "Analysis unavailable."
                    article["potential_impact"] = "Analysis unavailable."

        for article in articles:
            if "summary" not in article:
                article["summary"] = "Summary unavailable."
            if "what_happened" not in article:
                article["what_happened"] = "Analysis unavailable."
            if "why_it_matters" not in article:
                article["why_it_matters"] = "Analysis unavailable."
            if "potential_impact" not in article:
                article["potential_impact"] = "Analysis unavailable."

        return json.dumps(articles)