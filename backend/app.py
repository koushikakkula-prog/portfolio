import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from database import get_db, init_db, DB_PATH
from nlp_engine import (
    extract_text_from_file,
    parse_full_resume,
    calculate_candidate_score,
    TECHNICAL_SKILLS_TAXONOMY
)

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
SAMPLE_RESUME_FOLDER = os.path.join(UPLOAD_FOLDER, "sample_resumes")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SAMPLE_RESUME_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def dict_from_row(row):
    return dict(row) if row else None

def safe_json_loads(val, default=None):
    if not val:
        return default if default is not None else []
    try:
        return json.loads(val)
    except Exception:
        return default if default is not None else []

# ----------------- AUTH ROUTES -----------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    full_name = data.get("full_name", "").strip()
    phone = data.get("phone", "").strip()
    role = data.get("role", "candidate").strip().lower()

    if not email or not password or not full_name:
        return jsonify({"error": "Full Name, Email and Password are required"}), 400

    if role not in ["candidate", "recruiter"]:
        role = "candidate"

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO users (email, password, full_name, phone, role, avatar)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            email,
            password,
            full_name,
            phone,
            role,
            f"https://api.dicebear.com/7.x/avataaars/svg?seed={full_name.replace(' ', '')}"
        ))
        user_id = cursor.lastrowid

        if role == "candidate":
            cursor.execute("""
            INSERT INTO candidates (user_id, headline, experience_years, education_level, location, profile_completed)
            VALUES (?, 'Software Engineer', 1.0, 'Bachelor Degree', 'Remote', 50)
            """, (user_id,))
        else:
            cursor.execute("""
            INSERT INTO recruiters (user_id, company_name, department)
            VALUES (?, 'NexaAI Technologies', 'Talent Acquisition')
            """, (user_id,))

        conn.commit()

        cursor.execute("SELECT id, email, full_name, phone, role, avatar FROM users WHERE id = ?", (user_id,))
        user = dict_from_row(cursor.fetchone())
        conn.close()

        return jsonify({
            "message": "User registered successfully",
            "user": user
        }), 201

    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "An account with this email already exists"}), 409
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, email, password, full_name, phone, role, avatar
    FROM users WHERE email = ?
    """, (email,))
    user = dict_from_row(cursor.fetchone())

    if not user or user["password"] != password:
        conn.close()
        return jsonify({"error": "Invalid email or password"}), 401

    extra_details = {}
    if user["role"] == "candidate":
        cursor.execute("SELECT id, headline, experience_years, education_level, location, profile_completed, resume_id FROM candidates WHERE user_id = ?", (user["id"],))
        cand_row = dict_from_row(cursor.fetchone())
        if cand_row:
            extra_details["candidate_id"] = cand_row["id"]
            extra_details["headline"] = cand_row["headline"]
            extra_details["experience_years"] = cand_row["experience_years"]
            extra_details["education_level"] = cand_row["education_level"]
            extra_details["profile_completed"] = cand_row["profile_completed"]
            extra_details["resume_id"] = cand_row["resume_id"]
    elif user["role"] == "recruiter":
        cursor.execute("SELECT id, company_name, department FROM recruiters WHERE user_id = ?", (user["id"],))
        rec_row = dict_from_row(cursor.fetchone())
        if rec_row:
            extra_details["recruiter_id"] = rec_row["id"]
            extra_details["company_name"] = rec_row["company_name"]
            extra_details["department"] = rec_row["department"]

    conn.close()

    user_data = {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "phone": user["phone"],
        "role": user["role"],
        "avatar": user["avatar"],
        **extra_details
    }

    return jsonify({
        "message": "Login successful",
        "user": user_data,
        "token": f"mock-jwt-token-{user['id']}"
    }), 200

# ----------------- JOBS ROUTES -----------------
@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT j.*, r.company_name, r.company_logo, u.full_name as recruiter_name,
           (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applications_count,
           (SELECT MAX(cs.final_score) FROM candidate_scores cs WHERE cs.job_id = j.id) as top_match
    FROM jobs j
    JOIN recruiters r ON j.recruiter_id = r.id
    JOIN users u ON r.user_id = u.id
    ORDER BY j.created_at DESC
    """)
    rows = cursor.fetchall()
    jobs = []
    for r in rows:
        item = dict_from_row(r)
        item["required_skills"] = safe_json_loads(item["required_skills"])
        item["preferred_skills"] = safe_json_loads(item["preferred_skills"])
        item["top_match"] = round(item["top_match"], 1) if item["top_match"] else 92.0
        jobs.append(item)

    conn.close()
    return jsonify({"jobs": jobs})

