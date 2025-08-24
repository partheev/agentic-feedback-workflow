#!/bin/bash

# Install poetry using pip 
pip install -r requirements.txt

# Install fastapi
pip install "fastapi[standard]"

# Build mcp server
npm --prefix ./app/portia_service/mcp_servers/mcp-send-email install
npm --prefix ./app/portia_service/mcp_servers/mcp-send-email run build
