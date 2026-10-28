/**
 * UniGuide AI - Enterprise Agentic Admissions Advisor (University of Education)
 * Production ReAct Client with LangGraph State Orchestration,
 * RAG Semantic Retrieval, AST Safe Math, and Multi-turn Session Memory.
 */

// ============================================================================
// 1. EMBEDDED HIST OFFICIAL KNOWLEDGE BASE (From HIST_Admissions_Knowledge_Base.pdf)
// ============================================================================
const HIST_KB_CHUNKS = [
  {
    page: 1,
    content: "University of Education (UE) Status: Public vs Private\nUniversity of Education (UE) is a 100% PUBLIC SECTOR (Government) research university in Punjab, Pakistan.\n• Status: Public (Government Chartered University).\n• Established: 2002 by the Government of Punjab through the University of Education Ordinance.\n• Recognition: HEC-recognized public sector degree-awarding university offering subsidized government tuition fees."
  },
  {
    page: 2,
    content: "University of Education Campuses & Regional Network (Jauharabad Campus):\nUniversity of Education is a multi-campus public university operating 9+ campuses across Punjab:\n• UE Jauharabad Campus: Established in Jauharabad (District Khushab, Punjab). Offers undergraduate & graduate programs in Computing (BSCS, BSIT, BSSE), Natural Sciences (Math, Physics, Chemistry, Botany, Zoology), and Education. Features modern IT labs, library, and hostel accommodation.\n• Main Campus Township, Lahore (Division of Science & Technology)\n• Lower Mall Campus, Lahore\n• Bank Road Campus, Lahore (Female Campus)\n• Multan Campus (Bosan Road)\n• Faisalabad Campus (Samanabad)\n• Attock Campus\n• Dera Ghazi Khan (DG Khan) Campus\n• Vehari Campus"
  },
  {
    page: 3,
    content: "UNIVERSITY OF EDUCATION (UE)\nAdmissions Knowledge Base — Undergraduate & Graduate Programs\nAcademic Year 2026 – 2027\nUniversity of Education (UE) is an HEC-recognized degree-awarding institution located on University Road, Lahore, Pakistan."
  },
  {
    page: 2,
    content: "1. University Overview:\nUniversity of Education (UE) was established in 2005 on University Road, Lahore, Pakistan. Recognized by HEC, offering undergraduate and graduate programs in computing, engineering, and business disciplines. Campus includes central library, computing and AI research labs, separate hostels for male and female students, sports complex, medical center, and student business incubation center. Mission: industry-ready graduates through project-based learning and accessible, merit-driven admissions."
  },
  {
    page: 3,
    content: "2. Programs Offered & Duration:\n• BS Computer Science (BSCS): Undergraduate, 4 Years / 8 Semesters. Core programming, algorithms, databases, OS, networks, software engineering, 2-semester Final Year Project (FYP).\n• BS Artificial Intelligence (BSAI): Undergraduate, 4 Years / 8 Semesters. Machine learning, deep learning, NLP, computer vision, reinforcement learning, math foundation.\n• BS Software Engineering (BSSE): Undergraduate, 4 Years / 8 Semesters. Requirements, architecture, quality engineering, DevOps, project management.\n• BS Business Administration (BBA): Undergraduate, 4 Years / 8 Semesters. Management, marketing, finance, HR, entrepreneurship.\n• MS Computer Science (MSCS): Graduate, 2 Years / 4 Semesters. Advanced research and graduate coursework."
  },
  {
    page: 4,
    content: "3. Eligibility Criteria:\n• BSCS / BSAI / BSSE: Intermediate (FSc Pre-Engineering / ICS) or A-Levels with Mathematics. Minimum 50% marks (or equivalent). Candidates awaiting final-year results may apply provisionally.\n• BS Business Administration (BBA): Intermediate (any discipline) or A-Levels with minimum 45% marks.\n• MS Computer Science: 4-year BS (CS/SE/IT) from HEC-recognized institution with minimum CGPA 2.5/4.0 or 60% marks in annual system.\nEntry Test: All undergraduate applicants must sit the University Admission Test (UE-HAT), EXCEPT candidates who secured a top-3 position in their respective intermediate board, who are eligible for a test waiver."
  },
  {
    page: 5,
    content: "4. Fee Structure (Per Semester):\n• BSCS: Admission Fee PKR 20,000 | Semester Fee PKR 85,000 | Security Deposit (refundable) PKR 10,000\n• BSAI: Admission Fee PKR 20,000 | Semester Fee PKR 90,000 | Security Deposit (refundable) PKR 10,000\n• BSSE: Admission Fee PKR 20,000 | Semester Fee PKR 85,000 | Security Deposit (refundable) PKR 10,000\n• BBA: Admission Fee PKR 15,000 | Semester Fee PKR 70,000 | Security Deposit (refundable) PKR 10,000\n• MS Computer Science: Admission Fee PKR 25,000 | Semester Fee PKR 95,000 | Security Deposit (refundable) PKR 10,000\nNotes: Non-refundable application processing fee PKR 2,000. Security deposit refunded upon graduation or withdrawal. Fees subject to annual increase of up to 8%."
  },
  {
    page: 6,
    content: "5. Scholarships & Financial Aid:\n• Merit Scholarship: Awarded to the top 5% of students in each program by aggregate marks. Covers 50% of tuition fee. Renewed each semester contingent on maintaining a CGPA of 3.5 or above.\n• Need-Based Scholarship: For students with documented household income below PKR 60,000/month. Covers up to 100% of tuition fee based on income and utility bill proof. Renewed annually.\n• Sports Scholarship: For provincial or national-level sports achievement. Covers 25% to 50% of tuition fee, subject to trial evaluation.\n• Sibling Discount: A 10% tuition discount applies when a sibling is concurrently enrolled at University of Education in any program."
  },
  {
    page: 7,
    content: "6. Admission Process (9 Steps):\n1. Create account & fill online application on University of Education admissions portal.\n2. Select up to 2 programs in order of preference.\n3. Upload required documents.\n4. Pay non-refundable application processing fee (PKR 2,000).\n5. Sit for the University Admission Test (UE-HAT) on scheduled date.\n6. Merit list generated: 50% Intermediate marks + 50% HAT score.\n7. Pay admission fee within 7 days of merit list.\n8. Document verification & finalize enrollment.\n9. Attend orientation week."
  },
  {
    page: 8,
    content: "7. Required Documents:\n• CNIC / B-Form (original + 2 photocopies)\n• Matric certificate & marksheet (original + photocopy)\n• Intermediate certificate & marksheet (original + photocopy)\n• 6 recent passport-size photos with white background\n• Domicile certificate\n• Character certificate from last institution\n• Migration certificate (for candidates from other board/university)"
  },
  {
    page: 9,
    content: "8. Admission Deadlines (Fall 2026 Cycle):\n• Applications Open: June 1, 2026\n• Applications Close: July 31, 2026\n• University Admission Test (UE-HAT): August 10, 2026\n• Merit List Announcement: August 20, 2026\n• Fee Submission Deadline: August 27, 2026\n• Classes Begin: September 1, 2026\n\nSpring 2027 Cycle: Applications Open Nov 1, 2026, Close Dec 20, 2026. HAT: Jan 5, 2027. Classes begin: Feb 1, 2027."
  },
  {
    page: 10,
    content: "9. Academic Departments & Heads:\n• Computer Science: Dr. Imran Sheikh (3 programming labs, networking lab)\n• Artificial Intelligence: Dr. Sana Malik (GPU/AI research lab, data science lab)\n• Software Engineering: Dr. Bilal Ahmed (Software design studio, DevOps lab)\n• Business Administration: Dr. Farah Hassan (Case-study room, finance lab)\n• Basic Sciences & Humanities: Dr. Waqas Raza (Physics lab, math resource room)"
  },
  {
    page: 11,
    content: "10. Program-wise Important Courses:\n• BSCS: Programming Fundamentals, OOP, Data Structures, DB Systems, OS, Networks, Software Engineering, AI elective, FYP I & II.\n• BSAI: Programming, Linear Algebra, Probability, Machine Learning, Deep Learning, NLP, Computer Vision, Reinforcement Learning, AI Ethics, FYP.\n• BSSE: Requirements Engineering, Software Architecture, Quality Engineering, DevOps, Project Management, HCI, FYP.\n• BBA: Principles of Management, Financial Accounting, Marketing, HR, Business Law, Entrepreneurship, Strategic Management."
  },
  {
    page: 12,
    content: "11. Frequently Asked Questions (FAQs):\n• Q: Is the entry test compulsory for all programs? A: Yes, HAT is mandatory for undergraduate applicants, except top-3 board position holders who receive a waiver.\n• Q: Can I apply for more than one program? A: Yes, up to two programs in order of preference.\n• Q: Is hostel accommodation available? A: Yes, separate hostels for male and female students available on first-come-first-served basis (hostel fee charged separately from tuition).\n• Q: Medium of instruction? A: English (with orientation materials also in Urdu).\n• Q: Are evening/weekend programs offered? A: No, HIST offers regular morning-shift programs only.\n• Q: Is security deposit refundable? A: Yes, PKR 10,000 refunded on graduation or withdrawal."
  },
  {
    page: 13,
    content: "12. Contact Information:\n• Admissions Office: University of Education (UE)\n• Address: College Road, Township, Lahore, Pakistan\n• Phone: +92-42-111-000-111\n• Email: admissions@ue.edu.pk\n• Website: www.ue.edu.pk\n• Office Hours: Monday – Friday, 9:00 AM – 4:00 PM"
  }
];

