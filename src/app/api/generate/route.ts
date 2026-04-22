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
    const { formulaId, gameDescription, platform, selectedTitle, version } = body;

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

    let result = '';
    
    // 根据请求类型生成不同内容
    if (version === 'oneminute') {
      // 只生成一分钟数据版
      const prompt = buildOneMinutePrompt(formula, gameDescription, platform, selectedTitle);
      result = await callArkAPI(ARK_API_KEY, ARK_MODEL, prompt);
    } else {
      // 生成三个版本（激进、猎奇、数据）
      const prompt = buildThreeVersionsPrompt(formula, gameDescription, platform, selectedTitle);
      result = await callArkAPI(ARK_API_KEY, ARK_MODEL, prompt);
    }
    
    return NextResponse.json({
      success: true,
      result: result,
      selectedTitle: selectedTitle,
      version: version || 'three',
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

async function callArkAPI(apiKey: string, model: string, prompt: string) {
  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2500,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('ARK API Error:', errorData);
    throw new Error(`AI 服务错误: ${response.status}`);
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || '';
  
  if (!result) {
    throw new Error('AI 返回内容为空');
  }
  
  return result;
}

function buildThreeVersionsPrompt(formula: any, gameDescription: string, platform: string = '抖音', selectedTitle: string) {
  const structureText = formula.structure.map((s: any, i: number) => 
    `${i + 1}. 【${s.type}】${s.time} - ${s.content}`
  ).join('\n');

  return `你是一位资深的AI买量视频创意策划师。

**游戏**：${gameDescription}
**平台**：${platform}
**公式**：${formula.name}
**核心创意标题**：${selectedTitle}

**公式结构**：
${structureText}

**任务**：基于以上信息，生成3个不同版本的完整短视频脚本。

**三个版本要求**：
- **版本A（激进版）**：节奏更快，冲突更强，适合追求刺激的用户
- **版本B（猎奇版）**：制造悬念，引发好奇，适合猎奇心理强的用户
- **版本C（数据版）**：突出数字、成就、对比，适合理性决策的用户

**每个版本必须包含**：
1. 严格按公式结构生成
2. 围绕核心标题「${selectedTitle}」展开
3. 标注时间节点（如：0-3秒）
4. 格式：时间 | 画面描述 | 文案/音效
5. 每个部分要具体可执行

**输出格式**：
# 版本A：激进版
[完整脚本...]

# 版本B：猎奇版
[完整脚本...]

# 版本C：数据版
[完整脚本...]

# 投放建议
- 版本A适合：...
- 版本B适合：...
- 版本C适合：...

请生成三个版本的完整脚本：`;
}

function buildOneMinutePrompt(formula: any, gameDescription: string, platform: string = '抖音', selectedTitle: string) {
  const structureText = formula.structure.map((s: any, i: number) => 
    `${i + 1}. 【${s.type}】${s.time} - ${s.content}`
  ).join('\n');

  return `你是一位资深的AI买量视频创意策划师。

**游戏**：${gameDescription}
**平台**：${platform}
**公式**：${formula.name}
**核心创意标题**：${selectedTitle}

**公式结构**：
${structureText}

**任务**：基于以上信息，生成1个60秒精简版脚本（一分钟数据版）。

**要求**：
- **一分钟数据版**：60秒精简版，数据密度高，节奏紧凑，信息量大
- 要比其他版本更详细，数据点更多（转化率、ROI、用户数等）
- 节奏更紧凑，每句话都要有信息量
- 严格按公式结构生成
- 围绕核心标题「${selectedTitle}」展开
- 标注时间节点（如：0-3秒）
- 格式：时间 | 画面描述 | 文案/音效
- 每个部分要具体可执行

**输出格式**：
# 版本D：一分钟数据版
[完整脚本...]

请生成一分钟数据版的完整脚本：`;
}
