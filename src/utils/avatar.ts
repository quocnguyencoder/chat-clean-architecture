// DiceBear avatar configuration
export const DICEBEAR_CONFIG = {
  BASE_URL: 'https://api.dicebear.com/7.x',
  STYLES: {
    AVATAAARS: 'avataaars',
    INITIALS: 'initials',
  },
  DEFAULT_SEEDS: {
    USER: 'default-user',
    GROUP: 'default-group',
  },
} as const;

/**
 * Generates a DiceBear avatar URL
 * @param seed - The seed for generating the avatar (usually a name or identifier)
 * @param style - The avatar style ('avataaars' for individuals, 'initials' for groups)
 * @param backgroundColor - Background color for the avatar (default: 'f0f0f0')
 * @returns The complete DiceBear avatar URL
 */
export const generateAvatarUrl = (
  seed: string,
  style: keyof typeof DICEBEAR_CONFIG.STYLES = 'AVATAAARS',
  backgroundColor = 'f0f0f0'
): string => {
  const normalizedSeed = seed.toLowerCase().replace(/\s+/g, '-');
  const avatarStyle = DICEBEAR_CONFIG.STYLES[style];
  return `${DICEBEAR_CONFIG.BASE_URL}/${avatarStyle}/svg?seed=${normalizedSeed}&backgroundColor=${backgroundColor}`;
};

/**
 * Generates an avatar URL based on user name
 * @param name - The user's name
 * @returns DiceBear avatar URL for individual users
 */
export const generateUserAvatar = (name: string): string => {
  return generateAvatarUrl(name, 'AVATAAARS', '1976d2');
};

/**
 * Generates an avatar URL for groups/teams
 * @param groupName - The group's name
 * @returns DiceBear avatar URL for groups using initials style
 */
export const generateGroupAvatar = (groupName: string): string => {
  const normalizedSeed = groupName.toLowerCase().replace(/\s+/g, '-');
  const avatarStyle = DICEBEAR_CONFIG.STYLES.INITIALS;
  return `${DICEBEAR_CONFIG.BASE_URL}/${avatarStyle}/svg?seed=${normalizedSeed}`;
};

/**
 * Gets a fallback avatar URL
 * @param isGroup - Whether this is for a group or individual user
 * @returns Default DiceBear avatar URL
 */
export const getDefaultAvatar = (isGroup = false): string => {
  const seed = isGroup
    ? DICEBEAR_CONFIG.DEFAULT_SEEDS.GROUP
    : DICEBEAR_CONFIG.DEFAULT_SEEDS.USER;

  if (isGroup) {
    // Group avatars without background color
    const avatarStyle = DICEBEAR_CONFIG.STYLES.INITIALS;
    return `${DICEBEAR_CONFIG.BASE_URL}/${avatarStyle}/svg?seed=${seed}`;
  } else {
    // User avatars with background color
    return generateAvatarUrl(seed, 'AVATAAARS', '1976d2');
  }
};
