import React from 'react';

export default function StatsSection() {
  const stats = [
    { number: "10K+", label: "Transactions Processed", icon: "fa-solid fa-bolt" },
    { number: "500+", label: "Businesses Served", icon: "fa-solid fa-users" },
    { number: "99.9%", label: "Platform Reliability", icon: "fa-solid fa-shield-halved" },
    { number: "24/7", label: "Digital Support", icon: "fa-solid fa-headset" }
  ];

  return (
    <section className="stats-section-wrapper">
      <div className="container">
        <div className="stats-grid">
          {stats.map((item, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-number">{item.number}</div>
              <div className="stat-label">
                <i className={item.icon} style={{ marginRight: '6px', color: 'var(--primary-blue-light)' }}></i>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
