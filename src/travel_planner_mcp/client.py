import asyncio
from mcp_use import MCPClient

async def main():
    # Use the ngrok HTTPS URL with a trailing slash
    ngrok_url = "https://cb1754f6c68d.ngrok-free.app/mcp/"

    client = MCPClient(config={
        "mcpServers": {
            "travel": {
                "url": ngrok_url
            }
        }
    })

    # Create session with the remote EnrichMCP server
    session = await client.create_session("travel")

    # Call the 'list_destinations' tool
    result = await session.connector.call_tool("plan_trip", {"preferences": "I want to go to spain!"})
    print("Destinations:\n" + str(result))
    await client.close_all_sessions()

if __name__ == "__main__":
    asyncio.run(main())