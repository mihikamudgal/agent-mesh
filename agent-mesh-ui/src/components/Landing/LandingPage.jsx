import React from 'react';
import LandingNavbar from './LandingNavbar';
import LandingHero from './LandingHero';
import LandingValue from './LandingValue';
import LandingExplain from './LandingExplain';
import LandingAgents from './LandingAgents';
import LandingFooter from './LandingFooter';
import './Landing.css';

export default function LandingPage({
  onOpenLogin,
  onOpenSignup,
  onStartBuilding,
  agents,
  user
}) {
  return (
    <div className="landing-root">
      <LandingNavbar
        onOpenLogin={onOpenLogin}
        onOpenSignup={onOpenSignup}
        onEnterWorkspace={onStartBuilding}
        user={user}
      />

      <main className="landing-main-content">
        <LandingHero
          onStartBuilding={onStartBuilding}
          onOpenLogin={onOpenLogin}
        />

        <LandingValue />

        <LandingExplain />

        <LandingAgents
          agents={agents}
          onSelectAgentForTask={onStartBuilding}
        />
      </main>

      <LandingFooter
        onStartBuilding={onStartBuilding}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
}