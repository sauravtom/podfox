from fastapi import FastAPI, Request
from pydantic import BaseModel
import asyncio
from mcp_use import MCPClient
from mcp.types import TextContent  # ✅ Add this import
import uvicorn

app = FastAPI()

MCP_URL = "http://localhost:8000/mcp/"  # Update as needed

class TripRequest(BaseModel):
    preferences: str

@app.post("/plan-trip")
async def plan_trip(req: TripRequest):
    print("In plan_trip...")
    client = MCPClient(config={
        "mcpServers": {
            "travel": {
                "url": MCP_URL
            }
        }
    })

    print("The req is : " + str(req))
    try:
        session = await client.create_session("travel")
        result = await session.connector.call_tool("plan_trip", {"preferences": req.preferences})
        print("Here is my result: " + str(result))
        await client.close_all_sessions()
        
        # Extract just the text content
        # Extract the text field from the content list
        if result.content and isinstance(result.content[0], TextContent):
            itinerary_text = result.content[0].text
        else:
            itinerary_text = "No itinerary returned."

        return {"itinerary": itinerary_text}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
