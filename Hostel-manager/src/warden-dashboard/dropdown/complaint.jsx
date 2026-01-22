import React, { useEffect, useRef } from "react";
import "./complaint.css";
import gsap from "gsap";

const Complaint = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.to(".kpi-card, .complaint-card, .ai-card", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, []);

  return (
    <div className="complaint-dashboard" ref={containerRef}>
      <h1 className="page-title">Complaint Management – Warden Control Panel</h1>
      <p className="page-subtitle">
        Centralized monitoring of student grievances, SLA performance, and resolution efficiency.
      </p>

      {/* KPI CARDS - Dashboard Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <h3>Total Open</h3>
          <p>48</p>
          {/* BACKEND INTEGRATION:
              Endpoint: GET /api/complaints?status=open
              Method: Fetch all complaints with status='open'
              Response: { count: 48, complaints: [...] }
              How to Get: Call API on component mount using useEffect/useState
              Example: const [openCount, setOpenCount] = useState(0);
                      useEffect(() => { fetch('/api/complaints?status=open')
                        .then(res => res.json())
                        .then(data => setOpenCount(data.count)) }, [])
          */}
        </div>
        <div className="kpi-card orange">
          <h3>SLA At Risk</h3>
          <p>6</p>
          {/* BACKEND INTEGRATION:
              Endpoint: GET /api/complaints/sla-breach
              Method: Get complaints approaching or breaching SLA
              Query Params: ?threshold=80 (percentage of SLA time used)
              Response: { atRisk: 6, details: [...] }
              How to Get: Filter complaints where (now - createdAt) > (0.8 * slaTime)
              Implementation: Use date comparison: new Date() - new Date(complaint.createdAt)
          */}
        </div>
        <div className="kpi-card green">
          <h3>Resolved Today</h3>
          <p>21</p>
          {/* BACKEND INTEGRATION:
              Endpoint: GET /api/complaints/resolved/today
              Method: Count complaints resolved in last 24 hours
              Filters: status='closed' AND closedAt >= today 00:00:00
              Response: { resolvedToday: 21, trends: [...] }
              How to Get: Query database with date range filter
              Example: WHERE status = 'closed' AND DATE(closedAt) = CURDATE()
          */}
        </div>
        <div className="kpi-card purple">
          <h3>Avg Resolution</h3>
          <p>3.2 hrs</p>
          {/* BACKEND INTEGRATION:
              Endpoint: GET /api/complaints/analytics
              Method: Calculate average resolution time
              Formula: AVG(closedAt - createdAt) for all closed complaints
              Response: { avgResolutionTime: 3.2, unit: 'hours' }
              How to Get: Use database aggregation or calculate in-app
              Implementation: Use DATEDIFF() or moment.js for duration calculation
          */}
        </div>
      </div>

      {/* MAIN COMPLAINT MANAGEMENT PANELS */}
      <div className="complaint-grid">
        <div className="complaint-card">
          <h2>📋 Live Complaint Queue</h2>
          <ul>
            <li>Electrical Failure – Block A <span className="status open">Open</span></li>
            <li>Mess Hygiene Issue <span className="status progress">In Progress</span></li>
            <li>Laundry Machine Breakdown <span className="status escalated">Escalated</span></li>
            <li>Water Leakage – Floor 3 <span className="status closed">Closed</span></li>
          </ul>
          {/* BACKEND INTEGRATION:
              Endpoint: GET /api/complaints/live?limit=10&sort=priority
              Method: Fetch real-time complaint queue sorted by urgency
              Status Flow: open → in-progress → escalated → closed
              Response: { complaints: [{ id, title, status, priority, createdAt, ... }] }
              How to Get: Set interval to refresh every 30 seconds for real-time updates
              Example: setInterval(() => fetchComplaints(), 30000)
              Additional Fields: Add assignedTo, department, priority for better tracking
          */}
        </div>

        <div className="complaint-card">
          <h2>⏱ SLA Monitoring</h2>
          <div className="progress-group">
            <p>Within SLA <span>82%</span></p>
            <div className="bar"><div className="fill green" style={{width:"82%"}}></div></div>
            <p>Approaching Breach <span>12%</span></p>
            <div className="bar"><div className="fill orange" style={{width:"12%"}}></div></div>
            <p>Breached <span>6%</span></p>
            <div className="bar"><div className="fill red" style={{width:"6%"}}></div></div>
          </div>
          {/* BACKEND INTEGRATION:
              Endpoint: GET /api/complaints/sla-metrics
              Method: Calculate SLA compliance percentage
              Formula: 
                - Within SLA: (count of complaints where remainingTime > 0) / total * 100
                - Approaching: (count where 20% < remainingTime < 0) / total * 100
                - Breached: (count where remainingTime < 0) / total * 100
              Response: { withinSLA: 82, approaching: 12, breached: 6 }
              How to Get: Compare current timestamp with (createdAt + slaWindow)
              Implementation: Calculate remainingTime = slaEndTime - now
          */}
        </div>

        <div className="complaint-card">
          <h2>🔄 Closure & Reopen Control</h2>
          <p>Closed Today: <strong>21</strong></p>
          <p>Reopened: <strong>3</strong></p>
          <p>Pending Verification: <strong>5</strong></p>
          {/* BACKEND INTEGRATION:
              Endpoints:
              1. GET /api/complaints/closed/today - Count closed complaints from last 24h
              2. GET /api/complaints/reopened - Count reopened complaints
              3. GET /api/complaints/pending-verification - Count complaints waiting for verification
              
              Methods:
              - Close: PATCH /api/complaints/{id}/close { status: 'closed', closedAt: now }
              - Reopen: PATCH /api/complaints/{id}/reopen { status: 'open', reopenReason: string }
              - Verify: PATCH /api/complaints/{id}/verify { verificationStatus: 'pending'|'approved' }
              
              How to Get:
              - Fetch on component load and set auto-refresh every 60 seconds
              - Closed Today: Query where closedAt >= TODAY and status='closed'
              - Reopened: Count incidents where status changed from closed to open
              - Pending: Count where verificationStatus='pending'
          */}
        </div>

        <div className="complaint-card">
          <h2>📈 Department Performance</h2>
          <p>Mess Dept: ⭐ 4.2 / 5</p>
          <p>Maintenance: ⭐ 3.8 / 5</p>
          <p>Housekeeping: ⭐ 4.0 / 5</p>
          {/* BACKEND INTEGRATION:
              Endpoint: GET /api/complaints/department-metrics
              Method: Calculate department performance ratings
              Metrics:
              - avgResolutionTime: Average time to close (lower = better)
              - resolutionRate: (closed / total) * 100
              - customerSatisfaction: Average rating from student feedback
              - slaCompliance: (onTimeClosed / total) * 100
              
              Rating Formula: (1 - (avgTime / maxTime)) * 5 + (slaCompliance / 20)
              
              Response: { 
                departments: [
                  { name: 'Mess', rating: 4.2, metrics: {...} },
                  { name: 'Maintenance', rating: 3.8, metrics: {...} },
                  { name: 'Housekeeping', rating: 4.0, metrics: {...} }
                ]
              }
              
              How to Get: Aggregate complaint data grouped by departmentId
          */}
        </div>
      </div>

      {/* AI-POWERED INSIGHTS SECTION */}
      <div className="ai-section">
        <h2>🤖 AI-Powered Insights</h2>
        <div className="ai-grid">
          <div className="ai-card">
            <h4>🎯 Urgency Prediction</h4>
            <p>High Priority Complaints: 9</p>
            {/* AI INTEGRATION:
                Model: NLP-based Text Classification
                Technology: TensorFlow.js or OpenAI API
                How It Works:
                1. Extract complaint text and metadata
                2. Use pre-trained model to classify urgency (Low/Medium/High/Critical)
                3. Consider keywords: "broken", "emergency", "urgent", "injury", "safety"
                4. Weight by department severity and historical patterns
                
                Implementation:
                - Use OpenAI: POST /api/ai/classify-urgency { text, department }
                - Use TensorFlow.js: Load model locally, inference in browser
                - Store predictions in DB for pattern learning
                
                Response: { urgency: 'HIGH', confidence: 0.95, reasons: [...] }
                Endpoint: POST /api/ai/complaints/{id}/predict-urgency
            */}
          </div>
          <div className="ai-card">
            <h4>💭 Sentiment Analysis</h4>
            <p>Angry: 14 | Neutral: 22 | Calm: 12</p>
            {/* AI INTEGRATION:
                Model: Sentiment Classification (BERT, RoBERTa, or OpenAI)
                Technology: HuggingFace Transformers or Azure Text Analytics
                Sentiments: Angry (negative), Neutral (factual), Calm (positive/resigned)
                
                How It Works:
                1. Extract complaint text
                2. Pass through sentiment model
                3. Get probability scores for each sentiment
                4. Classify as dominant sentiment (highest score)
                
                Implementation Options:
                1. OpenAI: POST /api/ai/sentiment-analysis { text }
                   Response: { sentiment: 'ANGRY', score: 0.92, text_emotions: [...] }
                
                2. Azure Text Analytics: Uses Azure SDK
                   Response: { sentiment, scores: { positive, neutral, negative } }
                
                3. TensorFlow.js Local: Load pre-trained model
                
                Use Case: Route angry complaints to senior staff, provide empathy templates
                Endpoint: POST /api/ai/complaints/{id}/analyze-sentiment
            */}
          </div>
          <div className="ai-card">
            <h4>🔀 Auto Department Routing</h4>
            <p>Electrical, Plumbing, Mess, Laundry</p>
            {/* AI INTEGRATION:
                Model: Multi-label Classification / Zero-shot Classification
                Technology: OpenAI GPT, HuggingFace Zero-shot Classifier
                Departments: Electrical, Plumbing, Mess, Laundry, Housekeeping, etc.
                
                How It Works:
                1. Read complaint text and title
                2. Extract keywords and context
                3. Match against department keywords/patterns
                4. Use LLM to understand complex descriptions
                
                Implementation:
                1. Rule-based: If contains "electrical" → route to Electrical Dept
                
                2. AI-based (Recommended):
                   POST /api/ai/route-complaint {
                     text: string,
                     availableDepartments: string[]
                   }
                   Response: {
                     department: 'Electrical',
                     confidence: 0.98,
                     alternates: ['Maintenance', 'General']
                   }
                
                3. Zero-shot with HuggingFace:
                   const classifier = pipeline('zero-shot-classification');
                   const result = classifier(text, departments);
                
                Endpoint: POST /api/ai/complaints/{id}/route-to-department
                Benefits: 90%+ accuracy, self-learns from corrections
            */}
          </div>
          <div className="ai-card">
            <h4>🔁 Repeat Complaint Detection</h4>
            <p>Chronic Issue Zones: Block C Washroom</p>
            {/* AI INTEGRATION:
                Model: Clustering & Anomaly Detection / Similarity Matching
                Technology: Semantic similarity (embeddings) + Clustering algorithms
                
                How It Works:
                1. Convert all complaint texts to embeddings (vector representation)
                2. Group similar complaints using clustering (K-means, DBSCAN)
                3. Identify locations/issues appearing frequently
                4. Flag chronic problems for preventive action
                
                Implementation:
                1. Using OpenAI Embeddings:
                   POST /api/ai/detect-repeat-issues {
                     complaints: [{ id, text, location, category }]
                   }
                   Response: {
                     clusterGroups: [
                       { issue: 'Washroom Water Issue', locations: ['Block C'], count: 7 },
                       { issue: 'Mess Food Quality', locations: ['Main Kitchen'], count: 5 }
                     ],
                     chronicZones: ['Block C Washroom', 'Main Kitchen']
                   }
                
                2. Using SentenceTransformer + Sklearn:
                   from sentence_transformers import SentenceTransformer
                   embeddings = model.encode(complaints)
                   clusters = KMeans(n_clusters=5).fit(embeddings)
                
                Use Case: Predict issues before they occur, allocate maintenance resources
                Endpoint: POST /api/ai/complaints/detect-patterns
                Frequency: Run daily/weekly to identify trends
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
