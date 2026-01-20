import { JournalEntry } from '../types';

export const DEMO_ENTRIES: JournalEntry[] = [
  {
    id: 'demo-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    photoUri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    content: '汪汪！今天在公园里玩得超级开心！看到好多小朋友，我冲过去和他们打招呼，尾巴摇得像螺旋桨一样！有个小女孩给我扔球，我追得飞快，叼回来给她！大家都说我是最可爱的小毛线！\n\n草地上的味道真好闻，我打了好几个滚，毛毛都沾上了草的香味！阳光暖暖的，风轻轻的，这就是狗生最美好的时刻！\n\n回家的时候有点累，但是心里满满的都是快乐！明天还要去公园玩！期待见到新朋友！汪汪汪！',
    mood: 'excited',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'demo-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    photoUri: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
    content: '呼啊~~今天睡了一整天。。。早上吃完早饭，我就找到阳光最好的地方，趴下来晒太阳。暖洋洋的感觉让我好舒服，眼皮越来越重。。。\n\n做了好多梦！梦到自己在追蝴蝶，在草地上奔跑，和其他小狗狗玩耍。偶尔醒来，看看主人在不在，确认安全后又继续睡。。。\n\n傍晚醒来的时候，主人摸摸我的头，说我睡得好香。嘿嘿，充电完毕的小毛线又满血复活啦！现在精神满满，准备晚上好好玩！',
    mood: 'tired',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'demo-3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    photoUri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    content: '嘿嘿嘿~今天干了件"坏事"！主人出门的时候，我发现桌子上有个好香好香的东西。我跳起来看，是主人的三明治！\n\n我知道不应该偷吃，但是真的太香了！我左看右看，确认没人，然后轻轻地叼走了一小块。咬一口，哇！太好吃了！芝士和火腿的味道，简直是天堂！\n\n主人回来发现了，看着我的时候，我立刻坐得端端正正，歪着头装可爱。主人笑了，摸摸我说："小淘气鬼！"虽然被发现了，但是值得！嘿嘿！',
    mood: 'mischievous',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
  },
];
