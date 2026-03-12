# backend/src/config.py
# Loads and exposes API keys, environment variables, and app-wide
# constants (e.g. model name, max articles, NewsAPI base URL).

import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")