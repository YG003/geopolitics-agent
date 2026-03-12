# backend/src/tools/categorize.py
# Tool that groups a flat list of articles into named geopolitical topics
# (e.g. "Russia-Ukraine", "South China Sea") using LLM classification.

import json
from .base import BaseTool


CATEGORIES = [
    "US-China Relations",
    "Middle East",
    "Russia-Ukraine",
    "NATO & European Security",
    "Trade & Sanctions",
    "Climate & Energy Policy",
    "Elections & Democracy",
    "Nuclear & Arms Control",
    "Africa & Development",
    "Asia-Pacific",
    "Latin America",
    "Other"
]


class CategorizeTool(BaseTool):
    @property
    def name(self) -> str:
        return "categorize"

    @property
    def description(self) -> str:
        return "Assign a geopolitical topic category to each article based on its content."

    def schema(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": {
                "type": "object",
                "properties": {
                    "articles": {
                        "type": "string",
                        "description": "JSON string of articles to categorize"
                    }
                },
                "required": ["articles"]
            }
        }

    async def execute(self, input: dict):
        articles = json.loads(input["articles"])

        for article in articles:
            article["category"] = "Other"

            title = article.get("title", "").lower()
            description = article.get("description", "").lower()
            text = f"{title} {description}"

            for category in CATEGORIES:
                keywords = category.lower().split(" & ")
                for keyword in keywords:
                    if keyword.strip() in text:
                        article["category"] = category
                        break

        return json.dumps(articles)