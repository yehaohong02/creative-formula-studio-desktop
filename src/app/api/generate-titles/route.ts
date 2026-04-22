import { NextRequest, NextResponse } from 'next/server';

// 使用 Node.js Runtime 以获得更长的超时时间
export const runtime = 'nodejs';
export const maxDuration = 60; // 60秒超时

// 公式数据结构
const formulas = [
  {
    id: 'formula1',
    name: '末世生存+建造经营',
    structure: [
      { time: '0-3秒', content: '末世场景冲击（废墟/冰雪/火光）', type: '黄金3秒' },
      { time: '3-15秒', content: '基地建造过程（加速+音效）', type: '核心玩法' },
      { time: '15-30秒', content: '成长强化展示（成就）', type: '情绪爆点' },
      { time: '30秒+', content: '建立避难所', type: 'CTA' }
    ],
    tip: '重点展示建造过程的爽快感，用加速剪辑提升节奏'
  },
  {
    id: 'formula2',
    name: '真人剧情+游戏混剪',
    structure: [
      { time: '0-3秒', content: '真人困境（被嘲笑/失败/危机）', type: '黄金3秒' },
      { time: '3-15秒', content: '游戏高光时刻（反杀/胜利）', type: '核心玩法' },
      { time: '情绪爆点', content: '真人表情惊喜+游戏特效叠加', type: '情绪共鸣' },
      { time: '结尾', content: '点击下载，开启传奇', type: 'CTA' }
    ],
    tip: '真人与游戏切换流畅，情绪转折自然'
  },
  {
    id: 'formula3',
    name: '解压治愈+放松逃离',
    structure: [
      { time: '0-3秒', content: '生活压力场景（工作/噪音/焦虑）', type: '黄金3秒' },
      { time: '3-15秒', content: '游戏治愈画面（农场/动物/自然）', type: '核心玩法' },
      { time: '情绪爆点', content: '收获/装饰/萌宠互动', type: '情绪共鸣' },
      { time: '结尾', content: '来放松一下吧，远离压力', type: 'CTA' }
    ],
    tip: '突出逃离现实压力的情绪价值，节奏舒缓'
  },
  {
    id: 'formula4',
    name: '突发事件+快速响应',
    structure: [
      { time: '0-3秒', content: '紧急事件（敌人入侵/灾难发生）', type: '黄金3秒' },
      { time: '15秒', content: '快速应对策略（调兵/建造/升级）', type: '核心玩法' },
      { time: '情绪爆点', content: '成功防御/反击胜利', type: '情绪共鸣' },
      { time: '结尾', content: '你能应对这个挑战吗？', type: 'CTA' }
    ],
    tip: '适合新活动上线、版本更新时快速起量'
  },
  {
    id: 'formula5',
    name: '真人出镜+技巧展示',
    structure: [
      { time: '0-3秒', content: '真人展示（主播/玩家出镜）', type: '黄金3秒' },
      { time: '15秒', content: '游戏技巧演示（连招/走位/意识）', type: '核心玩法' },
      { time: '情绪爆点', content: '精彩击杀/团战胜利', type: '情绪共鸣' },
      { time: '结尾', content: '学了这个技巧，你也能上分', type: 'CTA' }
    ],
    tip: '真人出镜增加信任感，技巧展示要有可操作性'
  },
  {
    id: 'formula6',
    name: '新角色/新玩法首发',
    structure: [
      { time: '0-3秒', content: '新角色亮相/新玩法预告', type: '黄金3秒' },
      { time: '15秒', content: '技能展示/玩法教程', type: '核心玩法' },
      { time: '情绪爆点', content: '实战效果/玩家反应', type: '情绪共鸣' },
      { time: '结尾', content: '全新内容，立即体验', type: 'CTA' }
    ],
    tip: '适合版本更新、节日活动、IP联动期间投放'
  },
  {
    id: 'formula7',
    name: '短平快+高频测试',
    structure: [
      { time: '0-3秒', content: '核心玩法展示', type: '黄金3秒' },
      { time: '10秒', content: '快节奏剪辑（3-5个场景切换）', type: '核心玩法' },
      { time: '情绪爆点', content: '爽点集中爆发', type: '情绪共鸣' },
      { time: '结尾', content: '点击下载', type: 'CTA' }
    ],
    tip: '节奏要快，3-5秒内必须出现第一个爽点'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formulaId, gameDescription, platform, batch } = body;

    if (!formulaId || !gameDescription) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取公式结构
    const formula = formulas.find(f => f.id === formulaId);
    if (!formula) {
      return NextResponse.json(
        { error: '未找到对应的公式' },
        { status: 400 }
      );
    }

    // 火山方舟 API 配置
    const ARK_API_KEY = '4a08d76d-61f1-45ab-ba29-c0a601f9147d';
    const ARK_MODEL = 'doubao-seed-2-0-pro-260215';

    // 构建提示词 - 生成10个标题
    const prompt = buildTitlePrompt(formula, gameDescription, platform, batch);

    // 调用火山方舟 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ARK_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ARK API Error:', errorData);
      return NextResponse.json(
        { error: `AI 服务错误: ${response.status} - ${errorData.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('ARK API Response:', JSON.stringify(data, null, 2));
    
    const content = data.choices?.[0]?.message?.content || '';
    
    if (!content) {
      console.error('Empty content from ARK API:', data);
      return NextResponse.json(
        { error: 'AI 返回内容为空' },
        { status: 500 }
      );
    }
    
    // 解析标题列表
    const titles = parseTitles(content);
    
    if (titles.length === 0) {
      console.warn('No titles parsed from content:', content);
      // 返回原始内容作为备选
      return NextResponse.json({
        success: true,
        titles: [content.slice(0, 100) + '...'],
        raw: content,
      });
    }
    
    return NextResponse.json({
      success: true,
      titles: titles,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

function buildTitlePrompt(formula: any, gameDescription: string, platform: string = '抖音', batch: number = 1) {
  const seedVariation = batch > 1 ? `（第${batch}批，请提供与之前不同的创意）` : '';
  
  return `你是一位资深的短视频创意策划师，擅长写爆款标题。

**游戏**：${gameDescription}
**平台**：${platform}
**公式**：${formula.name}
**公式特点**：${formula.tip}${seedVariation}

**任务**：生成10个不同的短视频标题/钩子文案

**要求**：
1. 每个标题15-30字，口语化、有网感
2. 符合${platform}平台风格
3. 结合「${formula.name}」公式的特点
4. 要有吸引力，能抓住用户眼球
5. 每个标题用换行分隔，不要编号

**输出格式**：
直接输出10个标题，每行一个，不要其他说明文字。

请生成10个标题：`;
}

function parseTitles(content: string): string[] {
  // 按行分割并清理
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.match(/^\d+[\.、]/)) // 移除编号
    .map(line => line.replace(/^[""'']|[""'']$/g, '')) // 移除引号
    .map(line => line.replace(/^[-•*]\s*/, '')) // 移除列表符号
    .filter(line => line.length >= 5 && line.length <= 100);
  
  // 返回前10个
  return lines.slice(0, 10);
}
