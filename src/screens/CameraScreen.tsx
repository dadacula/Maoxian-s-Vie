import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GeminiService } from '../services/gemini';
import { StorageService } from '../services/storage';
import { convertImageToBase64 } from '../utils/imageHelper';
import { JournalEntry } from '../types';
import { GEMINI_API_KEY } from '@env';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ navigation }: any) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedEntry, setGeneratedEntry] = useState<string | null>(null);
  const [mode, setMode] = useState<'video' | 'photo' | 'pro'>('photo');
  const isDemoMode = !GEMINI_API_KEY || GEMINI_API_KEY === '';

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('错误', '无法打开相机');
          return;
        }
        if (response.assets && response.assets[0].uri) {
          setSelectedImage(response.assets[0].uri);
          setGeneratedEntry(null);
        }
      }
    );
  };

  const handlePickPhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('错误', '无法选择照片');
          return;
        }
        if (response.assets && response.assets[0].uri) {
          setSelectedImage(response.assets[0].uri);
          setGeneratedEntry(null);
        }
      }
    );
  };

  const handleGenerateJournal = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const base64Image = await convertImageToBase64(selectedImage);
      const geminiService = new GeminiService();
      const result = await geminiService.analyzePhoto(base64Image);

      setGeneratedEntry(result.journal);

      // Save to storage
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        photoUri: selectedImage,
        content: result.journal,
        mood: result.mood as any,
        timestamp: Date.now(),
      };

      await StorageService.saveJournalEntry(entry);

      Alert.alert(
        '日记生成成功！',
        '小毛线的新日记已保存',
        [
          {
            text: '查看',
            onPress: () => navigation.navigate('JournalDetail', { entryId: entry.id }),
          },
          {
            text: '返回',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error generating journal:', error);
      Alert.alert(
        '生成失败',
        isDemoMode
          ? '演示模式出错。如需使用真实 AI 分析，请在 .env 文件中设置 Gemini API Key。'
          : '生成失败。请检查网络连接和 API Key 配置。'
      );
    } finally {
      setLoading(false);
    }
  };

  if (selectedImage) {
    return (
      <ScrollView style={styles.previewScrollContainer}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />

          {generatedEntry && (
            <View style={styles.journalPreview}>
              <Text style={styles.journalTitle}>✨ Xiǎo Máoxiàn's Tale</Text>
              <Text style={styles.journalText}>{generatedEntry}</Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setSelectedImage(null);
                setGeneratedEntry(null);
              }}
            >
              <Text style={styles.actionButtonText}>↻ Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.generateButton]}
              onPress={handleGenerateJournal}
              disabled={loading}
            >
              <LinearGradient
                colors={['#AA8928', '#D4AF37', '#F1D38E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.generateGradient}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.generateButtonText}>
                    {generatedEntry ? '✨ Refine Story' : '✨ Generate Tale'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Viewfinder frame corners */}
      <View style={styles.viewfinderFrame}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* Top controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.glassButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>

        <View style={styles.topRightControls}>
          <TouchableOpacity style={styles.glassButton}>
            <Text style={styles.controlIcon}>⚡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Center title */}
      <View style={styles.centerTitle}>
        <Text style={styles.captureTitle}>Capture Xiǎo Máoxiàn's Moment</Text>
      </View>

      {/* Camera settings */}
      <View style={styles.cameraSettings}>
        <Text style={styles.settingText}>ISO 100</Text>
        <Text style={styles.settingText}>F 1.8</Text>
        <Text style={styles.settingText}>1/250s</Text>
      </View>

      {/* Camera preview area */}
      <View style={styles.previewArea}>
        <Text style={styles.previewPlaceholder}>📸</Text>
        <Text style={styles.previewText}>Camera Preview</Text>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Mode switcher */}
        <View style={styles.modeSwitcher}>
          <TouchableOpacity onPress={() => setMode('video')}>
            <Text style={[styles.modeText, mode !== 'video' && styles.modeInactive]}>
              Video
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('photo')}>
            <Text style={[styles.modeText, styles.modeActive]}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('pro')}>
            <Text style={[styles.modeText, mode !== 'pro' && styles.modeInactive]}>
              Pro
            </Text>
          </TouchableOpacity>
        </View>

        {/* Camera buttons */}
        <View style={styles.cameraButtons}>
          <TouchableOpacity style={styles.galleryButton} onPress={handlePickPhoto}>
            <View style={styles.galleryThumbnail}>
              <Text style={styles.galleryIcon}>🖼️</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shutterButton} onPress={handleTakePhoto}>
            <LinearGradient
              colors={['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7', '#AA771C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shutterGradient}
            >
              <View style={styles.shutterInner} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.flipButton}>
            <Text style={styles.flipIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Zoom controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Text style={styles.zoomText}>0.5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.zoomButton, styles.zoomButtonActive]}>
            <Text style={[styles.zoomText, styles.zoomTextActive]}>1x</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <Text style={styles.zoomText}>3x</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewfinderFrame: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    zIndex: 20,
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: 'rgba(212, 175, 55, 0.6)',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  topControls: {
    position: 'absolute',
    top: 56,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 40,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 16,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '200',
  },
  controlIcon: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  centerTitle: {
    position: 'absolute',
    top: height * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 30,
  },
  captureTitle: {
    fontSize: 24,
    fontStyle: 'italic',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cameraSettings: {
    position: 'absolute',
    bottom: height * 0.4,
    left: 32,
    zIndex: 30,
  },
  settingText: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  previewArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  previewPlaceholder: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  previewText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 2,
  },
  bottomControls: {
    paddingBottom: 48,
    paddingTop: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 40,
  },
  modeSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 32,
  },
  modeText: {
    fontSize: 10,
    letterSpacing: 3,
    color: 'white',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  modeActive: {
    color: '#D4AF37',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.5)',
    paddingBottom: 4,
  },
  modeInactive: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  cameraButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 48,
    marginBottom: 32,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    fontSize: 24,
    opacity: 0.6,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 6,
  },
  shutterGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(191, 149, 63, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  shutterInner: {
    width: '90%',
    height: '90%',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonActive: {
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  zoomText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  zoomTextActive: {
    color: 'white',
  },
  previewScrollContainer: {
    flex: 1,
    backgroundColor: '#F9F5F0',
  },
  previewContainer: {
    padding: 20,
    paddingTop: 100,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  journalPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  journalTitle: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#1C1C1C',
    marginBottom: 16,
    fontWeight: '400',
  },
  journalText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#333',
    fontWeight: '300',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateButton: {
    flex: 2,
  },
  generateGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
