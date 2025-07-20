1. We would need to create a .env file with the open api key
touch .env
OPEN_API_KEY=sk_.... #your own open api key

2. Run the server
python3 server.py

3. expose this server as a public endpoint. Note the ngrok endpoint ending in /mcp. 
ngrok http 8000

4. run the client and observe the results from the server. The url in the client.py file comes from the previous step
python3 client.py