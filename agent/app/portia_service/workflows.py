from .portia_client import portia
from portia.plan import PlanInput
from dotenv import load_dotenv
import os
from models import FeedbackIn

MONGODB_DB = os.getenv("MONGODB_NAME", "feedbackdb")
MONGODB_COLLECTION = os.getenv("MONGODB_COLL", "feedback")
GITHUB_OWNER = os.getenv("GITHUB_OWNER", "your-org")
GITHUB_REPO = os.getenv("GITHUB_REPO", "your-repo")
SENDER_EMAIL_ADDRESS = os.getenv("SENDER_EMAIL_ADDRESS", "support@example.com")
RECEIVER_EMAIL_ADDRESS = os.getenv("RECEIVER_EMAIL_ADDRESS", "partheev@gmail.com")


def handle_customer_feedback(feedback_report: FeedbackIn):


    WORKFLOW_PROMPT = f"""
        You are an AI triage agent for customer feedback/bug reports.

        Overall goals:
        - Classify each submission as FEEDBACK or BUG by considering feedback_title and feedback_description fields.
        - It is a bug if user is facing any technical issue in the system or it is not working as expected or user flow is breaking or any bug relavent query.
        - Enforce bug validity: only proceed if the report has enough details to reproduce.
        - Prevent duplicates for FEEDBACK via semantic search; upvote duplicates, otherwise insert a new doc.
        - For valid BUGs: search the internet for prior solutions/hints, then raise a GitHub issue with a self-contained reproduction and the best candidate solutions/hints. 
        - For invalid/insufficient BUG reports: email the reporter asking for specific missing details and mark status=needs_more_info.
        - Always thank the user via email (after saving or upvoting). Use proper stylings and formatting.

        Authoritative tools (use only these when appropriate):
        - MongoDB MCP (server_name="mongodb") to read/write feedback docs.
        - GitHub MCP (server_name="github") to create the issue in the correct repo.
        - Resend MCP (server_name="resend") to send emails.

        MongoDB rules:
        - Database: ${MONGODB_DB}, Collection: ${MONGODB_COLLECTION}.
        - Feedback document schema fields: name, title, description, embedding ,upvotes
        - Feedback document id is the _id field of the document.
        - To upvote a feedback document, use these arguments with upvote_feedback tool.

        - For FEEDBACK:
        1) Check if the feedback is a duplicate using semantic search tool (semantic_search_for_feedback). If that tool return found=True, increment the upvotes using upvote_feedback tool with "found_id" which it gets from the semantic search tool, send a polite thank-you email noting it’s a known item.
        2) Else if feedback is not a duplicate, insert a new feedback doc using insert_feedback tool.
        - For BUG:
        Validate FIRST on $feedback_description and $feedback_title. A bug is “valid” only if below are present:
        - user should mention if bug is coming from which device type (web, mobile, desktop, etc..)
        - user should mention if bug is coming from which browser (chrome, firefox, safari, etc.),

        If invalid → email the reporter specifically listing what’s missing.
        If valid → then:
            • Internet search: find existing reports/workarounds/root causes using Browser tool; collect 3–5 best sources,
            • Summarize the most plausible cause and potential fix paths,
            • Create a GitHub issue in repo `${GITHUB_OWNER}/${GITHUB_REPO}` with:
                - Title = “[Bug] <short title>”
                - Body = Description, Repro steps, Expected vs Actual, Environment, Links to research, and “Proposed next steps”
                - Labels: “bug”
            • Optionally attach minimal logs or user-provided attachment links.
        - In all cases, send a thank-you email via Resend MCP FROM `${SENDER_EMAIL_ADDRESS}` TO `user.email`. 
        For valid BUGs, mention that we created an issue and include the URL. 
        For invalid BUGs, ask for the missing fields.

        Plan outputs:
        - `$classification` in {"feedback","bug"}.
        - `$issue_url` if a GitHub issue is created.

        Be explicit with tool selection:
        - Use MongoDB MCP for CRUD and searching. 
        - Use GitHub MCP tools to create issues.
        - Use Resend MCP for email.

        Safety and guardrails:
        - Do not post or fetch private data.
        - Never reveal API keys/secrets.
        - For email content, keep it professional and concise.
        - Mention that mail is coming from the support team.

        Note:
        - Planning agent should make sure that the next steps are getting expected fields from previous steps. all steps should forward all necessary fields to the next steps.

    """

    print("=== Generating plan ===")

    plan = portia.plan(
        query=WORKFLOW_PROMPT,
        plan_inputs=[
            PlanInput(
                name="$customer_email",
                # value=feedback_report.customer_email # TODO: This is for testing purpose, remove RECEIVER_EMAIL_ADDRESS and use user email after upgrading Resend plan to premium. Right now it can only send to verified emails.
                value=RECEIVER_EMAIL_ADDRESS
            ),PlanInput(
                name="$customer_name",
                value=feedback_report.customer_name
            ),PlanInput(
                name="$feedback_title",
                value=feedback_report.feedback_title,
                description="The title of the feedback"
            ),PlanInput(
                name="$feedback_description",
                value=feedback_report.feedback_description,
                description="The description of the feedback"
            )
        ])

    print("=== Generated plan ===")


    plan_run = portia.run_plan(plan)


