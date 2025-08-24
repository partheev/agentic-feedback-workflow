

# Run commonds on os
import os


def run_setup():
    # Build resend mcp server
    # Check if resend mcp server is already built
    resend_mcp_server_path = os.path.join(os.path.dirname(__file__), "portia_service", "mcp_servers", "mcp-send-email")
    resend_mcp_server_build_path = os.path.join(resend_mcp_server_path, "build", "index.js")
    
    # Check if node_modules exists first
    node_modules_path = os.path.join(resend_mcp_server_path, "node_modules")
    
    try:
        if not os.path.exists(resend_mcp_server_build_path):
            # Install dependencies if node_modules doesn't exist
            if not os.path.exists(node_modules_path):
                result = os.system(f"npm --prefix {resend_mcp_server_path} install")
                if result != 0:
                    raise Exception("npm install failed")
                    
            # Build the project
            result = os.system(f"npm --prefix {resend_mcp_server_path} run build")
            if result != 0:
                raise Exception("npm build failed")
                
            print(f"Resend mcp server built at {resend_mcp_server_path}")
        else:
            print(f"Resend mcp server already built at {resend_mcp_server_path}")
            
    except Exception as e:
        print(f"Error building resend mcp server: {str(e)}")
        raise