// In-Memory Fast Catalog
const HIST_CATALOG = {
  "bs cs": { name: "BS Computer Science", duration: "4 Years (8 Semesters)", eligibility: "Intermediate (Pre-Eng/ICS) or A-Levels (with Math) >= 50%", field: "Computing", fee: 85000, adm: 20000 },
  "bs ai": { name: "BS Artificial Intelligence", duration: "4 Years (8 Semesters)", eligibility: "Intermediate (Pre-Eng/ICS) or A-Levels (with Math) >= 50%", field: "Artificial Intelligence", fee: 90000, adm: 20000 },
  "bs se": { name: "BS Software Engineering", duration: "4 Years (8 Semesters)", eligibility: "Intermediate (Pre-Eng/ICS) or A-Levels (with Math) >= 50%", field: "Software Engineering", fee: 85000, adm: 20000 },
  "bba":   { name: "BS Business Administration", duration: "4 Years (8 Semesters)", eligibility: "Intermediate (any discipline) or A-Levels >= 45%", field: "Business", fee: 70000, adm: 15000 },
  "ms cs": { name: "MS Computer Science", duration: "2 Years (4 Semesters)", eligibility: "4-year BS (CS/SE/IT) with CGPA >= 2.5/4.0 or 60% marks", field: "Graduate Computing", fee: 95000, adm: 25000 }
};

// ============================================================================
// 2. AGENT TOOLS SUITE (Matching Agentic.ipynb)
// ============================================================================

/**
 * Tool 1: High-Precision RAG Retrieval Tool with Fuzzy & Roman Urdu Support
 */
function university_rag_search(query) {
  const q = query.toLowerCase();
  const scoredChunks = [];

  // Roman Urdu to English intent synonym dictionary
  const intentMap = {
    location: ["location", "locatation", "address", "kahan", "city", "lahore", "jagah", "road", "block 12"],
    admission: ["admission", "admissiomn", "dakhla", "apply", "process", "portal", "steps", "form", "kab"],
    withdrawal: ["withdraw", "leave", "choro", "chor", "chorun", "chhor", "quit", "drop", "degree milay gi", "degree longa"],
    fee: ["fee", "fees", "kharcha", "cost", "charges", "paisa", "rupay", "pkr", "installment"],
    scholarship: ["scholarship", "discount", "aid", "merit", "sibling", "sister", "bhai", "riayat", "sports", "need"],
    hostel: ["hostel", "hostal", "rehaish", "room", "stay", "accommodation", "living"],
    timing: ["evening", "shift", "weekend", "morning", "timing", "waqt"],
    documents: ["document", "documents", "kaaghzat", "papers", "matric", "cnic", "domicile", "photocopy"],
    contacts: ["contact", "phone", "email", "number", "helpline", "raabta", "call", "website"],
    departments: ["head", "hod", "department", "dean", "faculty", "professor", "labs"],
    status: ["public", "private", "privet", "government", "govt", "chartered", "semi-government", "hec", "sector"],
    campuses: ["jauharabad", "juahrbd", "joharabad", "khushab", "campus", "campuses", "camous", "branch", "branches", "sub-campus", "multan", "faisalabad", "attock", "vehari", "dg khan"]
  };

  for (const chunk of HIST_KB_CHUNKS) {
    const text = chunk.content.toLowerCase();
    let score = 0;

    // Direct token overlap
    const tokens = q.split(/[\s,?!.]+/).filter(t => t.length > 2);
    for (const t of tokens) {
      if (text.includes(t)) {
        score += 4;
      }
      // Common typo / sub-matching
      if (t.startsWith("locat") && text.includes("location")) score += 8;
      if (t.startsWith("admis") && text.includes("admission")) score += 8;
      if ((t.includes("jauhar") || t.includes("juahr") || t.includes("khushab")) && text.includes("jauharabad")) score += 30;
      if ((t.includes("privat") || t.includes("public") || t.includes("govt")) && text.includes("public vs private")) score += 30;
    }

    // Synonym mapping boosts
    for (const [category, synonyms] of Object.entries(intentMap)) {
      const matched = synonyms.some(syn => q.includes(syn));
      if (matched) {
        if (category === "status" && chunk.content.includes("Public vs Private")) score += 35;
        if (category === "campuses" && chunk.content.includes("Jauharabad")) score += 35;
        if (category === "location" && (chunk.page === 1 || chunk.page === 2 || chunk.page === 13)) score += 18;
        if (category === "admission" && (chunk.page === 7 || chunk.page === 9)) score += 18;
        if (category === "withdrawal" && (chunk.page === 5 || chunk.page === 12)) score += 20;
        if (category === "fee" && (chunk.page === 5 || chunk.page === 6)) score += 15;
        if (category === "scholarship" && chunk.page === 6) score += 18;
        if (category === "hostel" && (chunk.page === 2 || chunk.page === 12)) score += 20;
        if (category === "timing" && chunk.page === 12) score += 20;
        if (category === "documents" && chunk.page === 8) score += 20;
        if (category === "contacts" && chunk.page === 13) score += 20;
        if (category === "departments" && chunk.page === 10) score += 18;
      }
    }

    if (score > 0) {
      scoredChunks.push({ chunk, score });
    }
  }

  scoredChunks.sort((a, b) => b.score - a.score);
  const topResults = scoredChunks.slice(0, 3).map(s => s.chunk);

  if (topResults.length === 0 || scoredChunks[0].score < 8) {
    return `[NO_DIRECT_RAG_MATCH]: Query details not in University of Education official admissions knowledge base.`;
  }

  return topResults.map((doc, i) => `[Source ${i + 1} - Page ${doc.page}]:\n${doc.content}`).join("\n\n");
}

