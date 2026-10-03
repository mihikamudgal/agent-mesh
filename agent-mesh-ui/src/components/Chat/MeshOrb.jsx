import React from 'react';

export default function MeshOrb() {
  return (
    <div className="orb-wrapper" aria-hidden="true">
      <div className="orb-halo" />
      <div className="orb-core">
        <div className="orb-highlight" />
        <div className="orb-inner-wave" />
      </div>
      <div className="orb-ring ring-1" />
      <div className="orb-ring ring-2" />
    </div>
  );
}