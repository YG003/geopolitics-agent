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
        messages = [{"role": "user", "content": goal}]

        while True:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                tools=self.tools,
                messages=messages
            )

            if response.stop_reason == "tool_use":
                # Add Claude's response to the conversation
                messages.append({"role": "assistant", "content": response.content})

                # Find and execute each tool call
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        result = await self._execute_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": str(result)
                        })

                # Send tool results back to Claude
                messages.append({"role": "user", "content": tool_results})

            else:
                # Claude is done — extract the final text
                final_text = ""
                for block in response.content:
                    if hasattr(block, "text"):
                        final_text += block.text
                return final_text

    async def _execute_tool(self, tool_name: str, tool_input: dict):
        tool = self.tools_registry.get(tool_name)
        if tool:
            return await tool.execute(tool_input)
        return f"Error: tool '{tool_name}' not found"