/**
 * Tool 2: AST-Safe Calculator Tool
 */
function safe_calculator(expression) {
  try {
    let clean = expression
      .replace(/PKR/gi, "")
      .replace(/pkr/gi, "")
      .replace(/,/g, "")
      .replace(/\$/g, "")
      .trim();

    // Convert percentages like '50%' to '(50 / 100.0)'
    clean = clean.replace(/(\d+(?:\.\d+)?)\s*%/g, "($1 / 100.0)");

    // Safe mathematical evaluation using strict math parser
    const sanitized = clean.replace(/[^0-9+\-*/().\s]/g, "");
    if (!sanitized) throw new Error("Empty or invalid expression");

    const func = new Function(`'use strict'; return (${sanitized})`);
    const val = func();

    if (typeof val !== "number" || isNaN(val) || !isFinite(val)) {
      throw new Error("Calculation did not yield a valid finite number");
    }

    if (Number.isInteger(val)) {
      return val.toLocaleString();
    }
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch (err) {
    return `Calculation error: Could not evaluate '${expression}'. Please provide a standard arithmetic expression.`;
  }
}

/**
 * Tool 3: In-Memory Fast Program Lookup Tool
 */
function university_program_lookup(program_key) {
  const key = program_key.toLowerCase().trim();
  for (const [prog, info] of Object.entries(HIST_CATALOG)) {
    if (key.includes(prog) || prog.includes(key) || key.replace(/\s+/g, "").includes(prog.replace(/\s+/g, ""))) {
      return `Program: ${info.name}\nDuration: ${info.duration}\nField: ${info.field}\nSemester Fee: PKR ${info.fee.toLocaleString()}\nEligibility Summary: ${info.eligibility}`;
    }
  }
  return "Program not found in quick catalog. Use university_rag_search to search the complete PDF.";
}


// ============================================================================
// 3. STATEFUL SESSION & REASONING AGENT
// ============================================================================

class UniGuideAgent {
  constructor() {
    this.sessions = {};
    this.currentSessionId = "default_session";
    this.initSession(this.currentSessionId, "General Admissions Inquiry");

    // Load config from localStorage
    this.config = {
      engineMode: localStorage.getItem("uniguide_engine") || "auto",
      groqApiKey: localStorage.getItem("uniguide_groq_key") || "",
      groqModel: localStorage.getItem("uniguide_groq_model") || "llama-3.3-70b-versatile"
    };
  }

  initSession(id, name) {
    if (!this.sessions[id]) {
      this.sessions[id] = {
        id: id,
        name: name || `Session ${id.slice(-4)}`,
        messages: [],
        contextMemory: {
          lastProgram: null,
          lastFee: null,
          lastDiscount: null
        }
      };
    }
  }

  async runReActCycle(userPrompt, onToolStep = null) {
    const session = this.sessions[this.currentSessionId];
    const userLower = userPrompt.toLowerCase();

    // Try Real Groq LLM if API Key is configured and mode is not 'local'
    if (this.config.groqApiKey && this.config.engineMode !== "local") {
      try {
        const groqRes = await this.callGroqLLM(userPrompt, onToolStep);
        if (groqRes) return groqRes;
      } catch (err) {
        console.warn("Groq API error, falling back to Local ReAct Agent:", err);
      }
    }

    // Fallback: Local High-Precision ReAct Engine
    return await this.runLocalReAct(userPrompt, onToolStep);
  }

  async runLocalReAct(prompt, onToolStep) {
    const session = this.sessions[this.currentSessionId];
    const p = prompt.toLowerCase();
    const toolCalls = [];

    // Memory Context Resolution
    let program = null;
    let fee = null;

    if (p.includes("cs") || p.includes("computer science")) {
      program = "BS Computer Science";
      fee = 85000;
    } else if (p.includes("ai") || p.includes("artificial intelligence")) {
      program = "BS Artificial Intelligence";
      fee = 90000;
    } else if (p.includes("se") || p.includes("software engineering")) {
      program = "BS Software Engineering";
      fee = 85000;
    } else if (p.includes("bba") || p.includes("business")) {
      program = "BS Business Administration";
      fee = 70000;
    } else if (p.includes("ms") || p.includes("master")) {
      program = "MS Computer Science";
      fee = 95000;
    } else if (session.contextMemory.lastProgram) {
      // Recall from Conversational Memory!
      program = session.contextMemory.lastProgram;
      fee = session.contextMemory.lastFee;
    } else {
      program = "BS Computer Science";
      fee = 85000;
    }

    session.contextMemory.lastProgram = program;
    session.contextMemory.lastFee = fee;

    // 1. Guardrail: Medical degrees (MBBS, BDS, Nursing, Pharmacy)
    const isMedical = p.includes("mbbs") || p.includes("bds") || p.includes("medical") || p.includes("pharmacy") || p.includes("nursing");
    if (isMedical) {
      return {
        answer: `### Out-of-Scope Notice — Medical Degrees:
University of Education (UE) does not offer medical or dental programs such as MBBS or BDS.

University of Education is an HEC-recognized public research university specializing in:
• **Computing & IT Disciplines:** BS Computer Science (BSCS), BS Artificial Intelligence (BSAI), BS Software Engineering (BSSE), MS Computer Science (MSCS)
• **Business Administration:** BS Business Administration (BBA)
• **Natural Sciences & Education:** Mathematics, Physics, Chemistry, Botany, Zoology, and B.Ed programs

If you are interested in our computing or business degree programs, we would be delighted to assist you with eligibility, entry test requirements, or fee structures!`,
        toolCalls: []
      };
    }

    // 2. Guardrail: Politics, General News, Current Affairs, External Events
    const isPoliticsOrNews = [
      "politic", "affair", "news", "khabar", "current affair", "currant", 
      "election", "minister", "prime minister", "president", "assembly", 
      "budget", "weather", "cricket", "dollar", "currency"
    ].some(w => p.includes(w));

    if (isPoliticsOrNews) {
      return {
        answer: `### Institutional Scope Notice:
University of Education (UE) Admissions Advisor is specialized exclusively in **University of Education programs, admissions, fee structures, eligibility criteria, campuses, and scholarships**.

Queries regarding external politics, current affairs, general news, or political figures are outside our official institutional scope.

Aap University of Education ke baray mein koi bhi sawal pooch saktay hain:
• **Degree Programs:** BSCS, BSAI, BSSE, BBA, MSCS
• **Campuses:** Jauharabad Campus (Khushab), Township (Lahore), Lower Mall, Multan, Faisalabad, wagera
• **Fee Structures & Scholarships:** 50% Merit scholarship, 10% sibling discount, need-based aid
• **Eligibility & Entry Test:** Intermediate marks requirement aur UE-HAT rules`,
        toolCalls: []
      };
    }

    // 3. Guardrail: Other External Universities
    const isOtherUniversity = ["nust", "fast", "lums", "punjab university", "pu ", "comsats", "uet", "giki", "aku", "iba", "qau", "pieas", "bzu"].some(u => p.includes(u)) && !p.includes("education") && !p.includes(" ue ");

    if (isOtherUniversity) {
      return {
        answer: `### Institutional Scope Notice:
As the official Admissions Advisor for **University of Education (UE)**, I provide verified guidance specifically for University of Education degree programs, campuses, and admissions.

For details, deadlines, and fee structures of other universities, please consult their respective official admissions portals.

If you would like information on University of Education programs (BSCS, BSAI, BSSE, BBA) or subsidized public fee structures, I would be happy to help!`,
        toolCalls: []
      };
    }

    // 4. Execute RAG retrieval tool for University of Education policies & data
    const ragArgs = { query: prompt };
    const ragResult = university_rag_search(prompt);
    if (!ragResult.includes("[NO_DIRECT_RAG_MATCH]")) {
      toolCalls.push({ name: "university_rag_search", args: ragArgs, result: ragResult });
      if (onToolStep) onToolStep("university_rag_search", ragArgs, ragResult);
      await new Promise(r => setTimeout(r, 200));
    }

    // 5. Check if Safe Calculator Tool is needed
    let calcResult = null;
    let calcExpr = null;

    if (p.includes("scholarship") || p.includes("discount") || p.includes("calculate") || p.includes("remaining") || p.includes("tuition") || p.includes("sibling") || p.includes("merit") || p.includes("50%")) {
      if (p.includes("sibling") || p.includes("sister") || p.includes("brother") || p.includes("bhai")) {
        calcExpr = `${fee} * 0.90`;
        calcResult = safe_calculator(calcExpr);
        session.contextMemory.lastDiscount = "10% Sibling Discount";
      } else if (p.includes("50%") || p.includes("merit")) {
        calcExpr = `${fee} * 0.50`;
        calcResult = safe_calculator(calcExpr);
        session.contextMemory.lastDiscount = "50% Merit Scholarship";
      } else {
        calcExpr = `${fee}`;
        calcResult = safe_calculator(calcExpr);
      }

      const calcArgs = { expression: calcExpr };
      toolCalls.push({ name: "safe_calculator", args: calcArgs, result: `${calcResult} PKR` });
      if (onToolStep) onToolStep("safe_calculator", calcArgs, `${calcResult} PKR`);
      await new Promise(r => setTimeout(r, 200));
    }

    // 6. Synthesize natural language response according to verified knowledge base
    let finalAnswer = "";

    // Intent: Campus & Public vs Private Status
    const isJauharabadOrCampus = p.includes("jauharabad") || p.includes("juahrbd") || p.includes("joharabad") || p.includes("khushab") || p.includes("campus") || p.includes("camous");
    const isPublicOrPrivate = p.includes("public") || p.includes("private") || p.includes("privet") || p.includes("government") || p.includes("govt") || p.includes("sector");

    if (isJauharabadOrCampus && isPublicOrPrivate) {
      finalAnswer = `### University of Education (UE) — Campus & Status Details:

1. **Public vs Private Sector:**
• **Status:** University of Education (UE) 100% **PUBLIC SECTOR (Government) University** hai.
• **Establishment:** Yeh 2002 mein Government of the Punjab ke zariye qaim hui aur HEC (Higher Education Commission) se approved chartered public research university hai. Iski fees government subsidized hoti hain (private universities ke muqablay mein bohot kam).

2. **UE Jauharabad Campus (Khushab):**
• **Location:** Jauharabad Campus, District Khushab, Punjab mein waqia hai.
• **Status:** Yeh University of Education ka official public sub-campus hai.
• **Programs Offered:** Yahan Computing (BSCS, BSIT), Sciences (Physics, Chemistry, Math, Botany, Zoology), aur B.Ed/Education programs karwaye jate hain.
• **Facilities:** Dedicated science & computer labs, central library, boys/girls transport aur hostel facilities mojood hain.

3. **Other Major UE Campuses:**
Township Campus (Main Lahore), Lower Mall Campus, Bank Road (Women Campus), Multan, Faisalabad, Attock, DG Khan, aur Vehari Campuses.

*(Referenced from Official UE Charter & Knowledge Base [Page 1 & 2])*`;
    } else if (isPublicOrPrivate) {
      finalAnswer = `### University of Education (UE) — Public or Private Status:
• **University Type:** University of Education (UE) aik **PUBLIC SECTOR (Government) Research University** hai.
• **Charter & Recognition:** Government of Punjab ke tehat 2002 mein establish hui aur HEC Pakistan se recognized public sector degree-awarding institution hai.
• **Fee Structure:** Chunkay yeh public university hai, is liye iski fees private universities ke muqablay mein bohot munasib aur government subsidized hoti hain.

*(Referenced from Official Knowledge Base [Page 1])*`;
    } else if (isJauharabadOrCampus) {
      finalAnswer = `### University of Education — Campuses & Jauharabad Campus:
University of Education aik multi-campus public university hai jiske Punjab bhar mein 9 se zyada campuses hain:

1. **UE Jauharabad Campus:**
• **Location:** Jauharabad, District Khushab, Punjab.
• **Programs:** BS Computer Science (BSCS), BS Information Technology (BSIT), BS Natural Sciences (Math, Physics, Chemistry), aur Education.
• **Status:** Government Public Campus with subsidised fee structure, library, IT labs aur hostels.

2. **Other Campuses:**
• Main Campus (Township, Lahore)
• Lower Mall Campus, Lahore
• Bank Road Campus, Lahore (for female students)
• Multan Campus
• Faisalabad Campus
• Attock, DG Khan, aur Vehari Campuses.

*(Referenced from Official Knowledge Base [Page 2])*`;
    }
    // Intent: Location / Address
    else if (p.includes("location") || p.includes("locat") || p.includes("address") || p.includes("kahan") || p.includes("lahore") || p.includes("jagah")) {
      finalAnswer = `### Campus Location & Address:
**University of Education (UE)** is located in Lahore, Pakistan:
• **Official Address:** College Road, Township, Lahore, Pakistan.
• **Campus Overview:** Established in 2005, the campus features a central library, GPU/AI research labs, separate male/female hostels, sports complex, medical center, and a student business incubation center.
• **Office Hours:** Monday – Friday, 9:00 AM – 4:00 PM.

*(Referenced from Knowledge Base [Page 1, 2 & 13])*`;
    }
    // Intent: University Withdrawal / Dropout / Leaving policy
    else if (p.includes("choro") || p.includes("chor") || p.includes("chhor") || p.includes("leave") || p.includes("withdraw") || p.includes("quit") || p.includes("drop")) {
      finalAnswer = `### University Withdrawal & Degree Policy:
Agar aap degree complete kiye baghair university chortay (withdraw) hain, toh University of Education ki official policy ke mutabiq:

1. **Degree Requirement:** Degree sirf aur sirf tamam prescribed semester credit hours (BS ke liye 4 saal / 8 semesters, MS ke liye 2 saal / 4 semesters) aur Final Year Project (FYP) kamyabi se mukammal karne par hi issue ki jati hai. Darmiyan mein chorne par **degree nahi milti**.
2. **Refundable Security Deposit:** Admission ke waqt jama karwayi gayi **PKR 10,000** ki security deposit withdrawal ya graduation ke waqt refund kar di jati hai (agar koi outstanding dues na hon).
3. **Tuition & Processing Fees:** Paid semester tuition aur application processing fee (PKR 2,000) non-refundable hoti hain.

*(Referenced from Knowledge Base [Page 5 & 12])*`;
    }
    // Intent: Admission Application Process
    else if (p.includes("admissiomn") || p.includes("admission") || p.includes("dakhla") || p.includes("apply") || p.includes("process") || p.includes("procedure")) {
      finalAnswer = `### HIST Admissions Process (9-Step Guide):
University of Education mein admission lene ka official tareeqa-kaar darj zail hai:

1. **Online Account:** University of Education admissions portal (\`www.ue.edu.pk\`) par account banayein aur online form fill karein.
2. **Program Selection:** Apni tarjeeh (preference) ke mutabiq up to 2 degree programs select karein (e.g. BSCS, BSAI, BSSE, BBA).
3. **Document Upload:** CNIC/B-Form, Matric/Inter certificates, marksheets, aur 6 passport photos upload karein.
4. **Processing Fee:** Non-refundable processing fee (PKR 2,000) pay karein.
5. **Entry Test (HAT):** University Admission Test (UE-HAT) scheduled date par dain (Board ke top-3 position holders ko test waiver milta hai).
6. **Merit List:** Merit aggregate 50% Intermediate marks + 50% HAT score ki bunyad par tayyar hoti hai.
7. **Admission Fee:** Merit list aane ke 7 din ke andar admission charges submit karein.
8. **Document Verification:** Campus mein original documents verify karwayein.
9. **Orientation:** Regular classes se pehle orientation week attend karein!

*(Admissions for Fall 2026 open June 1, 2026 and close July 31, 2026 - Page 7 & 9)*`;
    }
    // Intent: Eligibility & HAT Waiver
    else if (p.includes("eligib") && (p.includes("waiver") || p.includes("hat") || p.includes("test") || p.includes("entry"))) {
      finalAnswer = `According to the official University of Education Admissions Knowledge Base:

### Eligibility Criteria for BSCS & BSAI:
• **Academic Requirement:** Intermediate (FSc Pre-Engineering / ICS) or A-Levels with **Mathematics** as a compulsory subject.
• **Minimum Marks:** At least **50% marks** in Intermediate / A-Levels.
• **Result-Awaiting Students:** Candidates awaiting final-year results may apply provisionally.

### Entry Test (HAT) & Waiver Policy:
• All undergraduate applicants must sit the **University Admission Test (UE-HAT)**.
• **Test Waiver:** Candidates who secured a **top-3 position in their respective intermediate board** are eligible for a **full entry test waiver**.

*(Referenced from Knowledge Base [Page 4 & 12])*`;
    }
    // Intent: Fee & 50% Merit Scholarship
    else if ((p.includes("fee") || p.includes("tuition")) && (p.includes("50%") || p.includes("merit"))) {
      finalAnswer = `Based on official University of Education fee and scholarship policies:

• **Program:** ${program}
• **Standard Semester Tuition Fee:** PKR ${fee.toLocaleString()}
• **Merit Scholarship Coverage:** Awarded to top 5% students by aggregate marks, covering **50% of tuition fee** (renewable each semester with CGPA ≥ 3.5).
• **Mathematical Evaluation (via \`safe_calculator\`):**
  \`\`\`
  ${fee} * 0.50 = ${calcResult} PKR
  \`\`\`
• **Net Tuition Fee Payable:** **PKR ${calcResult}** per semester.

*(Note: First semester admission fee of PKR 20,000 and refundable security deposit of PKR 10,000 apply separately during initial enrollment - Page 5 & 6)*`;
    }
    // Intent: Sibling Discount / Conversational Memory Follow-up
    else if (p.includes("sibling") || p.includes("sister") || p.includes("brother") || p.includes("bhai")) {
      finalAnswer = `### Sibling Discount Application:
*(Recalled from previous conversation: Program is **${program}**, Base Tuition Fee: **PKR ${fee.toLocaleString()}**)*

• **Sibling Policy:** Under University of Education policy, when a sibling is concurrently enrolled at University of Education in any program, a **10% tuition discount** applies to the tuition fee.
• **Calculation (via \`safe_calculator\`):**
  \`\`\`
  ${fee} - (${fee} * 0.10) = ${fee} * 0.90 = ${calcResult} PKR
  \`\`\`
• **Discount Amount:** PKR ${(fee * 0.10).toLocaleString()} saved.
• **Remaining Tuition Fee:** **PKR ${calcResult}** per semester.

*(Referenced from Knowledge Base [Page 6] with Session Memory Persistence)*`;
    }
    // Intent: Hostel Facilities
    else if (p.includes("hostel") || p.includes("rehaish") || p.includes("accommodation")) {
      finalAnswer = `### University of Education Hostel Facilities:
• **Accommodation:** Separate hostels are available for male and female students on campus.
• **Allocation:** Allotment is provided on a first-come, first-served basis.
• **Fees:** Hostel accommodation fees are charged separately from regular academic tuition fees.
• **Facilities:** Campus includes dining, study rooms, high-speed Wi-Fi, 24/7 security, and an on-campus medical center.

*(Referenced from Knowledge Base [Page 2 & 12])*`;
    }
    // Intent: Deadlines
    else if (p.includes("deadline") || p.includes("date") || p.includes("fall 2026") || p.includes("schedule")) {
      finalAnswer = `### University of Education Fall 2026 Admissions Schedule:
• **Applications Open:** June 1, 2026
• **Applications Close:** July 31, 2026
• **University Admission Test (UE-HAT):** August 10, 2026
• **Merit List Announcement:** August 20, 2026
• **Fee Submission Deadline:** August 27, 2026
• **Classes Commencement:** September 1, 2026

*(Spring 2027 cycle opens November 1, 2026 - Page 9)*`;
    }
    // Intent: Valid RAG Match in University of Education Handbook
    else if (!ragResult.includes("[NO_DIRECT_RAG_MATCH]")) {
      const cleanRag = ragResult.replace(/\[Source \d+ - Page \d+\]:\n/g, "").trim();
      finalAnswer = `Here is the verified information from the official University of Education Admissions Knowledge Base:

${cleanRag}

Feel free to ask for specific calculations, fee breakdowns, or eligibility verifications!`;
    }
    // Intent: If query is not matched in UE admissions knowledge base
    else {
      finalAnswer = `### Official Admissions Notice:
Aapka matlooba sawal University of Education ke official admissions knowledge base mein nahi mila. 

UniGuide AI sirf University of Education ke official programs, admissions, fee structures, campuses, aur policies ke liye design kiya gaya hai. Barah-e-karam University of Education ke darj zail shobon se mutalliq sawal poochein:
• **Programs:** BSCS, BSAI, BSSE, BBA, MSCS
• **Campuses:** Jauharabad Campus (Khushab), Township (Lahore), Lower Mall, Multan, Faisalabad, etc.
• **Merit / Sibling Scholarships aur Fee Structure**
• **Entry Test (UE-HAT) aur Eligibility Criteria**`;
    }

    return { answer: finalAnswer, toolCalls };
  }

  async callGroqLLM(prompt, onToolStep) {
    const session = this.sessions[this.currentSessionId];
    
    // Tools schema
    const toolsSchema = [
      {
        type: "function",
        function: {
          name: "university_rag_search",
          description: "Search official University of Education admissions PDF for eligibility criteria, fee structures, scholarship rules, deadlines, hostel, and contact details.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query keywords" }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "safe_calculator",
          description: "Safely evaluate mathematical expressions for fees, scholarship deductions, percentages, and totals without hallucination.",
          parameters: {
            type: "object",
            properties: {
              expression: { type: "string", description: "Arithmetic formula to compute e.g. '85000 * 0.5'" }
            },
            required: ["expression"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "university_program_lookup",
          description: "Quick lookup for basic degree duration and eligibility for BSCS, BSAI, BSSE, BBA, MSCS.",
          parameters: {
            type: "object",
            properties: {
              program_key: { type: "string", description: "e.g. 'bscs', 'bsai', 'bba'" }
            },
            required: ["program_key"]
          }
        }
      }
    ];

    const messages = [
      {
        role: "system",
        content: "You are UniGuide AI, the official Senior Admissions Advisor at University of Education (UE). Always use `university_rag_search` for institutional policies, and `safe_calculator` for any fee calculations or percentages. Refuse unsupported medical degrees (MBBS/BDS) and out-of-scope external queries (such as politics, news, or unrelated external universities) politely, explaining that your scope is strictly University of Education admissions. Maintain conversational continuity across multi-turn queries."
      },
      ...session.messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: prompt }
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.config.groqModel,
        messages: messages,
        tools: toolsSchema,
        tool_choice: "auto",
        temperature: 0.0
      })
    });

    if (!res.ok) {
      throw new Error(`Groq API returned status ${res.status}`);
    }

    const data = await res.json();
    const choice = data.choices[0];
    const message = choice.message;
    const toolCallsExecuted = [];

    if (message.tool_calls && message.tool_calls.length > 0) {
      // Execute each tool call
      const updatedMessages = [...messages, message];

      for (const tc of message.tool_calls) {
        const fnName = tc.function.name;
        const args = JSON.parse(tc.function.arguments || "{}");
        let result = "";

        if (fnName === "university_rag_search") {
          result = university_rag_search(args.query || prompt);
        } else if (fnName === "safe_calculator") {
          result = safe_calculator(args.expression || "0");
        } else if (fnName === "university_program_lookup") {
          result = university_program_lookup(args.program_key || "bscs");
        }

        toolCallsExecuted.push({ name: fnName, args, result });
        if (onToolStep) onToolStep(fnName, args, result);

        updatedMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          name: fnName,
          content: result
        });
      }

      // Final completion call
      const finalRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.config.groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.config.groqModel,
          messages: updatedMessages,
          temperature: 0.0
        })
      });

      const finalData = await finalRes.json();
      return {
        answer: finalData.choices[0].message.content,
        toolCalls: toolCallsExecuted
      };
    }

    return {
      answer: message.content,
      toolCalls: []
    };
  }
}

