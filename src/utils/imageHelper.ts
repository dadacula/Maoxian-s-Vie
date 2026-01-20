import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    // Handle different URI formats
    let imagePath = uri;

    if (Platform.OS === 'ios') {
      // Remove file:// prefix if present
      imagePath = uri.replace('file://', '');
    } else if (Platform.OS === 'android') {
      // Android might have content:// URIs, handle appropriately
      if (uri.startsWith('content://')) {
        // For content URIs, we'll need to copy to a temp location first
        // This is a simplified version - you may need more robust handling
        imagePath = uri;
      } else {
        imagePath = uri.replace('file://', '');
      }
    }

    const base64 = await RNFS.readFile(imagePath, 'base64');
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

export const getMoodEmoji = (mood: string): string => {
  const moodEmojis: { [key: string]: string } = {
    happy: '😊',
    excited: '🤩',
    playful: '🎾',
    tired: '😴',
    curious: '🤔',
    mischievous: '😈',
  };
  return moodEmojis[mood] || '🐕';
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays} 天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};
