from dotenv import load_dotenv
from portia import (
    Config, Portia, DefaultToolRegistry, LLMProvider, McpToolRegistry
)
from portia.cli import CLIExecutionHooks
# from portia.open_source_tools.browser_tool import BrowserTool
import os
import json
load_dotenv(override=True)



config = Config.from_default(llm_provider=LLMProvider.OPENAI, default_model="openai/gpt-4.1-nano")

portia = Portia(
   config=config,
   tools=DefaultToolRegistry(config=config),
   execution_hooks=CLIExecutionHooks(),
)

config = Config.from_default()
tool_registry = DefaultToolRegistry(config)



portia = Portia(config=config, tools=tool_registry)

plan = portia.plan("Send mail to customer of mail id: partheev8@gmail.com from my gmail account with message: Hi")

plan_run = portia.run_plan(plan)

print(plan_run.model_dump_json(indent=2))
