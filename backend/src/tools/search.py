# backend/src/tools/search.py
# Tool that queries the NewsAPI to fetch recent geopolitics articles
# based on keywords, categories, or date ranges supplied by the agent.

import json
import httpx
from .base import BaseTool


class SearchNewsTool(BaseTool):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://newsapi.org/v2/everything"
    
    @property
    def name(self) -> str:
        return "search_news"

    @property
    def description(self) -> str:
        return "Search for recent geopolitics news articles by keyword or topic."
    
    def schema(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query for news articles, e.g. 'US China trade war'"
                    },
                    "sort_by": {
                        "type": "string",
                        "description": "How to sort results: 'publishedAt', 'relevancy', or 'popularity'",
                        "default": "publishedAt"
                    }
                },
                "required": ["query"]
            }
        }
    
    async def execute(self, input: dict):
        query = input["query"]
        sort_by = input.get("sort_by", "publishedAt")

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    self.base_url,
                    params={
                        "q": query,
                        "sortBy": sort_by,
                        "language": "en",
                        "pageSize": 10,
                        "apiKey": self.api_key
                    }
                )

            data = response.json()

            if data.get("status") != "ok":
                return f"Error: {data.get('message', 'Unknown error')}"

            articles = []
            for article in data.get("articles", []):
                articles.append({
                    "title": article.get("title", ""),
                    "description": article.get("description", ""),
                    "source_name": article.get("source", {}).get("name", ""),
                    "url": article.get("url", ""),
                    "published_at": article.get("publishedAt", ""),
                    "image_url": article.get("urlToImage")
                })

            return json.dumps(articles)

        except Exception as e:
            return f"Error searching news: {str(e)}"