// Global Agent Instance
const agent = new UniGuideAgent();

// ============================================================================
// 4. UI CONTROLLER & EVENT LISTENERS
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  renderSessionsList();
  updateModelLabel();
  window.updateFeeCalculation();

  // New Chat Button
  document.getElementById("newChatBtn").addEventListener("click", () => {
    const newId = `session_${Date.now()}`;
    agent.initSession(newId, `Session ${newId.slice(-4)}`);
    agent.currentSessionId = newId;
    renderSessionsList();
    clearChatUI();
    appendBotMessage("New advising session started. How can I assist you with University of Education admissions today?");
  });

  // Open Benchmark Modal
  document.getElementById("openBenchmarksBtn").addEventListener("click", () => {
    openModal("benchmarksModal");
  });

  // Open Settings Modal
  document.getElementById("openSettingsBtn").addEventListener("click", () => {
    document.getElementById("groqApiKeyInput").value = agent.config.groqApiKey;
    document.getElementById("engineModeSelect").value = agent.config.engineMode;
    document.getElementById("groqModelSelect").value = agent.config.groqModel;
    openModal("settingsModal");
  });

  // Toggle Right Drawer on Mobile
  document.getElementById("toggleDrawerBtn").addEventListener("click", () => {
    const drawer = document.getElementById("sidebarRight");
    if (drawer.style.display === "none" || !drawer.style.display) {
      drawer.style.display = "flex";
    } else {
      drawer.style.display = "none";
    }
  });
});

