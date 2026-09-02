export const MOOD_OPTIONS = [
  { value: 'necessity', label: 'Necessity', emoji: '✅', color: '#6366f1' },
  { value: 'celebration', label: 'Celebration', emoji: '🎉', color: '#f59e0b' },
  { value: 'stress', label: 'Stress', emoji: '😰', color: '#ef4444' },
  { value: 'boredom', label: 'Boredom', emoji: '😐', color: '#8b5cf6' },
  { value: 'other', label: 'Other', emoji: '💭', color: '#64748b' },
];

export const getMoodMeta = (mood) => MOOD_OPTIONS.find((m) => m.value === mood) || null;
