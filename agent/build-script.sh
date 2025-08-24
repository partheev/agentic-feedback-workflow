#!/bin/bash

# Install poetry using pip 
pip install poetry

# Install dependencies
poetry install --no-root

# Install fastapi
pip install "fastapi[standard]"

# Build mcp server
npm --prefix ./app/portia_service/mcp_servers/mcp-send-email install
npm --prefix ./sapp/portia_service/mcp_servers/mcp-send-email run build

# Build the agent
uv run build
