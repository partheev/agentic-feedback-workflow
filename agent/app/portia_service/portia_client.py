from dotenv import load_dotenv
from portia import (
    Config, Portia, DefaultToolRegistry, LLMProvider, McpToolRegistry, ToolRegistry
)
from portia.cli import CLIExecutionHooks
import os
from .custom_tools.semantic_search import InsertFeedback, SemanticSearchForFeedback, UpvoteFeedback

load_dotenv(override=True)

# Environment variables
GITHUB_TOKEN = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
MONGODB_URI = os.getenv("MONGODB_URI")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
SENDER_EMAIL_ADDRESS = os.getenv("SENDER_EMAIL_ADDRESS")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")

config = Config.from_default(llm_provider=LLMProvider.OPENAI, default_model=f"openai/{OPENAI_MODEL}")


config = Config.from_default()
tool_registry = DefaultToolRegistry(config)


# Registering custom tools
my_tool_registry = ToolRegistry([
    InsertFeedback(),
    SemanticSearchForFeedback(),
    UpvoteFeedback(),
])

tool_registry = tool_registry + my_tool_registry



# MongoDB MCP (npx), pass connection string
tool_registry = tool_registry + McpToolRegistry.from_stdio_connection(
    server_name="mongodb",
    command="npx",
    args=[
         "-y",
        "mcp-mongo-server",
        MONGODB_URI
      ]
)



# Resend MCP (npx) – supports emailing 
# https://github.com/resend/mcp-send-email

resend_mcp_build_path = os.path.join(os.path.dirname(__file__), "mcp_servers","mcp-send-email","build", "index.js")
tool_registry = tool_registry + McpToolRegistry.from_stdio_connection(
    server_name="resend",
    command="node",
    args=[
        resend_mcp_build_path,
        f"--key={RESEND_API_KEY}",
        f"--sender={SENDER_EMAIL_ADDRESS}",
    ],
)

# Initialize Portia client
# Note: Github mcp is configured in Portia cloud
portia = Portia(config=config, tools=tool_registry)

print(portia)

