"""
Multi-Language Code Analyzer Engine for GenDoc AI.
Extracts AST elements, classes, functions, APIs, dependencies, and file structures.
"""

import ast
import os
import re
import zipfile
import json
from typing import Dict, List, Any, Tuple


class CodeAnalyzer:
    """Analyzes source code across multiple programming languages."""

    SUPPORTED_EXTENSIONS = {
        ".py": "Python",
        ".js": "JavaScript",
        ".jsx": "React JSX",
        ".ts": "TypeScript",
        ".tsx": "React TSX",
        ".java": "Java",
        ".c": "C",
        ".cpp": "C++",
        ".h": "C/C++ Header",
        ".hpp": "C++ Header",
        ".sql": "SQL",
        ".html": "HTML",
        ".css": "CSS",
        ".json": "JSON",
        ".md": "Markdown",
        ".yaml": "YAML",
        ".yml": "YAML",
        ".txt": "Text",
    }

    @classmethod
    def detect_language(cls, file_path: str) -> str:
        _, ext = os.path.splitext(file_path.lower())
        return cls.SUPPORTED_EXTENSIONS.get(ext, "Unknown")

    @classmethod
    def parse_python_ast(cls, code: str, file_path: str = "") -> Dict[str, Any]:
        """Parses Python code using Python AST to extract classes, functions, APIs, imports, and docstrings."""
        result = {
            "classes": [],
            "functions": [],
            "apis": [],
            "imports": [],
            "dependencies": set(),
            "complexity_score": 0,
        }

        try:
            tree = ast.parse(code)
        except Exception as e:
            # Fallback to regex parser if syntax error exists
            return cls._parse_python_regex(code, file_path)

        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        mod = alias.name.split(".")[0]
                        result["imports"].append(alias.name)
                        result["dependencies"].add(mod)
                elif isinstance(node, ast.ImportFrom) and node.module:
                    mod = node.module.split(".")[0]
                    result["imports"].append(node.module)
                    result["dependencies"].add(mod)

        for node in tree.body:
            if isinstance(node, ast.ClassDef):
                doc = ast.get_docstring(node) or "No docstring provided."
                bases = [cls._get_node_name(b) for b in node.bases]
                methods = []
                for sub in node.body:
                    if isinstance(sub, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        methods.append(cls._extract_function_info(sub, file_path, class_name=node.name))
                
                result["classes"].append({
                    "name": node.name,
                    "bases": bases,
                    "docstring": doc.strip(),
                    "line_number": node.lineno,
                    "methods": methods,
                    "file_path": file_path,
                    "complexity": len(node.body)
                })

            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                func_info = cls._extract_function_info(node, file_path)
                result["functions"].append(func_info)
                if func_info.get("is_api"):
                    result["apis"].append(func_info["api_details"])

        result["dependencies"] = list(result["dependencies"])
        return result

    @classmethod
    def _extract_function_info(cls, node: Any, file_path: str, class_name: str = None) -> Dict[str, Any]:
        doc = ast.get_docstring(node) or "No docstring provided."
        params = []
        for arg in node.args.args:
            arg_type = cls._get_node_name(arg.annotation) if arg.annotation else "Any"
            params.append({"name": arg.arg, "type": arg_type})

        return_type = cls._get_node_name(node.returns) if node.returns else "None"
        
        # Check for API decorators (Flask, FastAPI, etc.)
        is_api = False
        api_details = None
        for dec in node.decorator_list:
            dec_str = cls._get_node_source(dec)
            # Match @app.route('/path', methods=['GET']) or @router.get('/path')
            if any(k in dec_str.lower() for k in ["route", "get", "post", "put", "delete", "patch"]):
                is_api = True
                method = "GET"
                path = "/api/unknown"
                if "methods" in dec_str and "POST" in dec_str.upper():
                    method = "POST"
                elif "methods" in dec_str and "PUT" in dec_str.upper():
                    method = "PUT"
                elif "methods" in dec_str and "DELETE" in dec_str.upper():
                    method = "DELETE"
                elif ".post(" in dec_str:
                    method = "POST"
                elif ".put(" in dec_str:
                    method = "PUT"
                elif ".delete(" in dec_str:
                    method = "DELETE"
                elif ".patch(" in dec_str:
                    method = "PATCH"

                # Extract path string
                path_match = re.search(r"['\"](/[^'\"]*)['\"]", dec_str)
                if path_match:
                    path = path_match.group(1)

                api_details = {
                    "method": method,
                    "path": path,
                    "function_name": node.name,
                    "file_path": file_path,
                    "summary": doc.split("\n")[0] if doc else f"Handler for {path}",
                    "description": doc,
                    "parameters": json.dumps(params),
                    "request_body": json.dumps({"schema": "JSON"} if method in ["POST", "PUT", "PATCH"] else {}),
                    "response_schema": json.dumps({"status": "success"}),
                    "status_codes": json.dumps(["200 OK", "400 Bad Request", "500 Internal Error"])
                }

        # Estimate complexity
        complexity = 1
        for sub in ast.walk(node):
            if isinstance(sub, (ast.If, ast.For, ast.While, ast.Try, ast.ExceptHandler)):
                complexity += 1

        return {
            "name": node.name,
            "parent_name": class_name,
            "parameters": params,
            "return_type": return_type,
            "docstring": doc.strip(),
            "line_number": node.lineno,
            "is_async": isinstance(node, ast.AsyncFunctionDef),
            "file_path": file_path,
            "complexity": complexity,
            "is_api": is_api,
            "api_details": api_details
        }

    @classmethod
    def _get_node_name(cls, node: Any) -> str:
        if node is None:
            return "Any"
        if isinstance(node, ast.Name):
            return node.id
        elif isinstance(node, ast.Constant):
            return str(node.value)
        elif isinstance(node, ast.Attribute):
            return f"{cls._get_node_name(node.value)}.{node.attr}"
        elif isinstance(node, ast.Subscript):
            return f"{cls._get_node_name(node.value)}[{cls._get_node_name(node.slice)}]"
        return "Any"

    @classmethod
    def _get_node_source(cls, node: Any) -> str:
        try:
            return ast.unparse(node)
        except Exception:
            return "decorator"

    @classmethod
    def _parse_python_regex(cls, code: str, file_path: str) -> Dict[str, Any]:
        """Fallback regex parser for Python."""
        classes = []
        functions = []
        for match in re.finditer(r"class\s+([A-Za-z0-9_]+)(?:\((.*?)\))?:", code):
            classes.append({
                "name": match.group(1),
                "bases": [b.strip() for b in match.group(2).split(",")] if match.group(2) else [],
                "docstring": "Class definition",
                "line_number": code[:match.start()].count("\n") + 1,
                "file_path": file_path,
                "methods": [],
                "complexity": 1
            })

        for match in re.finditer(r"def\s+([A-Za-z0-9_]+)\s*\((.*?)\)(?:\s*->\s*([A-Za-z0-9_\[\], ]+))?:", code):
            param_names = [p.strip().split(":")[0].split("=")[0] for p in match.group(2).split(",") if p.strip()]
            functions.append({
                "name": match.group(1),
                "parent_name": None,
                "parameters": [{"name": p, "type": "Any"} for p in param_names],
                "return_type": match.group(3).strip() if match.group(3) else "Any",
                "docstring": "Function definition",
                "line_number": code[:match.start()].count("\n") + 1,
                "file_path": file_path,
                "complexity": 1
            })

        return {
            "classes": classes,
            "functions": functions,
            "apis": [],
            "imports": [],
            "dependencies": [],
            "complexity_score": 1
        }

    @classmethod
    def parse_javascript(cls, code: str, file_path: str = "") -> Dict[str, Any]:
        """Parses JavaScript / TypeScript / React JSX code for functions, classes, APIs, and imports."""
        classes = []
        functions = []
        apis = []
        dependencies = set()

        # Extract Imports
        import_matches = re.finditer(r"import\s+.*?from\s+['\"](.*?)['\"]", code)
        for m in import_matches:
            dep = m.group(1)
            if not dep.startswith("."):
                dependencies.add(dep.split("/")[0])

        require_matches = re.finditer(r"require\s*\(\s*['\"](.*?)['\"]\s*\)", code)
        for m in require_matches:
            dep = m.group(1)
            if not dep.startswith("."):
                dependencies.add(dep.split("/")[0])

        # Extract Express/REST Endpoints
        api_pattern = re.finditer(r"(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['\"](/[^'\"]*)['\"]", code, re.IGNORECASE)
        for m in api_pattern:
            method = m.group(1).upper()
            path = m.group(2)
            apis.append({
                "method": method,
                "path": path,
                "function_name": f"handler_{method.lower()}_{path.replace('/', '_')}",
                "file_path": file_path,
                "summary": f"Handles {method} requests for {path}",
                "description": f"Express REST endpoint processing {method} request on route {path}.",
                "parameters": json.dumps([{"name": "req.params", "type": "Object"}, {"name": "req.query", "type": "Object"}]),
                "request_body": json.dumps({"schema": "JSON"} if method in ["POST", "PUT"] else {}),
                "response_schema": json.dumps({"success": True}),
                "status_codes": json.dumps(["200 OK", "400 Bad Request", "500 Internal Error"])
            })

        # Extract Classes
        class_matches = re.finditer(r"class\s+([A-Za-z0-9_]+)(?:\s+extends\s+([A-Za-z0-9_]+))?", code)
        for m in class_matches:
            classes.append({
                "name": m.group(1),
                "bases": [m.group(2)] if m.group(2) else [],
                "docstring": f"JavaScript class {m.group(1)}",
                "line_number": code[:m.start()].count("\n") + 1,
                "file_path": file_path,
                "methods": [],
                "complexity": 2
            })

        # Extract Functions (standard and arrow functions / React components)
        func_patterns = [
            r"function\s+([A-Za-z0-9_]+)\s*\((.*?)\)",
            r"const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\((.*?)\)\s*=>",
            r"export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\((.*?)\)"
        ]
        for pattern in func_patterns:
            for m in re.finditer(pattern, code):
                name = m.group(1)
                param_str = m.group(2) if len(m.groups()) > 1 and m.group(2) else ""
                params = [{"name": p.strip().split(":")[0].split("=")[0], "type": "any"} for p in param_str.split(",") if p.strip()]
                functions.append({
                    "name": name,
                    "parent_name": None,
                    "parameters": params,
                    "return_type": "any",
                    "docstring": f"Component / function {name}",
                    "line_number": code[:m.start()].count("\n") + 1,
                    "file_path": file_path,
                    "complexity": 1
                })

        return {
            "classes": classes,
            "functions": functions,
            "apis": apis,
            "imports": list(dependencies),
            "dependencies": list(dependencies),
            "complexity_score": len(functions) + len(classes)
        }

    @classmethod
    def parse_java(cls, code: str, file_path: str = "") -> Dict[str, Any]:
        """Parses Java / Spring Boot code."""
        classes = []
        functions = []
        apis = []
        dependencies = set()

        # Spring Annotations
        api_matches = re.finditer(r"@(GetMapping|PostMapping|PutMapping|DeleteMapping|RequestMapping)\s*\(\s*(?:value\s*=\s*)?['\"](.*?)['\"]", code)
        for m in api_matches:
            ann = m.group(1)
            method = "GET"
            if "Post" in ann: method = "POST"
            elif "Put" in ann: method = "PUT"
            elif "Delete" in ann: method = "DELETE"
            path = m.group(2)
            apis.append({
                "method": method,
                "path": path,
                "function_name": f"endpoint_{method.lower()}",
                "file_path": file_path,
                "summary": f"Spring endpoint {method} {path}",
                "description": f"Controller method handling {path}.",
                "parameters": json.dumps([]),
                "request_body": json.dumps({}),
                "response_schema": json.dumps({"status": 200}),
                "status_codes": json.dumps(["200 OK", "400 Bad Request"])
            })

        # Classes
        class_matches = re.finditer(r"(?:public\s+|private\s+)?class\s+([A-Za-z0-9_]+)(?:\s+extends\s+([A-Za-z0-9_]+))?", code)
        for m in class_matches:
            classes.append({
                "name": m.group(1),
                "bases": [m.group(2)] if m.group(2) else [],
                "docstring": f"Java class {m.group(1)}",
                "line_number": code[:m.start()].count("\n") + 1,
                "file_path": file_path,
                "methods": [],
                "complexity": 2
            })

        # Methods
        method_matches = re.finditer(r"(?:public|protected|private)\s+([A-Za-z0-9_<>[\]]+)\s+([A-Za-z0-9_]+)\s*\((.*?)\)", code)
        for m in method_matches:
            ret_type = m.group(1)
            name = m.group(2)
            if name not in ["if", "for", "while", "catch", "switch"]:
                params = [{"name": p.strip(), "type": "Object"} for p in m.group(3).split(",") if p.strip()]
                functions.append({
                    "name": name,
                    "parent_name": None,
                    "parameters": params,
                    "return_type": ret_type,
                    "docstring": f"Java method {name}",
                    "line_number": code[:m.start()].count("\n") + 1,
                    "file_path": file_path,
                    "complexity": 1
                })

        return {
            "classes": classes,
            "functions": functions,
            "apis": apis,
            "imports": [],
            "dependencies": ["Spring", "Java-Standard-Lib"],
            "complexity_score": len(functions) + len(classes)
        }

    @classmethod
    def analyze_source_file(cls, content: str, file_path: str) -> Dict[str, Any]:
        """Analyzes a source file based on file extension."""
        lang = cls.detect_language(file_path)
        if lang == "Python":
            return cls.parse_python_ast(content, file_path)
        elif lang in ["JavaScript", "TypeScript", "React JSX", "React TSX"]:
            return cls.parse_javascript(content, file_path)
        elif lang == "Java":
            return cls.parse_java(content, file_path)
        else:
            return {
                "classes": [],
                "functions": [],
                "apis": [],
                "imports": [],
                "dependencies": [],
                "complexity_score": 1
            }

    @classmethod
    def extract_and_analyze_zip(cls, zip_path: str, extract_to: str) -> Dict[str, Any]:
        """Extracts a ZIP project and analyzes all files."""
        os.makedirs(extract_to, exist_ok=True)
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(extract_to)

        files_data = []
        all_classes = []
        all_functions = []
        all_apis = []
        all_dependencies = set()
        language_breakdown = {}

        for root, _, filenames in os.walk(extract_to):
            # Ignore hidden or node_modules or venv directories
            if any(part.startswith(".") or part in ["node_modules", "venv", "__pycache__", "dist", "build"] for part in root.split(os.sep)):
                continue

            for fname in filenames:
                fpath = os.path.join(root, fname)
                rel_path = os.path.relpath(fpath, extract_to).replace("\\", "/")
                lang = cls.detect_language(rel_path)
                
                try:
                    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    
                    file_size = os.path.getsize(fpath)
                    lines = content.count("\n") + 1
                    
                    language_breakdown[lang] = language_breakdown.get(lang, 0) + 1

                    analysis = cls.analyze_source_file(content, rel_path)
                    all_classes.extend(analysis["classes"])
                    all_functions.extend(analysis["functions"])
                    all_apis.extend(analysis["apis"])
                    for dep in analysis.get("dependencies", []):
                        all_dependencies.add(dep)

                    files_data.append({
                        "file_path": rel_path,
                        "file_name": fname,
                        "file_size": file_size,
                        "language": lang,
                        "line_count": lines,
                        "content": content,
                        "analysis": analysis
                    })
                except Exception as e:
                    print(f"Error processing file {rel_path}: {e}")

        # Build Directory Tree Text
        tree_text = cls.generate_directory_tree(extract_to)

        return {
            "files": files_data,
            "classes": all_classes,
            "functions": all_functions,
            "apis": all_apis,
            "dependencies": list(all_dependencies),
            "language_breakdown": language_breakdown,
            "directory_tree": tree_text,
            "total_files": len(files_data),
            "total_classes": len(all_classes),
            "total_functions": len(all_functions),
            "total_apis": len(all_apis),
            "total_dependencies": len(all_dependencies)
        }

    @classmethod
    def generate_directory_tree(cls, root_dir: str, prefix: str = "") -> str:
        """Generates an ASCII tree representation of the project."""
        lines = []
        try:
            entries = sorted(os.listdir(root_dir))
        except Exception:
            return ""

        # Filter out noisy directories
        entries = [e for e in entries if not e.startswith(".") and e not in ["node_modules", "venv", "__pycache__", "dist", "build"]]

        for i, entry in enumerate(entries):
            is_last = (i == len(entries) - 1)
            connector = "└── " if is_last else "├── "
            path = os.path.join(root_dir, entry)
            lines.append(f"{prefix}{connector}{entry}")

            if os.path.isdir(path):
                new_prefix = prefix + ("    " if is_last else "│   ")
                sub_tree = cls.generate_directory_tree(path, new_prefix)
                if sub_tree:
                    lines.append(sub_tree)

        return "\n".join(lines)
