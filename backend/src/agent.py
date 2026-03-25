# backend/src/agent.py
# Core agent loop: orchestrates tool-calling to fetch, deduplicate,
# categorize, and summarize geopolitics news into a structured briefing.

import anthropic
from .models import Briefing, ProgressEvent

class Agent:
    def __init__(self, tools: list, model: str = "claude-sonnet-4-20250514"):
        self.client = anthropic.Anthropic()
        self.model = model
        self.tools_registry = {tool.name: tool for tool in tools}
        self.tools = [tool.schema() for tool in tools]

    async def run(self, goal: str):
        import json as _json
        messages = [{"role": "user", "content": goal}]
        tool_calls_made = 0

        while True:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=8192,
                system="You are an autonomous AI agent. You MUST complete the entire workflow "
                       "by calling tools. DO NOT respond with text explaining what you plan to "
                       "do. Instead, call the appropriate tool immediately.\n\n"
                       "Workflow:\n"
                       "1. Call search_news exactly 2 times with different queries\n"
                       "2. Call deduplicate with all collected articles\n"
                       "3. Call categorize with the deduplicated articles\n"
                       "4. Call summarize with the categorized articles\n\n"
                       "IMPORTANT: After receiving tool results, immediately call the next tool. "
                       "Do NOT call search_news more than 2 times.",
                tools=self.tools,
                messages=messages
            )

            print(f"--- Stop reason: {response.stop_reason}")
            print(f"--- Tool calls so far: {tool_calls_made}")
            for block in response.content:
                if block.type == "tool_use":
                    print(f"--- Tool call: {block.name}")
                elif hasattr(block, "text"):
                    print(f"--- Text: {block.text[:200]}")

            if response.stop_reason == "tool_use":
                messages.append({"role": "assistant", "content": response.content})

                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        tool_calls_made += 1
                        result = await self._execute_tool(block.name, block.input)
                        result_str = str(result)

                        # Return summarize output directly — no need for the agent to re-emit it
                        if block.name == "summarize":
                            try:
                                stories = _json.loads(result_str)
                                return _json.dumps({"stories": stories})
                            except _json.JSONDecodeError:
                                pass  # fall through if malformed

                        # Truncate other large results to keep context manageable
                        if len(result_str) > 5000:
                            result_str = result_str[:5000] + "...(truncated)"

                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result_str
                        })

                messages.append({"role": "user", "content": tool_results})

            elif tool_calls_made < 4:
                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": "You haven't completed all steps yet. Call the next tool now."})

            else:
                final_text = ""
                for block in response.content:
                    if hasattr(block, "text"):
                        final_text += block.text

                import re
                json_match = re.search(r'\{[\s\S]*\}', final_text)
                if json_match:
                    return json_match.group(0)
                return final_text

    async def _execute_tool(self, tool_name: str, tool_input: dict):
        tool = self.tools_registry.get(tool_name)
        if tool:
            return await tool.execute(tool_input)
        return f"Error: tool '{tool_name}' not found"