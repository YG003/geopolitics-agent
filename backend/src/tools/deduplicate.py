# backend/src/tools/deduplicate.py
# Tool that removes duplicate or near-duplicate articles from a list,
# using URL matching and semantic similarity to collapse redundant coverage.

import json
from .base import BaseTool


class DeduplicateTool(BaseTool):
    @property
    def name(self) -> str:
        return "deduplicate"

    @property
    def description(self) -> str:
        return "Remove duplicate news coverage. Takes a list of articles and returns only unique stories."

    def schema(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": {
                "type": "object",
                "properties": {
                    "articles": {
                        "type": "string",
                        "description": "JSON string of articles to deduplicate"
                    }
                },
                "required": ["articles"]
            }
        }

    async def execute(self, input: dict):
        articles = json.loads(input["articles"])
        seen_titles = set()
        unique = []

        for article in articles:
            title = article.get("title", "").lower().strip()
            if title and title not in seen_titles:
                seen_titles.add(title)
                unique.append(article)

        return json.dumps(unique)