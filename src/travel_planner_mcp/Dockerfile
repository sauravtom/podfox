FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    supervisor && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy app files
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy Supervisor config
COPY supervisord.conf /etc/supervisord.conf

# Expose both ports
EXPOSE 8000 8001

# Start both server and client via Supervisor
CMD ["supervisord", "-c", "/etc/supervisord.conf"]

