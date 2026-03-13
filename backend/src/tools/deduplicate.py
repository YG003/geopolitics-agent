import json
import re
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
        raw = input["articles"]

        # Handle concatenated JSON arrays like [...][...][...]
        try:
            articles = json.loads(raw)
        except json.JSONDecodeError:
            # Find all JSON arrays and merge them
            arrays = re.findall(r'\[.*?\]', raw, re.DOTALL)
            articles = []
            for arr in arrays:
                try:
                    articles.extend(json.loads(arr))
                except json.JSONDecodeError:
                    continue

        seen_titles = set()
        unique = []

        for article in articles:
            title = article.get("title", "").lower().strip()
            if title and title not in seen_titles:
                seen_titles.add(title)
                unique.append(article)

        return json.dumps(unique)