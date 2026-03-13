# backend/src/tools/summarize.py
# Tool that takes a cluster of articles on one topic and produces
# a concise summary plus deeper geopolitical analysis via the LLM.

import json
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
        return "Generate a concise summary and 'Why It Matters' analysis for each article."

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
        try:
            articles = json.loads(input["articles"])
        except json.JSONDecodeError:
            import ast
            articles = ast.literal_eval(input["articles"])
        summarized = []

        for article in articles:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=512,
                messages=[{
                    "role": "user",
                    "content": f"""Analyze this news article and respond with ONLY valid JSON, no other text:

Title: {article.get('title', '')}
Description: {article.get('description', '')}
Source: {article.get('source_name', '')}

Return this exact JSON format:
{{"summary": "2-3 sentence summary", "why_it_matters": "2-3 sentence analysis of geopolitical significance"}}"""
                }]
            )

            try:
                result = json.loads(response.content[0].text)
                article["summary"] = result.get("summary", "")
                article["why_it_matters"] = result.get("why_it_matters", "")
            except json.JSONDecodeError:
                article["summary"] = "Summary unavailable."
                article["why_it_matters"] = "Analysis unavailable."

            summarized.append(article)

        return json.dumps(summarized)