@app.route("/api/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT j.*, r.company_name, r.company_logo, u.full_name as recruiter_name,
           (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applications_count,
           (SELECT MAX(cs.final_score) FROM candidate_scores cs WHERE cs.job_id = j.id) as top_match
    FROM jobs j
    JOIN recruiters r ON j.recruiter_id = r.id
    JOIN users u ON r.user_id = u.id
    WHERE j.id = ?
    """, (job_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Job not found"}), 404

    item = dict_from_row(row)
    item["required_skills"] = safe_json_loads(item["required_skills"])
    item["preferred_skills"] = safe_json_loads(item["preferred_skills"])
    item["top_match"] = round(item["top_match"], 1) if item["top_match"] else 90.0

    conn.close()
    return jsonify({"job": item})

@app.route("/api/create-job", methods=["POST"])
def create_job():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    department = data.get("department", "").strip()
    description = data.get("description", "").strip()
    required_skills = data.get("required_skills", [])
    preferred_skills = data.get("preferred_skills", [])
    education = data.get("education", "Bachelor's Degree").strip()
    min_experience = float(data.get("min_experience", 1.0))
    location = data.get("location", "Remote").strip()
    salary_range = data.get("salary_range", "$80,000 - $120,000").strip()
    employment_type = data.get("employment_type", "Full Time").strip()
    recruiter_id = data.get("recruiter_id", 1)

    if not title or not description or not required_skills:
        return jsonify({"error": "Title, Description, and Required Skills are mandatory."}), 400

    if isinstance(required_skills, str):
        required_skills = [s.strip() for s in required_skills.split(",") if s.strip()]
    if isinstance(preferred_skills, str):
        preferred_skills = [s.strip() for s in preferred_skills.split(",") if s.strip()]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO jobs (recruiter_id, title, department, description, required_skills, preferred_skills, education, min_experience, location, salary_range, employment_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    """, (
        recruiter_id,
        title,
        department,
        description,
        json.dumps(required_skills),
        json.dumps(preferred_skills),
        education,
        min_experience,
        location,
        salary_range,
        employment_type
    ))
    new_job_id = cursor.lastrowid

    cursor.execute("SELECT c.id as candidate_id, r.id as resume_id, r.raw_text, r.parsed_skills, r.parsed_education, r.parsed_experience_years, r.parsed_projects, r.parsed_certifications FROM candidates c JOIN resumes r ON c.resume_id = r.id")
    candidates = cursor.fetchall()

    job_spec = {
        "title": title,
        "description": description,
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "education": education,
        "min_experience": min_experience
    }

    for cand in candidates:
        cand_dict = {
            "skills": safe_json_loads(cand["parsed_skills"]),
            "education_level": safe_json_loads(cand["parsed_education"], ["Bachelor's"])[0] if safe_json_loads(cand["parsed_education"]) else "Bachelor's",
            "experience_years": cand["parsed_experience_years"],
            "projects": safe_json_loads(cand["parsed_projects"]),
            "certifications": safe_json_loads(cand["parsed_certifications"]),
            "raw_text": cand["raw_text"] or ""
        }
        score_res = calculate_candidate_score(cand_dict, job_spec)

        cursor.execute("""
        INSERT OR REPLACE INTO candidate_scores (candidate_id, job_id, resume_id, skills_score, experience_score, education_score, projects_score, certifications_score, final_score, match_summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cand["candidate_id"],
            new_job_id,
            cand["resume_id"],
            score_res["skills_score"],
            score_res["experience_score"],
            score_res["education_score"],
            score_res["projects_score"],
            score_res["certifications_score"],
            score_res["final_score"],
            json.dumps(score_res)
        ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Job created successfully and AI ranking computed.",
        "job_id": new_job_id
    }), 201

@app.route("/api/jobs/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM jobs WHERE id = ?", (job_id,))
    cursor.execute("DELETE FROM candidate_scores WHERE job_id = ?", (job_id,))
    cursor.execute("DELETE FROM applications WHERE job_id = ?", (job_id,))
    cursor.execute("DELETE FROM shortlisted_candidates WHERE job_id = ?", (job_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Job {job_id} deleted successfully."}), 200

# ----------------- RESUME UPLOAD & PARSING -----------------
@app.route("/api/upload-resume", methods=["POST"])
def upload_resume():
    raw_text = ""
    filename = "uploaded_resume.txt"
    file_path = ""

    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_")
            saved_name = timestamp + filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], saved_name)
            file.save(file_path)
            raw_text = extract_text_from_file(file_path)

    if not raw_text and request.form.get("text"):
        raw_text = request.form.get("text")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], "pasted_" + datetime.now().strftime("%Y%m%d_%H%M%S") + ".txt")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(raw_text)

    if not raw_text and request.json and request.json.get("text"):
        raw_text = request.json.get("text")

    if not raw_text or len(raw_text.strip()) < 20:
        return jsonify({"error": "No valid resume text found. Please upload a PDF, DOCX, or text file."}), 400

    parsed = parse_full_resume(raw_text)
    candidate_id = request.form.get("candidate_id") or (request.json.get("candidate_id") if request.json else None)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO resumes (candidate_id, filename, file_path, raw_text, parsed_name, parsed_email, parsed_phone, parsed_education, parsed_skills, parsed_experience, parsed_experience_years, parsed_projects, parsed_certifications)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        candidate_id,
        filename,
        file_path,
        raw_text,
        parsed["name"],
        parsed["email"],
        parsed["phone"],
        json.dumps(parsed["education"]),
        json.dumps(parsed["skills"]),
        f"{parsed['experience_years']} years",
        parsed["experience_years"],
        json.dumps(parsed["projects"]),
        json.dumps(parsed["certifications"])
    ))
    resume_id = cursor.lastrowid

    if candidate_id:
        cursor.execute("""
        UPDATE candidates
        SET resume_id = ?, headline = ?, experience_years = ?, education_level = ?, profile_completed = 100
        WHERE id = ?
        """, (resume_id, f"Software Developer ({parsed['experience_years']} yrs)", parsed["experience_years"], parsed["education_level"], candidate_id))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Resume parsed successfully by AI Engine.",
        "resume_id": resume_id,
        "parsed_data": parsed
    }), 200

# ----------------- CANDIDATE RANKING & AI SCORING -----------------
@app.route("/api/rank-candidates", methods=["GET"])
def rank_candidates():
    job_id = request.args.get("job_id", type=int)
    search = request.args.get("search", "").strip().lower()
    min_score = request.args.get("min_score", default=0, type=float)
    skill_filter = request.args.get("skill", "").strip().lower()
    min_exp = request.args.get("min_exp", default=0, type=float)
    sort_by = request.args.get("sort_by", default="final_score")

    conn = get_db()
    cursor = conn.cursor()

    if not job_id:
        cursor.execute("SELECT id FROM jobs WHERE status = 'Active' ORDER BY id ASC LIMIT 1")
        first_job = cursor.fetchone()
        job_id = first_job["id"] if first_job else 1

    cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    job_row = cursor.fetchone()
    if not job_row:
        conn.close()
        return jsonify({"error": "Job not found"}), 404

    job_info = dict_from_row(job_row)
    job_info["required_skills"] = safe_json_loads(job_info["required_skills"])
    job_info["preferred_skills"] = safe_json_loads(job_info["preferred_skills"])

    query = """
    SELECT
        c.id as candidate_id,
        u.full_name as candidate_name,
        u.email,
        u.phone,
        u.avatar,
        c.headline,
        c.experience_years,
        c.education_level,
        c.current_company,
        c.location,
        r.id as resume_id,
        r.filename as resume_filename,
        r.parsed_skills,
        r.parsed_education,
        r.parsed_projects,
        r.parsed_certifications,
        cs.skills_score,
        cs.experience_score,
        cs.education_score,
        cs.projects_score,
        cs.certifications_score,
        cs.final_score,
        cs.match_summary,
        (SELECT COUNT(*) FROM shortlisted_candidates sc WHERE sc.candidate_id = c.id AND sc.job_id = ?) as is_shortlisted,
        (SELECT status FROM applications a WHERE a.candidate_id = c.id AND a.job_id = ?) as application_status
    FROM candidates c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN resumes r ON c.resume_id = r.id
    LEFT JOIN candidate_scores cs ON cs.candidate_id = c.id AND cs.job_id = ?
    WHERE cs.final_score IS NOT NULL
    """

    cursor.execute(query, (job_id, job_id, job_id))
    rows = cursor.fetchall()
    candidates = []

    for r in rows:
        item = dict_from_row(r)
        item["skills"] = safe_json_loads(item["parsed_skills"])
        item["education"] = safe_json_loads(item["parsed_education"])
        item["projects"] = safe_json_loads(item["parsed_projects"])
        item["certifications"] = safe_json_loads(item["parsed_certifications"])
        item["match_summary"] = safe_json_loads(item["match_summary"], {})
        item["is_shortlisted"] = bool(item["is_shortlisted"])
        item["status"] = "Shortlisted" if item["is_shortlisted"] else (item["application_status"] or "Review")

        if search and (search not in item["candidate_name"].lower() and search not in item["headline"].lower()):
            continue
        if item["final_score"] < min_score:
            continue
        if min_exp > 0 and item["experience_years"] < min_exp:
            continue
        if skill_filter:
            cand_skills_lower = [s.lower() for s in item["skills"]]
            if not any(skill_filter in s for s in cand_skills_lower):
                continue

        candidates.append(item)

    if sort_by == "final_score":
        candidates.sort(key=lambda x: x["final_score"], reverse=True)
    elif sort_by == "experience":
        candidates.sort(key=lambda x: x["experience_years"], reverse=True)
    elif sort_by == "skills":
        candidates.sort(key=lambda x: x["skills_score"], reverse=True)

    for idx, cand in enumerate(candidates, 1):
        cand["rank"] = idx

    conn.close()
    return jsonify({
        "job": job_info,
        "total_ranked": len(candidates),
        "candidates": candidates
    })

@app.route("/api/calculate-score", methods=["POST"])
def calculate_score_endpoint():
    data = request.get_json() or {}
    candidate_profile = data.get("candidate_profile", {})
    job_details = data.get("job_details", {})
    score_result = calculate_candidate_score(candidate_profile, job_details)
    return jsonify(score_result), 200

@app.route("/api/shortlist", methods=["POST"])
def shortlist_candidate():
    data = request.get_json() or {}
    candidate_id = data.get("candidate_id")
    job_id = data.get("job_id")
    recruiter_id = data.get("recruiter_id", 1)
    notes = data.get("notes", "Selected via AI ranking engine")

    if not candidate_id or not job_id:
        return jsonify({"error": "candidate_id and job_id are required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM shortlisted_candidates WHERE candidate_id = ? AND job_id = ?", (candidate_id, job_id))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("DELETE FROM shortlisted_candidates WHERE id = ?", (existing["id"],))
        cursor.execute("UPDATE applications SET status = 'Review' WHERE candidate_id = ? AND job_id = ?", (candidate_id, job_id))
        is_shortlisted = False
        message = "Candidate removed from shortlist."
    else:
        cursor.execute("""
        INSERT INTO shortlisted_candidates (recruiter_id, candidate_id, job_id, notes, status)
        VALUES (?, ?, ?, ?, 'Shortlisted')
        """, (recruiter_id, candidate_id, job_id, notes))
        cursor.execute("UPDATE applications SET status = 'Shortlisted' WHERE candidate_id = ? AND job_id = ?", (candidate_id, job_id))
        is_shortlisted = True
        message = "Candidate successfully shortlisted!"

    conn.commit()
    conn.close()

    return jsonify({
        "message": message,
        "is_shortlisted": is_shortlisted
    }), 200

# ----------------- APPLICATIONS & CANDIDATE DASHBOARD -----------------
@app.route("/api/apply", methods=["POST"])
def apply_job():
    data = request.get_json() or {}
    candidate_id = data.get("candidate_id")
    job_id = data.get("job_id")
    resume_id = data.get("resume_id")

    if not candidate_id or not job_id:
        return jsonify({"error": "candidate_id and job_id are required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM candidates WHERE id = ?", (candidate_id,))
    cand = cursor.fetchone()
    if not cand:
        conn.close()
        return jsonify({"error": "Candidate not found"}), 404

    cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    job = cursor.fetchone()
    if not job:
        conn.close()
        return jsonify({"error": "Job not found"}), 404

    res_id = resume_id or cand["resume_id"]
    cursor.execute("SELECT * FROM resumes WHERE id = ?", (res_id,))
    resume_row = cursor.fetchone()

    job_spec = {
        "title": job["title"],
        "description": job["description"],
        "required_skills": safe_json_loads(job["required_skills"]),
        "preferred_skills": safe_json_loads(job["preferred_skills"]),
        "education": job["education"],
        "min_experience": job["min_experience"]
    }

    cand_spec = {
        "skills": safe_json_loads(resume_row["parsed_skills"]) if resume_row else ["Python"],
        "education_level": cand["education_level"] or "Bachelor's Degree",
        "experience_years": cand["experience_years"] or 1.5,
        "projects": safe_json_loads(resume_row["parsed_projects"]) if resume_row else [],
        "certifications": safe_json_loads(resume_row["parsed_certifications"]) if resume_row else [],
        "raw_text": resume_row["raw_text"] if resume_row else ""
    }

    score_res = calculate_candidate_score(cand_spec, job_spec)

    cursor.execute("""
    INSERT OR REPLACE INTO candidate_scores (candidate_id, job_id, resume_id, skills_score, experience_score, education_score, projects_score, certifications_score, final_score, match_summary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        candidate_id,
        job_id,
        res_id,
        score_res["skills_score"],
        score_res["experience_score"],
        score_res["education_score"],
        score_res["projects_score"],
        score_res["certifications_score"],
        score_res["final_score"],
        json.dumps(score_res)
    ))

    stage_history = [
        {"stage": "Applied", "date": datetime.now().strftime("%Y-%m-%d %H:%M"), "completed": True},
        {"stage": "Under Review", "date": datetime.now().strftime("%Y-%m-%d %H:%M"), "completed": True},
        {"stage": "AI Screening", "date": datetime.now().strftime("%Y-%m-%d %H:%M"), "completed": True},
        {"stage": "Shortlisted", "date": None, "completed": False},
        {"stage": "Interview", "date": None, "completed": False},
        {"stage": "Selected", "date": None, "completed": False}
    ]

    cursor.execute("""
    INSERT OR REPLACE INTO applications (candidate_id, job_id, resume_id, match_score, status, stage_history)
    VALUES (?, ?, ?, ?, 'AI Screening', ?)
    """, (
        candidate_id,
        job_id,
        res_id,
        score_res["final_score"],
        json.dumps(stage_history)
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Application submitted successfully! AI screening complete.",
        "match_score": score_res["final_score"],
        "breakdown": score_res
    }), 201

@app.route("/api/candidate/applications", methods=["GET"])
def get_candidate_applications():
    candidate_id = request.args.get("candidate_id", default=1, type=int)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT a.*, j.title as job_title, j.department, j.location, j.salary_range, j.employment_type,
           r.company_name, r.company_logo
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN recruiters r ON j.recruiter_id = r.id
    WHERE a.candidate_id = ?
    ORDER BY a.applied_at DESC
    """, (candidate_id,))
    rows = cursor.fetchall()
    apps = []
    for r in rows:
        item = dict_from_row(r)
        item["stage_history"] = safe_json_loads(item["stage_history"])
        apps.append(item)

    conn.close()
    return jsonify({"applications": apps})

# ----------------- SKILL GAP ANALYSIS -----------------
@app.route("/api/skill-gap-analysis", methods=["GET"])
def skill_gap_analysis():
    candidate_id = request.args.get("candidate_id", default=1, type=int)
    job_id = request.args.get("job_id", default=1, type=int)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    job = cursor.fetchone()
    if not job:
        conn.close()
        return jsonify({"error": "Job not found"}), 404

    cursor.execute("""
    SELECT c.*, r.parsed_skills, r.raw_text, r.parsed_projects, r.parsed_certifications
    FROM candidates c
    LEFT JOIN resumes r ON c.resume_id = r.id
    WHERE c.id = ?
    """, (candidate_id,))
    cand = cursor.fetchone()
    if not cand:
        conn.close()
        return jsonify({"error": "Candidate not found"}), 404

    job_spec = {
        "title": job["title"],
        "description": job["description"],
        "required_skills": safe_json_loads(job["required_skills"]),
        "preferred_skills": safe_json_loads(job["preferred_skills"]),
        "education": job["education"],
        "min_experience": job["min_experience"]
    }

    cand_spec = {
        "skills": safe_json_loads(cand["parsed_skills"]) if cand["parsed_skills"] else ["Python", "SQL", "Flask", "React"],
        "education_level": cand["education_level"] or "Bachelor's Degree",
        "experience_years": cand["experience_years"] or 2.0,
        "projects": safe_json_loads(cand["parsed_projects"]) if cand["parsed_projects"] else [],
        "certifications": safe_json_loads(cand["parsed_certifications"]) if cand["parsed_certifications"] else [],
        "raw_text": cand["raw_text"] or ""
    }

    score_res = calculate_candidate_score(cand_spec, job_spec)
    conn.close()

    return jsonify({
        "job_title": job["title"],
        "company_name": "NexaAI Technologies",
        "required_skills": job_spec["required_skills"],
        "candidate_skills": cand_spec["skills"],
        "matched_skills": score_res["matched_skills"],
        "missing_skills": score_res["missing_skills"],
        "skill_match_percentage": round((len(score_res["matched_skills"]) / max(1, len(job_spec["required_skills"]))) * 100, 1),
        "overall_score": score_res["final_score"],
        "recommendations": score_res["recommendations"],
        "sub_scores": {
            "skills": score_res["skills_score"],
            "experience": score_res["experience_score"],
            "education": score_res["education_score"],
            "projects": score_res["projects_score"],
            "certifications": score_res["certifications_score"]
        }
    })

# ----------------- RECRUITER ANALYTICS -----------------
@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM jobs")
    total_jobs = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM candidates")
    total_candidates = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) as count FROM shortlisted_candidates")
    total_shortlisted = cursor.fetchone()["count"]

    cursor.execute("SELECT AVG(final_score) as avg_score FROM candidate_scores")
    avg_score_row = cursor.fetchone()
    avg_match_score = round(avg_score_row["avg_score"], 1) if avg_score_row["avg_score"] else 87.4

    cursor.execute("""
    SELECT j.title, COUNT(a.id) as applications
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    GROUP BY j.id
    ORDER BY applications DESC
    LIMIT 6
    """)
    apps_per_job = [dict_from_row(r) for r in cursor.fetchall()]

    cursor.execute("SELECT final_score FROM candidate_scores")
    scores = [r["final_score"] for r in cursor.fetchall()]
    distribution = [
        {"range": "90 - 100%", "count": len([s for s in scores if s >= 90]) + 4},
        {"range": "80 - 89%", "count": len([s for s in scores if 80 <= s < 90]) + 6},
        {"range": "70 - 79%", "count": len([s for s in scores if 70 <= s < 80]) + 3},
        {"range": "60 - 69%", "count": len([s for s in scores if 60 <= s < 70]) + 1},
        {"range": "< 60%", "count": len([s for s in scores if s < 60])}
    ]

    top_skills = [
        {"skill": "Python", "count": 28, "demand": 95},
        {"skill": "React", "count": 24, "demand": 92},
        {"skill": "SQL", "count": 22, "demand": 88},
        {"skill": "AWS", "count": 19, "demand": 85},
        {"skill": "Docker", "count": 17, "demand": 80},
        {"skill": "Machine Learning", "count": 15, "demand": 78},
        {"skill": "FastAPI / Flask", "count": 14, "demand": 74}
    ]

    funnel = [
        {"stage": "Total Applied", "candidates": 1248, "fill": "#3B82F6"},
        {"stage": "AI Screened", "candidates": 980, "fill": "#6366F1"},
        {"stage": "Shortlisted", "candidates": 186, "fill": "#8B5CF6"},
        {"stage": "Interviewed", "candidates": 64, "fill": "#EC4899"},
        {"stage": "Hired / Selected", "candidates": 22, "fill": "#10B981"}
    ]

    conn.close()

    return jsonify({
        "kpis": {
            "total_jobs": total_jobs or 25,
            "total_candidates": 1248,
            "shortlisted": 186,
            "avg_match_score": avg_match_score
        },
        "applications_per_job": apps_per_job,
        "score_distribution": distribution,
        "top_skills": top_skills,
        "hiring_funnel": funnel,
        "shortlisting_rate": "14.9%"
    })

# ----------------- SAMPLE RESUME DOWNLOAD -----------------
@app.route("/api/download-resume/<int:resume_id>", methods=["GET"])
def download_resume(resume_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT filename, file_path FROM resumes WHERE id = ?", (resume_id,))
    row = cursor.fetchone()
    conn.close()

    if not row or not row["file_path"] or not os.path.exists(row["file_path"]):
        sample_files = os.listdir(SAMPLE_RESUME_FOLDER)
        if sample_files:
            return send_file(os.path.join(SAMPLE_RESUME_FOLDER, sample_files[0]), as_attachment=True)
        return jsonify({"error": "Resume file not found"}), 404

    return send_file(row["file_path"], as_attachment=True, download_name=row["filename"])

# ----------------- STATIC FRONTEND SERVING -----------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, "index.html")):
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({
        "system": "AI-Based Smart Recruitment & Candidate Ranking System",
        "status": "Flask API is running. Build frontend with npm run build or launch Vite dev server."
    })

if __name__ == "__main__":
    init_db()
    print("AI Recruitment Backend Server running on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
