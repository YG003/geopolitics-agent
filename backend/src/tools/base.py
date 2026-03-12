# backend/src/tools/base.py
# Abstract base class that every agent tool must extend.
# Defines the common interface: name, description, input schema, and run().

from abc import ABC, abstractmethod


class BaseTool(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """The name Claude sees when choosing a tool."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Explains to Claude when and why to use this tool."""
        pass

    @abstractmethod
    def schema(self) -> dict:
        """Returns the tool definition in Claude's expected format."""
        pass

    @abstractmethod
    async def execute(self, input: dict):
        """Runs the tool and returns the result."""
        pass