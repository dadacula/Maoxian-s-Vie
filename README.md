# 小毛线日记 (Xiǎo Máoxiàn's Journal)

A delightful iOS app that generates daily journal entries from your dog's perspective! Take a photo of your furry friend, and let AI create a playful, energetic journal entry as if your dog wrote it themselves.

## 🐕 About

**小毛线** (Little Yarn) is a playful and energetic dog who loves to share her daily adventures. This app uses Google Gemini's vision AI to analyze photos and generate authentic journal entries capturing the joy and enthusiasm of dog life!

## ✨ Features

- 📸 **Photo Capture**: Take photos or select from your library
- 🤖 **AI-Powered Journal**: Uses Google Gemini to analyze photos and generate personalized entries
- 💾 **Journal History**: Save and browse all journal entries
- 🎨 **Beautiful UI**: Warm, playful design with Chinese and English support
- 😊 **Mood Detection**: Automatically detects and displays your dog's mood
- 🎨 **Dynamic Backgrounds**: Textured gradient backgrounds that change based on mood
  - **Beige gradients** for happy, excited, playful, and curious moods
  - **Noir (dark) gradients** for tired and mischievous moods
  - Automatically switches as you browse different journal entries

## 🚀 Getting Started

### 🎭 Demo Mode (No API Key Required!)

Want to try the app without setting up an API key? The app includes a **demo mode** that:
- ✅ Works immediately without any API configuration
- ✅ Shows how the UI looks and feels
- ✅ Generates random sample journal entries
- ⚠️ **Does NOT analyze your actual photos** (just shows what AI-generated entries look like)
- 📚 Includes pre-written sample entries you can load

**To use demo mode**: Simply skip the API key setup step below and run the app!

### Prerequisites

- macOS with Xcode 14+ installed
- Node.js 18+ and npm/yarn
- CocoaPods installed (`sudo gem install cocoapods`)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey)) - **Optional for demo mode**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Maoxian-s-Vie
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Configure API Key (Optional - skip for demo mode)**

   For **real AI photo analysis**, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   For **demo mode**, skip this step entirely!

5. **Run the app**
   ```bash
   npm run ios
   # or
   yarn ios
   ```

## 📱 How to Use

### Demo Mode Testing
1. **Launch the app** - You'll see 小毛线's journal home screen
2. **Load sample entries** - Tap "📚 加载示例日记" to see pre-made demo journals
3. **Try generating** - Tap the + button and select any photo
4. **Demo indicator** - Look for the "🎭 演示模式" banner (shows you're in demo mode)
5. **Random entries** - Each photo generates a random playful journal (not based on actual photo content)

### Real AI Mode (with API Key)
1. **Launch the app** - You'll see 小毛线's journal home screen
2. **Tap the + button** - Choose to take a photo or select from library
3. **Select a photo** - Pick a photo of your dog
4. **Generate journal** - Tap "生成日记" and watch **real AI analyze your photo**
   - AI looks at your dog's expression, activities, and mood
   - Generates personalized journal based on what it sees
   - Takes 2-5 seconds to analyze
5. **Read & Save** - Enjoy the authentic journal entry from your dog's perspective!
6. **Browse history** - Swipe through all saved journal entries

## 🎨 Customization

### Change Dog's Name and Personality

Edit `src/services/gemini.ts` to customize the prompt:

```typescript
const prompt = `You are 小毛线 (Xiǎo Máoxiàn), a playful and energetic dog...`
```

Change the name, personality traits, and writing style to match your dog!

### Adjust UI Colors

Edit the StyleSheet colors in:
- `src/screens/HomeScreen.tsx`
- `src/screens/CameraScreen.tsx`
- `src/screens/JournalDetailScreen.tsx`

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Screen navigation
- **Google Gemini API** - AI vision and text generation
- **AsyncStorage** - Local data persistence
- **React Native Image Picker** - Camera and photo library access

## 📂 Project Structure

```
Maoxian-s-Vie/
├── src/
│   ├── screens/          # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   └── JournalDetailScreen.tsx
│   ├── services/         # API and storage services
│   │   ├── gemini.ts
│   │   └── storage.ts
│   ├── utils/            # Helper functions
│   │   └── imageHelper.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── App.tsx           # Main app component
├── ios/                  # iOS native code
├── package.json
└── README.md
```

## 🔧 Troubleshooting

### "Gemini API key is required" error
- Make sure you created `.env` file from `.env.example`
- Add your actual API key to `.env`
- Restart the Metro bundler

### Camera not working
- Ensure you've granted camera permissions in iOS Settings
- Check `Info.plist` has camera usage descriptions

### Photos not loading
- Grant photo library permissions in iOS Settings
- Try restarting the app

## 📝 License

MIT License - feel free to use this for your own furry friend!

## 🐾 Credits

Made with ❤️ for 小毛线 and all the playful, energetic dogs out there!

---

**Note**: This app requires an internet connection to use Google Gemini API for generating journal entries.
