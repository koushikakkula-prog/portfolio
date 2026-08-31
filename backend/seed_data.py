import sqlite3
import json
import os
from database import get_db, init_db, DB_PATH
from nlp_engine import calculate_candidate_score, parse_full_resume

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

def create_sample_pdf(file_path, name, email, phone, headline, education, skills, experience, projects, certs):
    if not REPORTLAB_AVAILABLE:
        return
    try:
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        
        # Header
        c.setFont("Helvetica-Bold", 18)
        c.setFillColorRGB(0.1, 0.2, 0.5)
        c.drawString(50, height - 50, name)
        
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0.3, 0.3, 0.3)
        c.drawString(50, height - 68, f"{email} | {phone} | {headline}")
        
        # Line
        c.setStrokeColorRGB(0.8, 0.8, 0.8)
        c.setLineWidth(1)
        c.line(50, height - 78, width - 50, height - 78)
        
        y = height - 100
        
        # Summary
        c.setFont("Helvetica-Bold", 12)
        c.setFillColorRGB(0.1, 0.2, 0.5)
        c.drawString(50, y, "PROFESSIONAL SUMMARY")
        y -= 18
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0.2, 0.2, 0.2)
        c.drawString(50, y, f"Results-driven {headline} with proven expertise in building scalable, reliable software systems.")
        y -= 25
        
        # Skills
        c.setFont("Helvetica-Bold", 12)
        c.setFillColorRGB(0.1, 0.2, 0.5)
        c.drawString(50, y, "TECHNICAL SKILLS")
        y -= 18
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0.2, 0.2, 0.2)
        skills_str = ", ".join(skills)
        c.drawString(50, y, skills_str[:90])
        if len(skills_str) > 90:
            y -= 14
            c.drawString(50, y, skills_str[90:180])
        y -= 25
        
        # Experience
        c.setFont("Helvetica-Bold", 12)
        c.setFillColorRGB(0.1, 0.2, 0.5)
        c.drawString(50, y, "EXPERIENCE")
        y -= 18
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0.2, 0.2, 0.2)
        c.drawString(50, y, f"{experience} years of software development experience across agile engineering teams.")
        y -= 14
        c.drawString(50, y, "• Designed and maintained high-throughput REST APIs and client-facing interfaces.")
        y -= 14
        c.drawString(50, y, "• Implemented test automation, code reviews, and CI/CD deployment pipelines.")
        y -= 25
        
        # Education
        c.setFont("Helvetica-Bold", 12)
        c.setFillColorRGB(0.1, 0.2, 0.5)
        c.drawString(50, y, "EDUCATION")
        y -= 18
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0.2, 0.2, 0.2)
        c.drawString(50, y, education)
        y -= 25
        
        # Projects
        c.setFont("Helvetica-Bold", 12)
        c.setFillColorRGB(0.1, 0.2, 0.5)
        c.drawString(50, y, "KEY PROJECTS")
        y -= 18
        c.setFont("Helvetica", 10)
        c.setFillColorRGB(0.2, 0.2, 0.2)
        for proj in projects[:2]:
            c.drawString(50, y, f"• {proj['title']}: {proj['description'][:75]}")
            y -= 14
        y -= 15
        
        # Certifications
        if certs:
            c.setFont("Helvetica-Bold", 12)
            c.setFillColorRGB(0.1, 0.2, 0.5)
            c.drawString(50, y, "CERTIFICATIONS")
            y -= 18
            c.setFont("Helvetica", 10)
            c.setFillColorRGB(0.2, 0.2, 0.2)
            c.drawString(50, y, ", ".join(certs))
            
        c.save()
    except Exception as e:
        print(f"Error generating sample PDF for {name}: {e}")

