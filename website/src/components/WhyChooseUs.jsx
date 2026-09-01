import React from 'react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "Secure by Design",
      desc: "Built with defense-in-depth architecture, data tokenization, and strict encryption protocols protecting every financial interaction."
    },
    {
      icon: "fa-solid fa-wand-magic-sparkles",
      title: "Simple & Transparent",
      desc: "No hidden layers or convoluted processes. Intuitive interfaces and straightforward workflows make financial operations effortless."
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "Smart Financial Insights",
      desc: "Transform transactional data into intelligent growth metrics with real-time reporting and predictive operational telemetry."
    },
    {
      icon: "fa-solid fa-rocket",
      title: "Built for Growing Businesses",
      desc: "Architected to scale smoothly from early-stage startup launches to high-volume enterprise operations without bottlenecks."
    }
  ];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-dark-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-pill-tag">Why Finova</span>
          <h2 className="section-title">Engineered for Reliability, Speed &amp; Trust</h2>
          <p className="section-subtitle">
            We bridge modern software engineering and financial operations so you can focus on building and scaling your business.
          </p>
        </div>

        <div className="why-grid">
          {features.map((item, idx) => (
            <div key={idx} className="why-card">
              <div className="why-icon">
                <i className={item.icon}></i>
              </div>
              <h3 className="why-title">{item.title}</h3>
              <p className="why-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
