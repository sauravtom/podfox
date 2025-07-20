"""Travel planner example using server-side LLM."""

import json
import openai
import os

from typing import Annotated
from dotenv import load_dotenv
from openai import AsyncOpenAI

from pydantic import Field

from enrichmcp import EnrichMCP, EnrichModel

load_dotenv()  # loads from .env into environment variables

openai_api_key=os.getenv("OPENAI_API_KEY")
open_ai_client = AsyncOpenAI(api_key=openai_api_key)  # You can also use openai.OpenAI(...) for sync

app = EnrichMCP(
    title="Travel Planner",
    description="Suggest destinations based on user preferences using LLM sampling",
)


class Destination(EnrichModel):
    """Popular travel destination."""
    name: str = Field(description="Days of travel")
    event: str = Field(description="The travel event")
    description: str = Field(description="A detailed description of the travel event")

def parse_to_destinations(full_message: str) -> list[Destination]:
    destinations = []
    current_day = ""
    current_event = ""
    description_lines = []

    for line in full_message.splitlines():
        line = line.strip()
        if line.startswith("Day"):
            # Save the previous day if any
            if current_day:
                destinations.append(Destination(
                    name=current_day,
                    event=current_event,
                    description="\n".join(description_lines)
                ))

            # Start new day block
            if ":" in line:
                parts = line.split(":", 1)
                current_day = parts[0].strip()  # e.g., "Day 1"
                current_event = parts[1].strip()  # e.g., "Arrival in Madrid"
                description_lines = []
        elif line.startswith("-"):
            description_lines.append(line[1:].strip())  # Remove leading "-"
        elif line:
            description_lines.append(line)

    # Add last destination
    if current_day:
        destinations.append(Destination(
            name=current_day,
            event=current_event,
            description="\n".join(description_lines)
        ))

    return destinations
    current_day = None
    current_details = []

    for line in full_message.splitlines():
        if line.strip().startswith("Day"):
            # Save previous day
            if current_day:
                days.append({
                    "day": current_day,
                    "activities": current_details
                })
            # Start new day
            current_day = line.strip()
            current_details = []
        elif line.strip().startswith("-"):
            current_details.append(line.strip("- ").strip())
        elif line.strip():
            current_details.append(line.strip())

    # Add last day
    if current_day:
        days.append({
            "day": current_day,
            "activities": current_details
        })

    return days


@app.retrieve
async def plan_trip(
    preferences: Annotated[str, Field(description="Your travel preferences")],
) -> str:
    """Return three destinations that best match the given preferences."""
    ctx = app.get_context()
    prompt = (
        "Give me a good travel plan for the following preferences: "
        f"{preferences}\n"
    )
    response = await open_ai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        top_p=0.9,
        max_tokens=1000,
    )
    full_message = response.choices[0].message.content
    print("This is the response..." + str(full_message))
    return full_message


if __name__ == "__main__":
    app.run(transport="streamable-http")