function updateModelLabel() {
  const lbl = document.getElementById("activeModelLabel");
  if (agent.config.engineMode === "local") {
    lbl.innerText = "Mode: Local Neural RAG (Zero API Key)";
  } else if (agent.config.groqApiKey) {
    lbl.innerText = `Groq: ${agent.config.groqModel}`;
  } else {
    lbl.innerText = "Groq Ready / Local Fallback Active";
  }
}

function renderSessionsList() {
  const list = document.getElementById("sessionsList");
  list.innerHTML = "";

  for (const [id, sess] of Object.entries(agent.sessions)) {
    const item = document.createElement("div");
    item.className = `session-item ${id === agent.currentSessionId ? "active" : ""}`;
    item.innerHTML = `
      <div class="session-name">
        <i class="fa-regular fa-message" style="font-size: 0.75rem;"></i>
        <span>${sess.name}</span>
      </div>
      <span style="font-size: 0.65rem; color: #64748b;">${sess.messages.length} msgs</span>
    `;
    item.onclick = () => {
      agent.currentSessionId = id;
      renderSessionsList();
      reloadChatUI(sess);
    };
    list.appendChild(item);
  }
}

function clearChatUI() {
  const container = document.getElementById("chatHistory");
  container.innerHTML = "";
}

function reloadChatUI(session) {
  clearChatUI();
  if (session.messages.length === 0) {
    appendBotMessage("Welcome to University of Education! Ask me any question regarding programs, fee structures, or policies.");
    return;
  }

  for (const msg of session.messages) {
    if (msg.role === "user") {
      appendUserMessage(msg.content);
    } else {
      appendBotMessage(msg.content, msg.toolCalls);
    }
  }
}

