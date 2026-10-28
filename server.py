"""
UniGuide AI - Production Local Web Server & API Bridge
University of Education (UE)
"""

import os
import sys
import json
import ast
import operator
import re
import mimetypes
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "web")
KB_FILE = os.path.join(BASE_DIR, "HIST_knowledge_base.json")

# Load Knowledge Base Chunks if available
kb_chunks = []
if os.path.exists(KB_FILE):
    try:
        with open(KB_FILE, "r", encoding="utf-8") as f:
            kb_chunks = json.load(f)
    except Exception as e:
        print(f"[WARN] Failed to read {KB_FILE}: {e}")

# AST Mathematical Evaluator
_ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def _eval_ast_node(node):
    if isinstance(node, ast.Constant):
        return node.value
    elif isinstance(node, ast.BinOp):
        left = _eval_ast_node(node.left)
        right = _eval_ast_node(node.right)
        op = _ALLOWED_OPERATORS.get(type(node.op))
        if op is None:
            raise ValueError(f"Unsupported operator: {type(node.op)}")
        return op(left, right)
    elif isinstance(node, ast.UnaryOp):
        operand = _eval_ast_node(node.operand)
        op = _ALLOWED_OPERATORS.get(type(node.op))
        if op is None:
            raise ValueError(f"Unsupported unary operator: {type(node.op)}")
        return op(operand)
    else:
        raise ValueError(f"Unsupported AST node: {type(node)}")

def safe_calculator(expression: str) -> str:
    try:
        clean_expr = expression.replace("PKR", "").replace("pkr", "").replace(",", "").replace("$", "").strip()
        clean_expr = re.sub(r'(\d+(?:\.\d+)?)\s*%', r'(\1 / 100.0)', clean_expr)
        tree = ast.parse(clean_expr, mode='eval')
        result = _eval_ast_node(tree.body)
        if isinstance(result, float) and result.is_integer():
            return str(int(result))
        return f"{result:,.2f}"
    except Exception as e:
        return f"Calculation error: Could not evaluate '{expression}'"


class UniGuideRequestHandler(BaseHTTPRequestHandler):
    
    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # API Endpoints
        if path == "/api/health":
            return self._send_json({"status": "active", "service": "UniGuide AI", "version": "2.0"})

        if path == "/api/kb":
            return self._send_json(kb_chunks)

        # Serve static web files
        if path == "/" or path == "":
            file_path = os.path.join(WEB_DIR, "index.html")
        else:
            clean_path = path.lstrip("/\\")
            file_path = os.path.join(WEB_DIR, clean_path)

        if os.path.exists(file_path) and not os.path.isdir(file_path):
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type:
                content_type = "application/octet-stream"
            if file_path.endswith(".css"):
                content_type = "text/css"
            elif file_path.endswith(".js"):
                content_type = "application/javascript"

            try:
                with open(file_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", f"{content_type}; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_error(500, f"Error reading file: {e}")
        else:
            self.send_error(404, f"File not found: {path}")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode("utf-8")) if post_data else {}
        except Exception:
            payload = {}

        if path == "/api/calculate":
            expr = payload.get("expression", "")
            res = safe_calculator(expr)
            return self._send_json({"expression": expr, "result": res})

        if path == "/api/search":
            query = payload.get("query", "").lower()
            results = []
            for chunk in kb_chunks:
                c_text = chunk.get("content", "").lower()
                if any(w in c_text for w in query.split()):
                    results.append(chunk)
            return self._send_json({"query": query, "results": results[:5]})


        self.send_error(404, f"Unknown POST endpoint: {path}")

def run_server(port=PORT):
    server_address = ("", port)
    httpd = HTTPServer(server_address, UniGuideRequestHandler)
    print("\n" + "="*70)
    print("  [UniGuide AI] Enterprise Agentic Admissions Advisor (University of Education)")
    print(f"  Server running at: http://localhost:{port}")
    print(f"  Serving assets from: {WEB_DIR}")
    print("  Press Ctrl+C to stop the server.")
    print("="*70 + "\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.")
        httpd.server_close()

if __name__ == "__main__":
    port = PORT
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
