import React from 'react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <div className="container">
      <div className="cta-banner-wrapper">
        <div className="cta-banner-content">
          <span className="section-pill-tag emerald" style={{ marginBottom: '1rem' }}>
            <i className="fa-solid fa-sparkles"></i> Get Started Today
          </span>
          <h2 className="cta-banner-title">
            Ready to build a smarter financial future?
          </h2>
          <p className="cta-banner-desc">
            Discover how Finova Technologies can simplify your payment workflows, provide intelligent analytics, and accelerate your business operations.
          </p>
          <div className="cta-btn-row">
            <Link to="/solutions" className="btn-primary">
              Explore Solutions <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us <i className="fa-solid fa-envelope"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