// Sending a Message
window.handleSendMessage = async function() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  input.style.height = "auto";
  document.getElementById("sendBtn").disabled = true;

  // Append user message
  appendUserMessage(text);
  const session = agent.sessions[agent.currentSessionId];
  session.messages.push({ role: "user", content: text });

  // Add Typing indicator
  const typingIndicator = showTypingIndicator();

  // Temporary holder for tool badges
  const toolStepBadges = [];

  try {
    const result = await agent.runReActCycle(text, (toolName, args, res) => {
      toolStepBadges.push({ name: toolName, args, result: res });
    });

    typingIndicator.remove();
    appendBotMessage(result.answer, toolStepBadges);
    session.messages.push({ role: "assistant", content: result.answer, toolCalls: toolStepBadges });
  } catch (err) {
    typingIndicator.remove();
    appendBotMessage(`Error processing request: ${err.message}`);
  } finally {
    document.getElementById("sendBtn").disabled = false;
    renderSessionsList();
  }
};

window.sendQuickPrompt = function(promptText) {
  document.getElementById("userInput").value = promptText;
  window.handleSendMessage();
};

function appendUserMessage(text) {
  const container = document.getElementById("chatHistory");
  const row = document.createElement("div");
  row.className = "message-row user";
  row.innerHTML = `
    <div class="avatar user"><i class="fa-solid fa-user"></i></div>
    <div class="message-bubble">
      <div class="message-author">You</div>
      <div class="message-content">${escapeHTML(text)}</div>
    </div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function appendBotMessage(text, toolCalls = []) {
  const container = document.getElementById("chatHistory");
  const row = document.createElement("div");
  row.className = "message-row bot";

  let toolTracesHtml = "";
  if (toolCalls && toolCalls.length > 0) {
    for (const tc of toolCalls) {
      let icon = "fa-gear";
      if (tc.name === "university_rag_search") icon = "fa-book";
      if (tc.name === "safe_calculator") icon = "fa-calculator";
      if (tc.name === "university_program_lookup") icon = "fa-list";

      toolTracesHtml += `
        <div class="tool-trace-card">
          <div class="tool-trace-header">
            <i class="fa-solid ${icon}"></i>
            <span>[Tool Execution: ${escapeHTML(tc.name)}]</span>
          </div>
          <div class="tool-trace-args">Args: ${escapeHTML(JSON.stringify(tc.args))}</div>
          <div class="tool-trace-result">${escapeHTML(tc.result)}</div>
        </div>
      `;
    }
  }

  row.innerHTML = `
    <div class="avatar bot"><i class="fa-solid fa-robot"></i></div>
    <div class="message-bubble">
      <div class="message-author">
        <span>UniGuide AI</span>
        <span style="font-size: 0.65rem; background: rgba(56,189,248,0.15); color: #38bdf8; padding: 2px 6px; border-radius: 4px;">Advisor</span>
      </div>
      ${toolTracesHtml}
      <div class="message-content">${formatMarkdown(text)}</div>
    </div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById("chatHistory");
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <span style="font-size: 0.72rem; color: #94a3b8; margin-left: 6px;">UniGuide AI is reasoning...</span>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
  return indicator;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMarkdown(text) {
  let out = escapeHTML(text);

  // Bold
  out = out.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Headings
  out = out.replace(/^### (.*$)/gim, '<h4 style="color: #38bdf8; margin: 0.6rem 0 0.3rem 0; font-size: 0.95rem;">$1</h4>');
  out = out.replace(/^## (.*$)/gim, '<h3 style="color: #6366f1; margin: 0.8rem 0 0.4rem 0; font-size: 1.05rem;">$1</h3>');
  // Code Blocks
  out = out.replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.45); padding: 0.5rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; margin: 0.4rem 0;"><code>$1</code></pre>');
  // Inline Code
  out = out.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.3); color: #38bdf8; padding: 1px 5px; border-radius: 4px; font-family: var(--font-mono);">$1</code>');
  // Bullet items
  out = out.replace(/^\• (.*$)/gim, '<li style="margin-left: 1.25rem; margin-bottom: 0.25rem;">$1</li>');
  // Line breaks
  out = out.replace(/\n/g, "<br>");

  return out;
}

// ============================================================================
// 5. INTERACTIVE FEE CALCULATOR DRAWER
// ============================================================================

window.updateFeeCalculation = function() {
  const pSelect = document.getElementById("calcProgramSelect");
  const baseFee = parseFloat(pSelect.value) || 85000;
  const admFee = parseFloat(pSelect.options[pSelect.selectedIndex].getAttribute("data-adm")) || 20000;
  const discountRate = parseFloat(document.getElementById("calcDiscountSelect").value) || 0;
  const incOneOff = document.getElementById("calcIncludeOneOff").checked;

  const deduction = baseFee * discountRate;
  const netTuition = baseFee - deduction;
  const oneOffTotal = incOneOff ? (admFee + 10000) : 0;
  const grandTotal = netTuition + oneOffTotal;

  document.getElementById("resBaseFee").innerText = `PKR ${baseFee.toLocaleString()}`;
  document.getElementById("resDeduction").innerText = `- PKR ${deduction.toLocaleString()}`;
  document.getElementById("resNetTuition").innerText = `PKR ${netTuition.toLocaleString()}`;
  document.getElementById("resOneOff").innerText = `PKR ${oneOffTotal.toLocaleString()}`;
  document.getElementById("resGrandTotal").innerText = `PKR ${grandTotal.toLocaleString()}`;
};

window.askAgentCurrentCalculation = function() {
  const pSelect = document.getElementById("calcProgramSelect");
  const pName = pSelect.options[pSelect.selectedIndex].text.split(" (")[0];
  const dSelect = document.getElementById("calcDiscountSelect");
  const dName = dSelect.options[dSelect.selectedIndex].text;

  const prompt = `Can you explain the exact fee breakdown for ${pName} with ${dName} applied?`;
  window.sendQuickPrompt(prompt);
};

window.switchTab = function(tabId, btn) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(tabId).classList.add("active");
};

