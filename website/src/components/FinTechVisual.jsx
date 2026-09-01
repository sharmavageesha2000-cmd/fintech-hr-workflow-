import React from 'react';

export default function FinTechVisual() {
  return (
    <div className="fintech-visual-wrapper">
      {/* 1. Titanium Digital Payment Card */}
      <div className="fintech-card-mockup">
        <div className="card-top-row">
          <div className="card-brand-label">
            <i className="fa-solid fa-cube" style={{ marginRight: '6px' }}></i> FINOVA PLATINUM
          </div>
          <div className="card-chip-box">
            <div className="card-chip"></div>
            <i className="fa-solid fa-wifi card-contactless" style={{ transform: 'rotate(90deg)' }}></i>
          </div>
        </div>

        <div className="card-number">
          •••• &nbsp; •••• &nbsp; •••• &nbsp; 8842
        </div>

        <div className="card-bottom-row">
          <div>
            <span className="card-holder-name">Cardholder</span>
            <span className="card-holder-val">FINOVA ENTERPRISE</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="card-holder-name">Expires</span>
            <span className="card-expiry-val">09 / 29</span>
          </div>
        </div>
      </div>

      {/* 2. Mini Real-Time Financial Telemetry Widget */}
      <div className="fintech-dashboard-widget">
        <div className="widget-header-row">
          <div>
            <span className="widget-balance-title">Operating Treasury Volume</span>
            <div className="widget-balance-val">$148,920.50</div>
          </div>
          <span className="widget-badge-growth">
            <i className="fa-solid fa-arrow-trend-up"></i> +18.4% YoY
          </span>
        </div>

        {/* Live Transaction Stream Simulation */}
        <div className="mini-tx-stream">
          <div className="mini-tx-item">
            <div className="mini-tx-left">
              <div className="mini-tx-icon in">
                <i className="fa-solid fa-arrow-down-left"></i>
              </div>
              <div>
                <strong style={{ color: 'var(--text-white)' }}>Enterprise API Payout</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light-subtle)', display: 'block' }}>Instant Settlement • 2m ago</span>
              </div>
            </div>
            <span style={{ color: 'var(--accent-emerald-light)', fontWeight: '700' }}>+$4,250.00</span>
          </div>

          <div className="mini-tx-item">
            <div className="mini-tx-left">
              <div className="mini-tx-icon in">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <div>
                <strong style={{ color: 'var(--text-white)' }}>SaaS Subscription Inbound</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light-subtle)', display: 'block' }}>Recurring Billing • 8m ago</span>
              </div>
            </div>
            <span style={{ color: 'var(--accent-emerald-light)', fontWeight: '700' }}>+$1,120.00</span>
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-light-subtle)' }}>
          <span><i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-emerald)', marginRight: '4px' }}></i> 256-Bit Encrypted Payload</span>
          <span style={{ color: 'var(--primary-blue-light)' }}>Zero-Trust Verified</span>
        </div>
      </div>
    </div>
  );
}