def seed():
    init_db()
    conn = get_db()
    cursor = conn.cursor()
    
    # Clear existing data for fresh seed
    cursor.execute("DELETE FROM applications")
    cursor.execute("DELETE FROM shortlisted_candidates")
    cursor.execute("DELETE FROM candidate_scores")
    cursor.execute("DELETE FROM resumes")
    cursor.execute("DELETE FROM jobs")
    cursor.execute("DELETE FROM recruiters")
    cursor.execute("DELETE FROM candidates")
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM skills")
    
    sample_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads", "sample_resumes")
    os.makedirs(sample_dir, exist_ok=True)
    
    # 1. Insert Recruiter
    cursor.execute("""
    INSERT INTO users (email, password, full_name, phone, role, avatar)
    VALUES ('recruiter@airecruit.com', 'password123', 'Priya Sharma', '+1 (555) 019-2834', 'recruiter', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
    """)
    recruiter_user_id = cursor.lastrowid
    
    cursor.execute("""
    INSERT INTO recruiters (user_id, company_name, department, company_logo)
    VALUES (?, 'NexaAI Cloud & Tech', 'Talent Acquisition & Engineering', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100')
    """, (recruiter_user_id,))
    recruiter_id = cursor.lastrowid
    
    # 2. Insert Jobs
    sample_jobs = [
        {
            "title": "Python Full Stack Developer",
            "department": "Core Platform Engineering",
            "description": "We are seeking a talented Python Full Stack Developer with strong experience in Python, Flask/Django, SQL database design, React, and REST APIs. The ideal candidate will build high-performance microservices and intuitive web interfaces.",
            "required_skills": ["Python", "Flask", "SQL", "React", "AWS"],
            "preferred_skills": ["Docker", "PostgreSQL", "Tailwind CSS", "Redis"],
            "education": "Bachelor's Degree in Computer Science or related field",
            "min_experience": 2.0,
            "location": "Bangalore, India (Hybrid)",
            "salary_range": "$90,000 - $125,000 / ₹18 - 24 LPA",
            "employment_type": "Full Time",
            "status": "Active"
        },
        {
            "title": "Java Backend Engineer",
            "department": "Enterprise Systems",
            "description": "Looking for a seasoned Java Developer experienced in Spring Boot, Microservices, REST APIs, SQL, and Docker to build secure and scalable banking infrastructure.",
            "required_skills": ["Java", "Spring Boot", "SQL", "Microservices", "Docker"],
            "preferred_skills": ["Kubernetes", "AWS", "Kafka", "Redis"],
            "education": "Bachelor's Degree in Computer Science / IT",
            "min_experience": 3.0,
            "location": "Hyderabad, India / Remote",
            "salary_range": "$100,000 - $135,000 / ₹20 - 28 LPA",
            "employment_type": "Full Time",
            "status": "Active"
        },
        {
            "title": "Data Analyst & BI Specialist",
            "department": "Data & Analytics",
            "description": "Join our data team to analyze user engagement, build interactive dashboards, execute complex SQL queries, and perform statistical modeling with Python and Pandas.",
            "required_skills": ["Python", "SQL", "Data Analysis", "Pandas", "Scikit-learn"],
            "preferred_skills": ["Tableau", "Power BI", "Statistics", "Machine Learning"],
            "education": "Bachelor's Degree in Data Science, Statistics, or CS",
            "min_experience": 1.5,
            "location": "Pune, India (Remote)",
            "salary_range": "$75,000 - $105,000 / ₹14 - 20 LPA",
            "employment_type": "Full Time",
            "status": "Active"
        },
        {
            "title": "React Frontend Engineer",
            "department": "User Experience",
            "description": "Create responsive, accessible, high-performance web applications using React, TypeScript/JavaScript, Tailwind CSS, Redux, and modern frontend tools.",
            "required_skills": ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
            "preferred_skills": ["TypeScript", "Redux", "REST API", "Next.js"],
            "education": "Bachelor's Degree in CS, BCA, or equivalent experience",
            "min_experience": 2.0,
            "location": "Remote",
            "salary_range": "$85,000 - $115,000 / ₹16 - 22 LPA",
            "employment_type": "Remote",
            "status": "Active"
        },
        {
            "title": "Machine Learning Engineer",
            "department": "AI Research Lab",
            "description": "Develop and deploy cutting-edge NLP, computer vision, and predictive ML models using Python, PyTorch/TensorFlow, Scikit-learn, and cloud pipelines.",
            "required_skills": ["Python", "Machine Learning", "NLP", "PyTorch", "Scikit-learn"],
            "preferred_skills": ["Deep Learning", "Docker", "AWS", "FastAPI"],
            "education": "Master's Degree or Ph.D in Computer Science / AI",
            "min_experience": 2.5,
            "location": "Bangalore, India",
            "salary_range": "$110,000 - $150,000 / ₹24 - 35 LPA",
            "employment_type": "Full Time",
            "status": "Active"
        },
        {
            "title": "Cloud DevOps Engineer",
            "department": "Infrastructure & SRE",
            "description": "Lead cloud infrastructure automation, CI/CD pipeline optimization, container orchestration with Kubernetes and Docker on AWS.",
            "required_skills": ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
            "preferred_skills": ["Terraform", "Python", "Git", "System Design"],
            "education": "Bachelor's Degree in Engineering or CS",
            "min_experience": 3.0,
            "location": "Mumbai, India (Hybrid)",
            "salary_range": "$105,000 - $140,000 / ₹22 - 30 LPA",
            "employment_type": "Full Time",
            "status": "Active"
        }
    ]
    
    job_ids = []
    for job in sample_jobs:
        cursor.execute("""
        INSERT INTO jobs (recruiter_id, title, department, description, required_skills, preferred_skills, education, min_experience, location, salary_range, employment_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            recruiter_id,
            job["title"],
            job["department"],
            job["description"],
            json.dumps(job["required_skills"]),
            json.dumps(job["preferred_skills"]),
            job["education"],
            job["min_experience"],
            job["location"],
            job["salary_range"],
            job["employment_type"],
            job["status"]
        ))
        job_ids.append(cursor.lastrowid)
        
    # 3. Sample Candidates Data
    sample_candidates = [
        {
            "full_name": "Rahul Kumar",
            "email": "rahul.kumar@example.com",
            "phone": "+91 98765 43210",
            "headline": "Python Full Stack Developer",
            "education_level": "Bachelor's Degree (B.Tech CS)",
            "experience_years": 2.5,
            "current_company": "Apex Cloud Systems",
            "location": "Bangalore, India",
            "skills": ["Python", "Flask", "SQL", "React", "AWS", "Docker", "REST API", "JavaScript", "HTML", "CSS"],
            "projects": [
                {"title": "AI Recruitment Platform", "description": "Built candidate scoring engine using Flask, React, and Scikit-learn."},
                {"title": "Distributed SaaS Analytics", "description": "Developed microservices with Python, PostgreSQL, and Redis."}
            ],
            "certifications": ["AWS Certified Solutions Architect", "Scikit-Learn Certified"],
            "scores_override": {
                "skills_score": 95.0,
                "experience_score": 90.0,
                "education_score": 92.0,
                "projects_score": 88.0,
                "certifications_score": 95.0,
                "final_score": 92.4
            },
            "status": "Shortlisted",
            "app_status": "Shortlisted"
        },
        {
            "full_name": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "phone": "+91 98123 45678",
            "headline": "Full Stack Python & Java Engineer",
            "education_level": "M.Tech in Computer Science",
            "experience_years": 3.0,
            "current_company": "InnoTech Solutions",
            "location": "Hyderabad, India",
            "skills": ["Python", "Flask", "SQL", "React", "Java", "Spring Boot", "Git", "Docker", "Microservices"],
            "projects": [
                {"title": "Banking Core API", "description": "Built resilient transaction system in Java Spring Boot and SQL."},
                {"title": "Real-time Dashboard", "description": "Created interactive UI in React and WebSockets."}
            ],
            "certifications": ["Oracle Certified Professional Java SE", "AWS Certified Developer"],
            "scores_override": {
                "skills_score": 91.0,
                "experience_score": 87.0,
                "education_score": 94.0,
                "projects_score": 86.0,
                "certifications_score": 90.0,
                "final_score": 89.8
            },
            "status": "Review",
            "app_status": "Interview"
        },
        {
            "full_name": "Akash Reddy",
            "email": "akash.reddy@example.com",
            "phone": "+91 99887 76655",
            "headline": "Python & Data Science Developer",
            "education_level": "B.Tech in Information Technology",
            "experience_years": 2.0,
            "current_company": "DataPulse Analytics",
            "location": "Pune, India",
            "skills": ["Python", "SQL", "Flask", "Pandas", "Scikit-learn", "Machine Learning", "Data Analysis", "HTML", "CSS"],
            "projects": [
                {"title": "Predictive Sales Engine", "description": "Implemented linear regression and time series models."},
                {"title": "ETL Automated Pipeline", "description": "Built high-speed data parser for CSV and SQL pipelines."}
            ],
            "certifications": ["DeepLearning.AI Machine Learning Specialist"],
            "scores_override": {
                "skills_score": 86.0,
                "experience_score": 82.0,
                "education_score": 88.0,
                "projects_score": 84.0,
                "certifications_score": 80.0,
                "final_score": 84.5
            },
            "status": "Review",
            "app_status": "AI Screening"
        },
        {
            "full_name": "Neha Singh",
            "email": "neha.singh@example.com",
            "phone": "+91 97654 32109",
            "headline": "Frontend React & Python Developer",
            "education_level": "Bachelor of Computer Applications (BCA)",
            "experience_years": 1.5,
            "current_company": "WebSphere Interactive",
            "location": "Delhi NCR, India",
            "skills": ["React", "JavaScript", "Python", "HTML", "CSS", "Tailwind CSS", "Redux", "Git"],
            "projects": [
                {"title": "Responsive SaaS Dashboard", "description": "Crafted accessible dashboard with React 18 and Tailwind CSS."},
                {"title": "Portfolio & Blog Engine", "description": "Full-stack web application with Python REST backend."}
            ],
            "certifications": ["Meta Certified Frontend Developer"],
            "scores_override": {
                "skills_score": 78.0,
                "experience_score": 80.0,
                "education_score": 82.0,
                "projects_score": 79.0,
                "certifications_score": 75.0,
                "final_score": 79.2
            },
            "status": "Review",
            "app_status": "Under Review"
        },
        {
            "full_name": "Vikram Aditya",
            "email": "vikram.aditya@example.com",
            "phone": "+91 98450 12345",
            "headline": "Lead DevOps & Cloud Engineer",
            "education_level": "B.Tech Computer Science",
            "experience_years": 4.5,
            "current_company": "CloudScale Global",
            "location": "Bangalore, India",
            "skills": ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Python", "Git"],
            "projects": [
                {"title": "Multi-Region Kubernetes Cluster", "description": "Automated deployment of microservices with ArgoCD and Helm."},
                {"title": "Zero-Downtime Migration", "description": "Migrated monolithic database to AWS RDS with minimal latency."}
            ],
            "certifications": ["Certified Kubernetes Administrator (CKA)", "AWS Certified DevOps Engineer"],
            "scores_override": {
                "skills_score": 93.0,
                "experience_score": 96.0,
                "education_score": 90.0,
                "projects_score": 92.0,
                "certifications_score": 98.0,
                "final_score": 93.7
            },
            "status": "Shortlisted",
            "app_status": "Selected"
        },
        {
            "full_name": "Ananya Deshmukh",
            "email": "ananya.deshmukh@example.com",
            "phone": "+91 99112 33445",
            "headline": "AI & Natural Language Processing Engineer",
            "education_level": "M.S. in Artificial Intelligence",
            "experience_years": 3.2,
            "current_company": "Cognitive AI Labs",
            "location": "Mumbai, India",
            "skills": ["Python", "Machine Learning", "NLP", "PyTorch", "Scikit-learn", "Deep Learning", "FastAPI", "Docker"],
            "projects": [
                {"title": "LLM Fine-Tuning Pipeline", "description": "Trained domain-adapted transformer models for semantic search."},
                {"title": "Document Information Extraction", "description": "High accuracy entity recognition for medical and legal texts."}
            ],
            "certifications": ["TensorFlow Developer Certified", "DeepLearning.AI NLP Specialist"],
            "scores_override": {
                "skills_score": 96.0,
                "experience_score": 92.0,
                "education_score": 98.0,
                "projects_score": 94.0,
                "certifications_score": 95.0,
                "final_score": 95.1
            },
            "status": "Shortlisted",
            "app_status": "Interview"
        }
    ]
    
    python_job_id = job_ids[0]
    
    for cand in sample_candidates:
        # Create user
        cursor.execute("""
        INSERT INTO users (email, password, full_name, phone, role, avatar)
        VALUES (?, 'password123', ?, ?, 'candidate', ?)
        """, (
            cand["email"],
            cand["full_name"],
            cand["phone"],
            f"https://api.dicebear.com/7.x/avataaars/svg?seed={cand['full_name'].replace(' ', '')}"
        ))
        u_id = cursor.lastrowid
        
        # Create candidate profile
        cursor.execute("""
        INSERT INTO candidates (user_id, headline, experience_years, education_level, current_company, location, bio, profile_completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, 95)
        """, (
            u_id,
            cand["headline"],
            cand["experience_years"],
            cand["education_level"],
            cand["current_company"],
            cand["location"],
            f"Experienced software engineer specialized in {', '.join(cand['skills'][:4])}."
        ))
        c_id = cursor.lastrowid
        
        # Generate sample PDF resume file
        pdf_filename = f"{cand['full_name'].lower().replace(' ', '_')}_resume.pdf"
        pdf_path = os.path.join(sample_dir, pdf_filename)
        create_sample_pdf(
            pdf_path,
            cand["full_name"],
            cand["email"],
            cand["phone"],
            cand["headline"],
            cand["education_level"],
            cand["skills"],
            cand["experience_years"],
            cand["projects"],
            cand["certifications"]
        )
        
        # Create resume entry
        raw_resume_text = f"""
        {cand['full_name']}
        Email: {cand['email']} | Phone: {cand['phone']}
        Location: {cand['location']}
        
        Summary:
        {cand['headline']} with {cand['experience_years']} years of professional development experience.
        
        Education:
        {cand['education_level']}
        
        Skills:
        {', '.join(cand['skills'])}
        
        Projects:
        """ + "\n".join([f"- {p['title']}: {p['description']}" for p in cand['projects']]) + f"""
        
        Certifications:
        {', '.join(cand['certifications'])}
        """
        
        cursor.execute("""
        INSERT INTO resumes (candidate_id, filename, file_path, raw_text, parsed_name, parsed_email, parsed_phone, parsed_education, parsed_skills, parsed_experience, parsed_experience_years, parsed_projects, parsed_certifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c_id,
            pdf_filename,
            pdf_path,
            raw_resume_text,
            cand["full_name"],
            cand["email"],
            cand["phone"],
            json.dumps([cand["education_level"]]),
            json.dumps(cand["skills"]),
            f"{cand['experience_years']} years of industry experience",
            cand["experience_years"],
            json.dumps(cand["projects"]),
            json.dumps(cand["certifications"])
        ))
        res_id = cursor.lastrowid
        
        cursor.execute("UPDATE candidates SET resume_id = ? WHERE id = ?", (res_id, c_id))
        
        # Calculate or use exact required scores
        override = cand.get("scores_override", {})
        skills_sc = override.get("skills_score", 90.0)
        exp_sc = override.get("experience_score", 85.0)
        edu_sc = override.get("education_score", 90.0)
        proj_sc = override.get("projects_score", 85.0)
        cert_sc = override.get("certifications_score", 80.0)
        final_sc = override.get("final_score", 88.5)
        
        cursor.execute("""
        INSERT INTO candidate_scores (candidate_id, job_id, resume_id, skills_score, experience_score, education_score, projects_score, certifications_score, final_score, match_summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c_id,
            python_job_id,
            res_id,
            skills_sc,
            exp_sc,
            edu_sc,
            proj_sc,
            cert_sc,
            final_sc,
            json.dumps({
                "matched_skills": [s for s in cand["skills"] if s in ["Python", "Flask", "SQL", "React", "AWS"]],
                "missing_skills": [s for s in ["Python", "Flask", "SQL", "React", "AWS"] if s not in cand["skills"]],
                "experience_years": cand["experience_years"],
                "education": cand["education_level"]
            })
        ))
        
        # If shortlisted
        if cand["status"] == "Shortlisted":
            cursor.execute("""
            INSERT INTO shortlisted_candidates (recruiter_id, candidate_id, job_id, notes, status)
            VALUES (?, ?, ?, 'Top rank candidate with strong core skills match.', 'Shortlisted')
            """, (recruiter_id, c_id, python_job_id))
            
        # Create Application
        stage_history = [
            {"stage": "Applied", "date": "2026-08-10 10:30", "completed": True},
            {"stage": "Under Review", "date": "2026-08-11 14:15", "completed": True},
            {"stage": "AI Screening", "date": "2026-08-12 09:00", "completed": True},
            {"stage": "Shortlisted", "date": "2026-08-14 16:45", "completed": cand["app_status"] in ["Shortlisted", "Interview", "Selected"]},
            {"stage": "Interview", "date": "2026-08-18 11:00", "completed": cand["app_status"] in ["Interview", "Selected"]},
            {"stage": "Selected", "date": "2026-08-20 15:30", "completed": cand["app_status"] == "Selected"}
        ]
        
        cursor.execute("""
        INSERT INTO applications (candidate_id, job_id, resume_id, match_score, status, stage_history)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            c_id,
            python_job_id,
            res_id,
            final_sc,
            cand["app_status"],
            json.dumps(stage_history)
        ))
        
    conn.commit()
    conn.close()
    print("Rich sample dataset successfully seeded into recruitment.db!")

if __name__ == "__main__":
    seed()
