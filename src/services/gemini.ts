import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse } from '../types';
import { GEMINI_API_KEY } from '@env';

// User needs to add their API key in .env file
const API_KEY = GEMINI_API_KEY || '';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null;
  private model: any;
  private demoMode: boolean;

  constructor(apiKey: string = API_KEY) {
    if (!apiKey || apiKey === '') {
      console.log('🎭 Demo Mode: No API key provided, using mock responses');
      this.demoMode = true;
      this.genAI = null;
      this.model = null;
    } else {
      this.demoMode = false;
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  private getMockResponse(): GeminiResponse {
    const mockResponses: GeminiResponse[] = [
      {
        mood: 'playful',
        activities: ['playing with toys', 'running around'],
        feelings: 'Super energetic and wanting to play!',
        journal: "汪汪！今天真是太棒啦！早上一醒来，我就看到阳光洒在地板上，那是最好的玩耍时间！我抓起我最喜欢的球球，在房间里跑来跑去，尾巴摇得像风扇一样快！主人看着我笑，我就更兴奋了！\n\n中午的时候，我躺在阳光下打了个小盹，梦到自己在追蝴蝶。醒来后发现主人在旁边，我立刻跳起来舔了舔主人的手，表示我准备好继续玩啦！\n\n今天的每一刻都充满了快乐！我是世界上最幸运的小毛线，有这么好的主人陪着我！期待明天的新冒险！汪汪汪！！！"
      },
      {
        mood: 'excited',
        activities: ['greeting owner', 'wagging tail'],
        feelings: 'Thrilled and full of joy!',
        journal: "哇哦哇哦哇哦！！！主人回来啦！我听到钥匙的声音就冲到门口，尾巴摇得我整个身体都在晃！太激动了太激动了！我想跳起来亲亲主人的脸！\n\n主人摸摸我的头，夸我是好孩子，我的心都要融化了！我是最最最幸福的小毛线！我围着主人转圈圈，表达我有多想念！\n\n今天最开心的就是这一刻！和最爱的人在一起，什么都不用想，只要摇尾巴就好！生活真美好！汪！"
      },
      {
        mood: 'curious',
        activities: ['exploring', 'sniffing around'],
        feelings: 'Intrigued by new things',
        journal: "咦？那是什么？今天发现了好多新鲜的东西！我的小鼻子一直在工作，嗅嗅这里，嗅嗅那里，每个角落都藏着有趣的故事！\n\n有个新的味道特别吸引我，可能是邻居家的猫咪来过？还是有什么好吃的？我要仔细调查调查！我歪着头，竖起耳朵，像个小侦探一样认真！\n\n做小毛线真有趣，每天都能发现新东西！世界这么大，我要用我的小鼻子和小眼睛探索每一个地方！明天会发现什么呢？好期待！"
      },
      {
        mood: 'tired',
        activities: ['resting', 'napping'],
        feelings: 'Sleepy but content',
        journal: "呼啊~~今天玩得好累呀。。。我现在躺在最喜欢的垫子上，软软的，暖暖的，好舒服。眼皮越来越重了。。。\n\n今天真的很充实！跑了好多步，玩了好多次，现在全身都放松了。主人在旁边，我感到超级安心，可以安心地睡个美美的觉。\n\n梦里我要去追云朵，在草地上打滚，和小伙伴们一起玩。。。晚安啦，明天见。。。zzZ"
      },
      {
        mood: 'happy',
        activities: ['enjoying treats', 'being petted'],
        feelings: 'Delighted and loved',
        journal: "耶！！！今天收到了最爱吃的小零食！咬一口，哇，好香好脆！尾巴摇得停不下来！主人真是太懂我了！\n\n吃完零食，主人抱起我，轻轻地摸我的头和背，那种感觉太舒服了！我闭上眼睛，发出满足的哼哼声。这就是幸福的感觉吧！\n\n我用我的小眼睛看着主人，想告诉主人：谢谢你爱我！我也超级爱你！我们永远是最好的朋友！小毛线今天也是被爱包围的一天！"
      },
      {
        mood: 'mischievous',
        activities: ['playing pranks', 'stealing items'],
        feelings: 'Playfully naughty',
        journal: "嘿嘿嘿~今天我做了件调皮的事情！我偷偷叼走了主人的袜子，藏在我的小窝里。主人找不到的时候，我在旁边装作什么都不知道，歪着头看主人，超级无辜的样子！\n\n其实我只是想和主人玩捉迷藏游戏啦！看主人着急的样子，我忍不住摇摇尾巴。最后主人发现了我的小秘密，摸摸我的头说我是小淘气鬼！\n\n虽然有点淘气，但我知道主人不会真的生气！因为我是可爱的小毛线嘛！明天继续想想要玩什么新花样，嘿嘿~"
      }
    ];

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  async analyzePhoto(photoBase64: string): Promise<GeminiResponse> {
    // Demo mode: return mock response
    if (this.demoMode) {
      console.log('🎭 Demo Mode: Generating mock journal entry');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return this.getMockResponse();
    }
    try {
      const prompt = `You are 小毛线 (Xiǎo Máoxiàn), a playful and energetic dog writing in your daily journal.

Analyze this photo and write a journal entry from the dog's perspective. The dog:
- Name: 小毛线 (Little Yarn)
- Personality: Playful, full of energy, enthusiastic
- Tone: Excited, uses lots of exclamation marks, speaks like a happy energetic dog would if they could talk

Based on the photo, determine:
1. What mood are you in? (happy/excited/playful/tired/curious/mischievous)
2. What activities do you see yourself doing?
3. How are you feeling about the moment?
4. Write a 3-4 paragraph journal entry in first person as 小毛线

Format your response as JSON:
{
  "mood": "one of: happy, excited, playful, tired, curious, mischievous",
  "activities": ["activity1", "activity2"],
  "feelings": "brief description of how the dog feels",
  "journal": "The full journal entry from 小毛线's perspective. Write naturally with personality - playful, energetic, enthusiastic. Use simple but expressive language a dog might use. Include sensory details and emotions."
}

Make the journal entry authentic and heartwarming, capturing the joy and energy of 小毛线's life!`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: photoBase64,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse Gemini response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing photo with Gemini:', error);
      throw error;
    }
  }
}
