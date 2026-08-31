import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "recruitment.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL CHECK(role IN ('candidate', 'recruiter', 'admin')),
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. Candidates
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        headline TEXT,
        experience_years REAL DEFAULT 0,
        education_level TEXT,
        current_company TEXT,
        location TEXT,
        bio TEXT,
        profile_completed INTEGER DEFAULT 0,
        resume_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)
    
    # 3. Recruiters
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recruiters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        company_name TEXT NOT NULL,
        department TEXT,
        company_logo TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)
    
    # 4. Jobs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recruiter_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        description TEXT NOT NULL,
        required_skills TEXT NOT NULL, -- JSON list
        preferred_skills TEXT,        -- JSON list
        education TEXT NOT NULL,
        min_experience REAL NOT NULL,
        location TEXT NOT NULL,
        salary_range TEXT NOT NULL,
        employment_type TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
    )
    """)
    
    # 5. Resumes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        raw_text TEXT,
        parsed_name TEXT,
        parsed_email TEXT,
        parsed_phone TEXT,
        parsed_education TEXT,        -- JSON list or string
        parsed_skills TEXT,           -- JSON list
        parsed_experience TEXT,       -- JSON / text
        parsed_experience_years REAL DEFAULT 0,
        parsed_projects TEXT,         -- JSON list
        parsed_certifications TEXT,   -- JSON list
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE SET NULL
    )
    """)
    
    # 6. CandidateScores
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidate_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        resume_id INTEGER,
        skills_score REAL NOT NULL,
        experience_score REAL NOT NULL,
        education_score REAL NOT NULL,
        projects_score REAL NOT NULL,
        certifications_score REAL NOT NULL,
        final_score REAL NOT NULL,
        match_summary TEXT, -- JSON breakdown
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL,
        UNIQUE(candidate_id, job_id)
    )
    """)
    
    # 7. Skills
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        aliases TEXT -- JSON list
    )
    """)
    
    # 8. ShortlistedCandidates
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS shortlisted_candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recruiter_id INTEGER NOT NULL,
        candidate_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'Shortlisted',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        UNIQUE(candidate_id, job_id)
    )
    """)
    
    # 9. Applications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        resume_id INTEGER,
        match_score REAL DEFAULT 0,
        status TEXT DEFAULT 'Applied', -- Applied, Under Review, AI Screening, Shortlisted, Interview, Selected, Rejected
        stage_history TEXT, -- JSON array of status history with timestamps
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL,
        UNIQUE(candidate_id, job_id)
    )
    """)
    
    conn.commit()
    conn.close()
    print("Database tables initialized successfully.")

if __name__ == "__main__":
    init_db()
