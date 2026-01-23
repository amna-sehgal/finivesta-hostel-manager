import React, { useEffect, useRef } from "react";
import "./wlaundry.css";
import gsap from "gsap";
import Navbar from "../wnavbar";

const Laundry = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Title animation
    gsap.from(titleRef.current, {
      y: -40,
      duration: 0.8,
      ease: "power3.out"
    });

    // Stats counter animation
    if (statsRef.current) {
      gsap.from(statsRef.current.querySelectorAll(".stat-number"), {
        textContent: 0,
        duration: 1,
        ease: "power2.out",
        snap: { textContent: 1 },
        stagger: 0.1
      });
    }

    // Cards animation with stagger
    gsap.to(".laundry-card, .insight-card, .stat-box", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out"
    });
  }, []);

  return (
    <>
    <Navbar/>
      <div className="laundry-container" ref={containerRef}>
        {/* HEADER SECTION */}
        <div className="laundry-header" ref={titleRef}>
          <h1 className="laundry-title">🧺 Laundry Operations Dashboard</h1>
          <p className="laundry-subtitle">
            Complete oversight of hostel laundry infrastructure, maintenance cycles, resource optimization, and compliance tracking.
          </p>
        </div>

        {/* STATS SECTION */}
        <div className="stats-container" ref={statsRef}>
          <div className="stat-box blue-stat">
            <h3>Total Machines</h3>
            <p className="stat-number">24</p>
            {/* BACKEND: GET /api/laundry/machines/count
              Returns total number of machines in the system */}
          </div>
          <div className="stat-box green-stat">
            <h3>Operational</h3>
            <p className="stat-number">21</p>
            {/* BACKEND: GET /api/laundry/machines?status=operational
              Filter and count machines with status='operational' */}
          </div>
          <div className="stat-box orange-stat">
            <h3>Maintenance</h3>
            <p className="stat-number">2</p>
            {/* BACKEND: GET /api/laundry/machines?status=maintenance
              Count machines currently under maintenance */}
          </div>
          <div className="stat-box red-stat">
            <h3>Out of Service</h3>
            <p className="stat-number">1</p>
            {/* BACKEND: GET /api/laundry/machines?status=out-of-service
              Count machines that are not operational */}
          </div>
        </div>

        {/* MAIN CARDS SECTION */}
        <div className="laundry-grid">
          {/* Machine Status Card */}
          <div className="laundry-card">
            <div className="card-header">
              <h2>🧺 Machine Status Overview</h2>
              <span className="card-badge">Real-time</span>
            </div>
            <ul>
              <li><strong>Total Installed:</strong> 24 units</li>
              <li><strong>Operational:</strong> 21 units (87.5%)</li>
              <li><strong>Under Maintenance:</strong> 2 units</li>
              <li><strong>Out of Service:</strong> 1 unit (requires repair)</li>
              <li><strong>Avg Cycle Time:</strong> 38 minutes</li>
            </ul>
            {/* BACKEND INTEGRATION:
              Endpoint: GET /api/laundry/machines/status
              Method: Fetch all machines with their current status
              
              Response Format:
              {
                machines: [
                  {
                    id: "WASH-001",
                    type: "washer",
                    status: "operational",
                    location: "Block A",
                    lastCycleTime: 38,
                    nextMaintenanceDate: "2026-02-15",
                    totalCyclesRun: 2341
                  },
                  ...
                ],
                summary: { operational: 21, maintenance: 2, outOfService: 1 }
              }
              
              Implementation:
              1. Fetch data in useEffect on component mount
              2. Set interval to refresh every 30 seconds for real-time updates
              3. Calculate percentages dynamically
              4. Show status with color coding (green=operational, orange=maintenance, red=out)
          */}
          </div>

          {/* Maintenance Alerts Card */}
          <div className="laundry-card">
            <div className="card-header">
              <h2>🛠️ Maintenance & Fault Alerts</h2>
              <span className="card-badge alert">3 Active</span>
            </div>
            <ul>
              <li><span className="alert-level high">HIGH:</span> Washer #7 – Motor vibration abnormal</li>
              <li><span className="alert-level medium">MEDIUM:</span> Dryer #3 – Heating coil efficiency reduced</li>
              <li><span className="alert-level low">LOW:</span> Filter Cleaning Due: 6 Machines</li>
              <li><strong>Next AMC Inspection:</strong> 28 Feb 2026</li>
            </ul>
            {/* BACKEND INTEGRATION:
              Endpoint: GET /api/laundry/maintenance/alerts
              Method: Fetch active maintenance alerts and issues
              
              Response Format:
              {
                activeAlerts: [
                  {
                    id: "ALERT-001",
                    machineId: "WASH-007",
                    severity: "high",
                    issue: "Motor vibration abnormal",
                    detectedAt: "2026-01-22T10:30:00",
                    estimatedRepair: "2026-01-24",
                    technician: "John Smith"
                  },
                  ...
                ],
                nextAMCDate: "2026-02-28"
              }
              
              Implementation:
              1. Fetch alerts on mount and every 60 seconds
              2. Sort by severity (high → medium → low)
              3. Color-code alerts: high=red, medium=orange, low=yellow
              4. Show technician assignment if available
              5. Trigger notification if new high-severity alert appears
          */}
          </div>

          {/* Peak Load Analytics Card */}
          <div className="laundry-card">
            <div className="card-header">
              <h2>📊 Peak Load Analytics</h2>
              <span className="card-badge">Today</span>
            </div>
            <ul>
              <li><strong>Peak Usage:</strong> 7 PM – 10 PM (highest demand)</li>
              <li><strong>Low Usage:</strong> 2 AM – 6 AM (best maintenance window)</li>
              <li><strong>Avg Daily Cycles:</strong> 186 cycles/day</li>
              <li><strong>Overload Alerts:</strong> 4 today</li>
              <li><strong>Queue Wait Time Avg:</strong> 12 minutes</li>
            </ul>
            {/* BACKEND INTEGRATION:
              Endpoint: GET /api/laundry/usage/analytics
              Query Params: ?date=2026-01-22&granularity=hourly
              
              Response Format:
              {
                hourlyData: [
                  { hour: 0, cycles: 2, load: 5, overloadAlerts: 0 },
                  { hour: 19, cycles: 34, load: 95, overloadAlerts: 2 },
                  ...
                ],
                peakHour: 19,
                lowHour: 2,
                totalCycles: 186,
                avgQueueWait: 12,
                overloadCount: 4
              }
              
              Implementation:
              1. Fetch hourly analytics data
              2. Create bar chart or heatmap visualization
              3. Highlight peak and low usage hours
              4. Show forecast for next 24 hours
              5. Display alerts when queue exceeds threshold
          */}
          </div>

          {/* Resource Optimization Card */}
          <div className="laundry-card">
            <div className="card-header">
              <h2>⚡ Resource Optimization</h2>
              <span className="card-badge">Efficiency</span>
            </div>
            <ul>
              <li><strong>Electricity Today:</strong> 312 kWh (vs avg 298 kWh)</li>
              <li><strong>Water Recycling:</strong> 42% (target: 50%)</li>
              <li><strong>Idle Machine Time:</strong> 27% (optimization opportunity)</li>
              <li><strong>Recommended Addition:</strong> 2 Washers + 1 Dryer</li>
              <li><strong>Cost Savings Potential:</strong> $450/month</li>
            </ul>
            {/* BACKEND INTEGRATION:
              Endpoint: GET /api/laundry/resources/metrics
              
              Response Format:
              {
                electricity: {
                  consumedToday: 312,
                  averageDaily: 298,
                  forecast: 315,
                  costPerUnit: 0.12
                },
                water: {
                  totalUsed: 2400,
                  recycled: 1008,
                  recyclingRate: 0.42,
                  target: 0.50
                },
                machines: {
                  idlePercentage: 27,
                  recommendedAddition: {
                    washers: 2,
                    dryers: 1,
                    estimatedCost: 12000
                  }
                },
                potentialSavings: {
                  monthly: 450,
                  yearly: 5400
                }
              }
              
              Implementation:
              1. Fetch resource metrics every 5 minutes
              2. Compare with historical averages
              3. Show trends and forecasts
              4. Highlight optimization opportunities
              5. Calculate ROI for recommended equipment purchases
          */}
          </div>

          {/* Compliance & Safety Card */}
          <div className="laundry-card">
            <div className="card-header">
              <h2>📋 Compliance & Safety</h2>
              <span className="card-badge green">All Clear</span>
            </div>
            <ul>
              <li><strong>Fire Safety:</strong> ✅ Valid (Expires: 15 Apr 2026)</li>
              <li><strong>Electrical Audit:</strong> ✅ Completed (Last: 10 Jan 2026)</li>
              <li><strong>Noise Compliance:</strong> ✅ Within Limits (72 dB - threshold: 75 dB)</li>
              <li><strong>Chemical Storage:</strong> ✅ Secured & Logged</li>
              <li><strong>Next Inspection:</strong> 28 Feb 2026 (37 days)</li>
            </ul>
            {/* BACKEND INTEGRATION:
              Endpoint: GET /api/laundry/compliance/status
              
              Response Format:
              {
                compliance: [
                  {
                    type: "fire_safety",
                    status: "valid",
                    lastChecked: "2025-04-15",
                    expiresAt: "2026-04-15",
                    remarks: "All equipment certified"
                  },
                  {
                    type: "electrical_audit",
                    status: "completed",
                    lastChecked: "2026-01-10",
                    nextDue: "2026-07-10",
                    findings: "No critical issues"
                  },
                  ...
                ],
                overallStatus: "compliant",
                nextInspection: "2026-02-28"
              }
              
              Implementation:
              1. Fetch compliance data on mount
              2. Display status with color-coded badges (green=valid, yellow=upcoming, red=overdue)
              3. Show countdown to next inspection
              4. Alert if any compliance is due or overdue
              5. Generate compliance report for management
          */}
          </div>

          {/* Supply Inventory Card */}
          <div className="laundry-card">
            <div className="card-header">
              <h2>📦 Supply Inventory</h2>
              <span className="card-badge warning">2 Low</span>
            </div>
            <ul>
              <li><strong>Detergent:</strong> 45 units (⚠️ Low - reorder soon)</li>
              <li><strong>Fabric Softener:</strong> 28 units (sufficient)</li>
              <li><strong>Machine Oil:</strong> 12 liters (⚠️ Low - critical)</li>
              <li><strong>Spare Belts:</strong> 8 units (adequate)</li>
              <li><strong>Filter Cartridges:</strong> 15 units (good)</li>
            </ul>
            {/* BACKEND INTEGRATION:
              Endpoint: GET /api/laundry/supplies/inventory
              
              Response Format:
              {
                supplies: [
                  {
                    id: "SUP-001",
                    name: "Detergent",
                    quantity: 45,
                    unit: "boxes",
                    minThreshold: 50,
                    reorderQuantity: 100,
                    cost: 12.50,
                    status: "low"
                  },
                  ...
                ],
                lowStockItems: 2,
                estimatedReorderDate: "2026-01-25"
              }
              
              Implementation:
              1. Fetch inventory on mount and daily
              2. Flag items below minimum threshold
              3. Generate auto-reorder alerts
              4. Track consumption trends
              5. Send notifications when reorder date approaches
          */}
          </div>

          {/* Student Complaints Card */}
          <div className="laundry-card">
            <div className="card-header">
              <h2>⚠️ Complaint Tracking</h2>
              <span className="card-badge alert">5 Open</span>
            </div>
            <ul>
              <li><strong>Total This Month:</strong> 12 complaints</li>
              <li><strong>Resolved:</strong> 7 (58%)</li>
              <li><strong>Pending:</strong> 5 (42%)</li>
              <li><strong>Avg Resolution Time:</strong> 4.2 hours</li>
              <li><strong>Top Issue:</strong> Machine not drying clothes properly</li>
            </ul>
            {/* BACKEND INTEGRATION:
              Endpoint: GET /api/laundry/complaints?status=all&month=current
              
              Response Format:
              {
                complaints: [
                  {
                    id: "COMP-001",
                    studentId: "STU-12345",
                    machineId: "DRYER-003",
                    issue: "Not drying clothes",
                    severity: "medium",
                    status: "open",
                    reportedAt: "2026-01-22T08:30:00",
                    assignedTo: "Technician A",
                    resolutionTime: null
                  },
                  ...
                ],
                metrics: {
                  total: 12,
                  resolved: 7,
                  pending: 5,
                  avgResolutionTime: 4.2,
                  topIssue: "Not drying",
                  topIssueCcount: 4
                }
              }
              
              Implementation:
              1. Fetch complaints with filters
              2. Show complaint status with color coding
              3. Track resolution SLA (target: 6 hours)
              4. Auto-escalate if SLA breach
              5. Link complaints to specific machines for pattern detection
          */}
          </div>
        </div>

        {/* AI INSIGHTS SECTION */}
        <h2 className="section-title">🤖 AI-Powered Insights & Predictions</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>⏰ Peak Supervision Hours Prediction</h4>
            <p>Peak demand forecasted: <strong>7–10 PM</strong>. Recommend additional staff during these hours to manage queue wait times and prevent machine overloading.</p>
            {/* AI INTEGRATION:
              Model: Time Series Forecasting (Prophet / LSTM)
              Technology: TensorFlow.js or Prophet library
              
              How It Works:
              1. Analyze historical laundry usage patterns
              2. Identify recurring peak hours
              3. Forecast future demand with 95% confidence interval
              4. Predict staffing requirements
              
              Implementation:
              POST /api/ai/laundry/predict-peak-hours { days: 7 }
              Response: {
                predictions: [
                  { date: "2026-01-23", peakHours: "19-22", confidence: 0.94 },
                  ...
                ],
                recommendedStaff: 2,
                forecastAccuracy: 0.92
              }
              
              Use Case: Schedule maintenance and staff during low-demand periods
          */}
          </div>

          <div className="insight-card">
            <h4>🔧 Predictive Maintenance Alert</h4>
            <p>Machine #7 motor health: 68%. Estimated failure in <strong>14 days</strong>. Preventive service recommended to avoid unexpected downtime.</p>
            {/* AI INTEGRATION:
              Model: Anomaly Detection & Time-to-Failure Prediction
              Technology: Isolation Forest, XGBoost, or Neural Networks
              
              How It Works:
              1. Collect machine sensor data (vibration, temperature, current draw)
              2. Detect anomalies in equipment behavior
              3. Calculate health score (0-100)
              4. Predict remaining useful life (RUL)
              5. Alert before failure occurs
              
              Implementation:
              POST /api/ai/laundry/predict-maintenance { machineId: "WASH-007" }
              Response: {
                machineId: "WASH-007",
                healthScore: 68,
                daysToFailure: 14,
                confidence: 0.87,
                recommendedAction: "Schedule preventive service",
                estimatedDowntime: 4,
                estimatedCost: 250
              }
              
              Sensor Requirements:
              - Vibration sensor (IMU)
              - Temperature sensors
              - Current/power draw monitor
              
              Use Case: Prevent unexpected breakdowns, reduce emergency repairs
          */}
          </div>

          <div className="insight-card">
            <h4>💧 Water & Detergent Optimization</h4>
            <p>Recycled water usage can be improved to <strong>55%</strong>. Estimated annual savings: <strong>$2,100</strong>. Upgrade filtration system recommended.</p>
            {/* AI INTEGRATION:
              Model: Consumption Pattern Analysis & Optimization
              Technology: Regression Analysis, Clustering
              
              How It Works:
              1. Track daily water consumption trends
              2. Analyze detergent usage per cycle
              3. Identify waste patterns
              4. Compare with industry benchmarks
              5. Recommend optimal settings
              
              Implementation:
              GET /api/ai/laundry/resource-optimization
              Response: {
                water: {
                  currentRecycling: 42,
                  potentialRecycling: 55,
                  implementationCost: 8000,
                  paybackPeriod: 3.8,
                  annualSavings: 2100
                },
                detergent: {
                  currentUsage: 2.5,
                  recommendedUsage: 2.2,
                  savingsPercentage: 12,
                  annualSavings: 450
                }
              }
              
              Use Case: Sustainability goals, cost reduction
          */}
          </div>

          <div className="insight-card">
            <h4>📈 Load Balancing Recommendation</h4>
            <p>Shift <strong>15% of evening load</strong> to afternoon hours (3-5 PM). Reduces peak congestion by 22% and improves overall utilization.</p>
            {/* AI INTEGRATION:
              Model: Optimization Algorithm (Linear Programming)
              Technology: PuLP, OR-Tools
              
              How It Works:
              1. Analyze current usage patterns
              2. Define constraints (student schedules, peak hours)
              3. Calculate optimal load distribution
              4. Generate incentive recommendations
              5. Forecast impact on wait times
              
              Implementation:
              POST /api/ai/laundry/load-balancing { constraint: "peak_reduction" }
              Response: {
                recommendation: "Shift 15% of evening load to 3-5 PM",
                expectedImpact: {
                  peakCongestionReduction: 22,
                  avgWaitTimeReduction: 5,
                  machineUtilizationImprovement: 18
                },
                implementation: "Offer 20% discount on afternoon slots",
                incentiveCost: 150
              }
              
              Use Case: Improve student experience, reduce infrastructure strain
          */}
          </div>

          <div className="insight-card">
            <h4>🎯 Issue Pattern Detection</h4>
            <p>Dryer machines show 3.5x higher complaint rate than average. Root cause: heating element degradation. Batch replacement recommended.</p>
            {/* AI INTEGRATION:
              Model: Clustering & Root Cause Analysis
              Technology: K-Means, Apriori Algorithm, LDA (Latent Dirichlet Allocation)
              
              How It Works:
              1. Group complaints by machine type, time, and issue
              2. Identify statistical anomalies
              3. Correlate with sensor data
              4. Perform root cause analysis
              5. Recommend preventive batch actions
              
              Implementation:
              GET /api/ai/laundry/anomaly-detection
              Response: {
                anomalies: [
                  {
                    machineType: "Dryer",
                    complaintRate: 0.35,
                    avgComplaintRate: 0.10,
                    anomalyRatio: 3.5,
                    likelyRootCause: "Heating element degradation",
                    affectedUnits: ["DRYER-001", "DRYER-003", "DRYER-005"],
                    recommendedAction: "Batch replacement of heating elements",
                    estimatedCost: 800,
                    preventedFailures: 3
                  }
                ]
              }
              
              Use Case: Proactive maintenance, quality improvement
          */}
          </div>

          <div className="insight-card">
            <h4>📅 Equipment Lifespan Analysis</h4>
            <p>3 machines approaching end-of-life (8+ years). Budget <strong>$18,000</strong> for replacement next quarter. AI recommends immediate procurement.</p>
            {/* AI INTEGRATION:
              Model: Lifespan Prediction & Asset Management
              Technology: Regression, Maintenance Data Analysis
              
              How It Works:
              1. Track machine age and usage hours
              2. Calculate wear and tear metrics
              3. Compare with manufacturer specs
              4. Predict end-of-life date
              5. Generate replacement schedule
              
              Implementation:
              GET /api/ai/laundry/asset-lifecycle
              Response: {
                endOfLifeWarning: [
                  {
                    machineId: "WASH-004",
                    age: 8.5,
                    usageHours: 45000,
                    healthScore: 35,
                    estimatedLifespanRemaining: 2,
                    replacementCost: 6000,
                    priority: "high"
                  },
                  ...
                ],
                totalBudget: 18000,
                recommendations: "Replace 3 washers in Q1 2026"
              }
              
              Use Case: Capital budgeting, asset replacement planning
          */}
          </div>

          <div className="insight-card">
            <h4>🔐 Compliance Risk Assessment</h4>
            <p>Electrical audit delayed by 5 days. Risk level: <strong>Medium</strong>. Schedule immediately to avoid regulatory penalties.</p>
            {/* AI INTEGRATION:
              Model: Risk Assessment & Compliance Monitoring
              Technology: Rule Engine, Temporal Logic
              
              How It Works:
              1. Track all compliance deadlines
              2. Calculate days until deadline
              3. Assess risk based on delays
              4. Flag upcoming expirations
              5. Generate compliance calendar
              
              Implementation:
              GET /api/ai/laundry/compliance-risk
              Response: {
                riskAssessment: [
                  {
                    complianceType: "electrical_audit",
                    dueDate: "2026-01-25",
                    daysUntilDue: 3,
                    riskLevel: "medium",
                    consequence: "Regulatory fine: $500",
                    recommendation: "Schedule audit immediately"
                  }
                ],
                overallRisk: "low",
                criticalActions: 1
              }
              
              Use Case: Compliance assurance, risk mitigation
          */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Laundry;