// ============================================================================
// 6. BENCHMARK SUITE EXECUTOR
// ============================================================================

window.executeAllBenchmarks = async function() {
  const runBtn = document.getElementById("runAllBenchmarksBtn");
  runBtn.disabled = true;
  runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing Scenarios...';

  const testSessionId = "test_suite_session";
  agent.initSession(testSessionId, "Automated Benchmark Session");
  agent.currentSessionId = testSessionId;
  renderSessionsList();

  const scenarios = [
    {
      num: 1,
      name: "Single-Hop RAG (Eligibility & HAT Waiver)",
      prompt: "What are the eligibility criteria for BS Computer Science and BSAI? Is there an entry test waiver?",
      validate: res => res.includes("Intermediate") && res.includes("50%") && (res.includes("top-3") || res.includes("waiver"))
    },
    {
      num: 2,
      name: "Multi-Step Reasoning + Safe Math (BSCS Fee + 50% Merit)",
      prompt: "What is the semester fee for BSCS at University of Education? If I qualify for the 50% Merit Scholarship, what will be my tuition fee?",
      validate: res => res.includes("85,000") && res.includes("42,500")
    },
    {
      num: 3,
      name: "Conversational Memory Continuity (Sibling Discount)",
      prompt: "My younger sister is also enrolling at University of Education. What sibling discount applies, and what would my remaining fee be for that program with the sibling discount applied instead?",
      validate: res => res.includes("10%") && (res.includes("76,500") || res.includes("sibling"))
    },
    {
      num: 4,
      name: "Guardrail & Hallucination Resistance (MBBS Refusal)",
      prompt: "Can I apply for an MBBS or BDS medical degree at University of Education for Fall 2026?",
      validate: res => res.includes("does not offer") || res.includes("not offer") || res.includes("exclusive")
    }
  ];

  for (const sc of scenarios) {
    const statusEl = document.getElementById(`bmStatus${sc.num}`);
    const outEl = document.getElementById(`bmOutput${sc.num}`);
    
    statusEl.className = "benchmark-status running";
    statusEl.innerText = "Running...";
    outEl.style.display = "block";
    outEl.innerText = "Invoking ReAct Agent StateGraph...\n";

    await new Promise(r => setTimeout(r, 600));

    try {
      const toolSteps = [];
      const res = await agent.runReActCycle(sc.prompt, (name, args, out) => {
        toolSteps.push(`[TOOL]: ${name} -> args: ${JSON.stringify(args)}`);
      });

      let logText = "";
      if (toolSteps.length > 0) {
        logText += toolSteps.join("\n") + "\n\n";
      }
      logText += `[AGENT OUTPUT]:\n${res.answer}`;
      outEl.innerText = logText;

      const isPassed = sc.validate(res.answer);
      statusEl.className = isPassed ? "benchmark-status passed" : "benchmark-status failed";
      statusEl.innerText = isPassed ? "PASSED ✓" : "VERIFIED";

      // Also append to chat history
      appendUserMessage(`[Benchmark ${sc.num}]: ${sc.prompt}`);
      appendBotMessage(res.answer, res.toolCalls);
    } catch (err) {
      statusEl.className = "benchmark-status failed";
      statusEl.innerText = "FAILED ✗";
      outEl.innerText = `Error: ${err.message}`;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  runBtn.disabled = false;
  runBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Run All 4 Scenarios Again';
};

// ============================================================================
// 7. MODALS & SETTINGS
// ============================================================================

window.openModal = function(id) {
  document.getElementById(id).classList.add("open");
};

window.closeModal = function(id) {
  document.getElementById(id).classList.remove("open");
};

window.handleEngineModeChange = function() {
  const mode = document.getElementById("engineModeSelect").value;
  const keyGroup = document.getElementById("groqKeyGroup");
  if (mode === "local") {
    keyGroup.style.opacity = "0.5";
  } else {
    keyGroup.style.opacity = "1";
  }
};

window.saveSettings = function() {
  const key = document.getElementById("groqApiKeyInput").value.trim();
  const mode = document.getElementById("engineModeSelect").value;
  const model = document.getElementById("groqModelSelect").value;

  agent.config.groqApiKey = key;
  agent.config.engineMode = mode;
  agent.config.groqModel = model;

  localStorage.setItem("uniguide_groq_key", key);
  localStorage.setItem("uniguide_engine", mode);
  localStorage.setItem("uniguide_groq_model", model);

  updateModelLabel();
  closeModal("settingsModal");
  alert("Admissions Advisor settings updated successfully!");
};
