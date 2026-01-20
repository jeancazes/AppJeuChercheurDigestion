// Thème médical ludique - Couleurs et constantes
export const COLORS = {
  primary: '#0288D1',
  primaryLight: '#4FC3F7',
  primaryDark: '#01579B',
  secondary: '#B3E5FC',
  background: '#E1F5FE',
  white: '#FFFFFF',
  text: '#263238',
  textLight: '#546E7A',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF5350',
  cardBorder: '#B3E5FC',
  cardShadow: 'rgba(2, 136, 209, 0.1)',
};

// Configuration des niveaux
export const LEVEL_CONFIG = {
  1: { title: 'Stagiaire', budget: 100, access: 'Observations et livres', repRequired: 0 },
  2: { title: 'Interne', budget: 200, access: 'Dissections et expériences', repRequired: 5 },
  3: { title: 'Résident', budget: 500, access: 'Analyses et Doc Médical', repRequired: 10 },
  4: { title: 'Spécialiste', budget: 1000, access: 'Synthèses', repRequired: 15 },
};
