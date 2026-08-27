const AVATAR_PALETTE = [
  'bg-indigo-600',
  'bg-purple-600',
  'bg-emerald-600',
  'bg-rose-600',
  'bg-amber-500',
  'bg-cyan-600',
  'bg-fuchsia-600',
  'bg-blue-600',
  'bg-orange-600',
  'bg-teal-600',
] as const;

export const getAvatarColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
};
