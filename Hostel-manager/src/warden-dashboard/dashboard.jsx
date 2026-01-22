import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './dashboard.css';

function dashboard(){
    const svgRef = useRef(null);
    const statsData = [
        { label: 'Total Students', value: 20, max: 100, color: '#3B82F6' },
        { label: 'Active Complaints', value: 5, max: 20, color: '#EF4444' },
        { label: 'Critical Alerts', value: 2, max: 10, color: '#F59E0B' },
        { label: 'Mess Rating', value: 3, max: 5, color: '#10B981' }
    ];

    const ringData = [
        { label: 'Total Students', value: 20, max: 100, color: '#3B82F6' },
        { label: 'Active Complaints', value: 5, max: 20, color: '#EF4444' },
        { label: 'Critical Alerts', value: 2, max: 10, color: '#F59E0B' },
        { label: 'Mess Rating', value: 3, max: 5, color: '#10B981' }
    ];

    useEffect(() => {
        if (!svgRef.current) return;

        // Animate rings
        const rings = svgRef.current.querySelectorAll('.ring-progress');
        rings.forEach((ring, index) => {
            const radius = 60 + (index * 40);
            const circumference = 2 * Math.PI * radius;
            ring.style.strokeDashoffset = circumference;
            
            setTimeout(() => {
                gsap.to(ring, {
                    strokeDashoffset: circumference * (1 - (ringData[index].value / ringData[index].max)),
                    duration: 2,
                    ease: 'power2.out'
                });
            }, index * 250);
        });

        // Animate headings
        gsap.from('.dashboard-heading', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.from('.dashboard-container', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out'
        });
    }, []);

    return(
        <div className="dashboard-wrapper">
        <div className="dashboard-heading">
            <h1>Warden's Dashboard</h1>
            <p>Hostel Management Overview</p>
        </div>
        
        <div className="dashboard-container">
            <div className="analysis-section">
                <h2>Analysis & Statistics</h2>
                <div className="stats-grid">
                    {statsData.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-value">{stat.value}/{stat.max}</div>
                            <div className="stat-bar">
                                <div 
                                    className="stat-bar-fill" 
                                    style={{
                                        width: `${(stat.value / stat.max) * 100}%`,
                                        backgroundColor: stat.color
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="performance-section">
                <div className="ring-section">
                    <h2>Performance Rings</h2>
                    <svg viewBox="0 0 300 300" ref={svgRef} className="ring-chart">
                        {ringData.map((ring, index) => {
                            const radius = 60 + (index * 40);
                            const circumference = 2 * Math.PI * radius;
                            return (
                                <g key={index}>
                                    {/* Background ring */}
                                    <circle
                                        cx="150"
                                        cy="150"
                                        r={radius}
                                        fill="none"
                                        stroke="#E5E7EB"
                                        strokeWidth="10"
                                        opacity="0.3"
                                    />
                                    {/* Progress ring */}
                                    <circle
                                        cx="150"
                                        cy="150"
                                        r={radius}
                                        fill="none"
                                        stroke={ring.color}
                                        strokeWidth="10"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={circumference}
                                        strokeLinecap="round"
                                        className="ring-progress"
                                        style={{ 
                                            transform: 'rotate(-90deg)',
                                            transformOrigin: '150px 150px'
                                        }}
                                    />
                                    {/* Label */}
                                    <text
                                        x="150"
                                        y={150 - radius + 15}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill={ring.color}
                                        fontWeight="700"
                                        opacity="0.8"
                                    >
                                        {ring.label.split(' ')[0]}
                                    </text>
                                    <text
                                        x="150"
                                        y={150 - radius + 28}
                                        textAnchor="middle"
                                        fontSize="16"
                                        fill={ring.color}
                                        fontWeight="700"
                                    >
                                        {ring.value}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="info-column">
                    <div className="info-card">
                        <span className="info-icon">⚡</span>
                        <span className="info-label">Power Usage</span>
                        <span className="info-value">200 units/room</span>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">😊</span>
                        <span className="info-label">Hostel Mood</span>
                        <span className="info-value mood-happy">Happy</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
export default dashboard;