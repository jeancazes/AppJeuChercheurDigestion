// Icônes SVG médicales pour le Laboratoire Fabuleux
import React from 'react';

export const MedicalIcons = {
  microscope: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="35" cy="25" r="15" stroke="currentColor" strokeWidth="6" fill="none"/>
      <line x1="35" y1="40" x2="35" y2="70" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <line x1="20" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <line x1="35" y1="70" x2="35" y2="85" stroke="currentColor" strokeWidth="6"/>
      <line x1="50" y1="55" x2="70" y2="55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  flask: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path d="M35 10 L35 40 L15 80 Q10 90 20 90 L80 90 Q90 90 85 80 L65 40 L65 10" stroke="currentColor" strokeWidth="5" fill="none"/>
      <line x1="30" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="50" cy="70" rx="20" ry="8" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path d="M15 20 L15 80 Q50 70 50 70 Q50 70 85 80 L85 20 Q50 30 50 30 Q50 30 15 20Z" stroke="currentColor" strokeWidth="5" fill="none"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="35" r="20" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M20 90 Q20 60 50 60 Q80 60 80 90" stroke="currentColor" strokeWidth="5" fill="none"/>
    </svg>
  ),
  help: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M35 40 Q35 25 50 25 Q65 25 65 40 Q65 50 50 55 L50 62" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="75" r="4" fill="currentColor"/>
    </svg>
  ),
  back: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path d="M60 20 L30 50 L60 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path d="M20 20 L30 20 L45 60 L80 60 L90 30 L35 30" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="45" cy="78" r="8" fill="currentColor"/>
      <circle cx="75" cy="78" r="8" fill="currentColor"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
      <path d="M20 50 L40 70 L80 30" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <rect x="20" y="45" width="60" height="45" rx="8" stroke="currentColor" strokeWidth="6" fill="none"/>
      <path d="M30 45 L30 30 Q30 10 50 10 Q70 10 70 30 L70 45" stroke="currentColor" strokeWidth="6" fill="none"/>
    </svg>
  ),
  school: (
    <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
      <path d="M10 40 L50 20 L90 40 L50 60 Z" stroke="currentColor" strokeWidth="5" fill="none"/>
      <path d="M25 50 L25 75 Q50 85 75 75 L75 50" stroke="currentColor" strokeWidth="5" fill="none"/>
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
      <path d="M70 10 L90 10 L90 30" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M90 10 L45 55" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <path d="M75 55 L75 85 L15 85 L15 25 L45 25" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  team: (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <circle cx="35" cy="30" r="12" stroke="currentColor" strokeWidth="4" fill="none"/>
      <circle cx="65" cy="30" r="12" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path d="M15 70 Q15 50 35 50 Q55 50 55 70" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path d="M45 70 Q45 50 65 50 Q85 50 85 70" stroke="currentColor" strokeWidth="4" fill="none"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path d="M35 20 L35 80 L15 80 Q10 80 10 75 L10 25 Q10 20 15 20 Z" stroke="currentColor" strokeWidth="6" fill="none"/>
      <path d="M40 50 L75 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <path d="M65 35 L80 50 L65 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
};
