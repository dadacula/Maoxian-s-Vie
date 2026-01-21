export type MoodType = 'happy' | 'excited' | 'playful' | 'tired' | 'curious' | 'mischievous';

export interface MoodTheme {
  type: 'beige' | 'noir';
  gradientColors: string[];
  textColor: string;
  cardBackground: string;
  accentColor: string;
  overlayOpacity: number;
}

export const getMoodTheme = (mood: MoodType): MoodTheme => {
  const themes: Record<MoodType, MoodTheme> = {
    happy: {
      type: 'beige',
      gradientColors: ['#FFF8F0', '#FFE4C4', '#F5DEB3'],
      textColor: '#8B4513',
      cardBackground: '#FFFFFF',
      accentColor: '#FFB347',
      overlayOpacity: 0.85,
    },
    excited: {
      type: 'beige',
      gradientColors: ['#FFEAA7', '#FDCB6E', '#FAB1A0'],
      textColor: '#D63031',
      cardBackground: '#FFFFFF',
      accentColor: '#FF6B6B',
      overlayOpacity: 0.85,
    },
    playful: {
      type: 'beige',
      gradientColors: ['#FFE8D6', '#FFD3B4', '#FFAAA5'],
      textColor: '#E17055',
      cardBackground: '#FFFFFF',
      accentColor: '#FF7675',
      overlayOpacity: 0.85,
    },
    tired: {
      type: 'noir',
      gradientColors: ['#2D3436', '#636E72', '#95A5A6'],
      textColor: '#DFE6E9',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      accentColor: '#74B9FF',
      overlayOpacity: 0.7,
    },
    curious: {
      type: 'beige',
      gradientColors: ['#DFE6E9', '#B2BEC3', '#A29BFE'],
      textColor: '#6C5CE7',
      cardBackground: '#FFFFFF',
      accentColor: '#A29BFE',
      overlayOpacity: 0.85,
    },
    mischievous: {
      type: 'noir',
      gradientColors: ['#1E272E', '#485460', '#808E9B'],
      textColor: '#F8EFBA',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      accentColor: '#FD79A8',
      overlayOpacity: 0.7,
    },
  };

  return themes[mood] || themes.happy;
};

// Pattern overlay styles for texture effect
export const getTextureStyle = (mood: MoodType) => {
  const theme = getMoodTheme(mood);

  if (theme.type === 'beige') {
    return {
      backgroundImage: 'noise', // React Native doesn't support CSS background-image
      // We'll use a combination of gradient + opacity to simulate texture
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.03,
      shadowRadius: 20,
    };
  } else {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 30,
    };
  }
};

// Get mood display name in Chinese
export const getMoodDisplayName = (mood: MoodType): string => {
  const names: Record<MoodType, string> = {
    happy: '开心',
    excited: '兴奋',
    playful: '调皮',
    tired: '疲惫',
    curious: '好奇',
    mischievous: '淘气',
  };
  return names[mood] || '开心';
};
