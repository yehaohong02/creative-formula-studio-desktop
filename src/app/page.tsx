'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 7大公式数据
const formulas = [
  {
    id: 'formula1',
    name: '末世生存+建造经营',
    subtitle: '热门榜爆款公式',
    icon: '🔥',
    color: '#FF6B35',
    case: {
      game: 'Whiteout Survival',
      popularity: '18万/周',
      duration: '1分7秒',
      days: '19天'
    },
    structure: [
      { time: '0-3秒', content: '末世场景冲击（废墟/冰雪/火光）', type: '黄金3秒' },
      { time: '3-15秒', content: '基地建造过程（加速+音效）', type: '核心玩法' },
      { time: '15-30秒', content: '成长强化展示（成就）', type: '情绪爆点' },
      { time: '30秒+', content: '"建立你的避难所"', type: 'CTA' }
    ],
    tags: ['建造经营/模拟', '成就进步', '末世题材'],
    applyTo: '策略类、模拟经营类、生存类游戏',
    tip: '重点展示建造过程的爽快感，用加速剪辑提升节奏'
  },
  {
    id: 'formula2',
    name: '真人剧情+游戏混剪',
    subtitle: '热门榜爆款公式',
    icon: '🎬',
    color: '#00D9FF',
    case: {
      game: 'Dark War:Survival',
      popularity: '13万/周',
      duration: '34秒',
      days: '10天'
    },
    structure: [
      { time: '0-3秒', content: '真人困境（被嘲笑/失败/危机）', type: '黄金3秒' },
      { time: '3-15秒', content: '游戏高光时刻（反杀/胜利）', type: '核心玩法' },
      { time: '情绪爆点', content: '真人表情惊喜+游戏特效叠加', type: '情绪共鸣' },
      { time: '结尾', content: '"点击下载，开启你的传奇"', type: 'CTA' }
    ],
    tags: ['真人', '剧情叙事', '混合'],
    applyTo: '中重度游戏、动作类、策略类',
    tip: '真人与游戏的切换要流畅，情绪转折要自然'
  },
  {
    id: 'formula3',
    name: '解压治愈+放松逃离',
    subtitle: '热门榜爆款公式',
    icon: '🌿',
    color: '#7ED321',
    case: {
      game: 'Big Farm Homestead',
      popularity: '15万/周',
      duration: '59秒',
      days: '28天'
    },
    structure: [
      { time: '0-3秒', content: '生活压力场景（工作/噪音/焦虑）', type: '黄金3秒' },
      { time: '3-15秒', content: '游戏治愈画面（农场/动物/自然）', type: '核心玩法' },
      { time: '情绪爆点', content: '收获/装饰/萌宠互动', type: '情绪共鸣' },
      { time: '结尾', content: '"来放松一下吧，远离压力"', type: 'CTA' }
    ],
    tags: ['解压治愈', '放松逃离', '建造经营'],
    applyTo: '模拟经营类、休闲类、治愈系游戏',
    tip: '突出"逃离现实压力"的情绪价值，节奏要舒缓'
  },
  {
    id: 'formula4',
    name: '突发事件+快速响应',
    subtitle: '飙升榜增长公式',
    icon: '⚡',
    color: '#FFD700',
    case: {
      game: '待监控',
      popularity: '-',
      duration: '30-60秒',
      days: '7-14天'
    },
    structure: [
      { time: '0-3秒', content: '紧急事件（敌人入侵/灾难发生）', type: '黄金3秒' },
      { time: '15秒', content: '快速应对策略（调兵/建造/升级）', type: '核心玩法' },
      { time: '情绪爆点', content: '成功防御/反击胜利', type: '情绪共鸣' },
      { time: '结尾', content: '"你能应对这个挑战吗？"', type: 'CTA' }
    ],
    tags: ['技巧挑战', '逆境反击', '突发事件'],
    applyTo: '策略类、塔防类、SLG游戏',
    tip: '适合新活动上线、版本更新时快速起量',
    note: '本周暂无数据，建议监控竞品版本更新'
  },
  {
    id: 'formula5',
    name: '真人出镜+技巧展示',
    subtitle: '新创意榜霸榜公式',
    icon: '🎯',
    color: '#FF006E',
    case: {
      game: 'Mobile Legends',
      popularity: '8-13万/周',
      duration: '24秒',
      days: '4-7天'
    },
    structure: [
      { time: '0-3秒', content: '真人展示（主播/玩家出镜）', type: '黄金3秒' },
      { time: '15秒', content: '游戏技巧演示（连招/走位/意识）', type: '核心玩法' },
      { time: '情绪爆点', content: '精彩击杀/团战胜利', type: '情绪共鸣' },
      { time: '结尾', content: '"学了这个技巧，你也能上分"', type: 'CTA' }
    ],
    tags: ['真人', '技巧挑战', '真实专业'],
    applyTo: 'MOBA、FPS、动作类、竞技游戏',
    tip: '真人出镜增加信任感，技巧展示要有可操作性'
  },
  {
    id: 'formula6',
    name: '新角色/新玩法首发',
    subtitle: '新创意榜测试公式',
    icon: '🆕',
    color: '#9B59B6',
    case: {
      game: 'MONOPOLY GO!',
      popularity: '11万/周',
      duration: '1分24秒',
      days: '6-8天'
    },
    structure: [
      { time: '0-3秒', content: '新角色亮相/新玩法预告', type: '黄金3秒' },
      { time: '15秒', content: '技能展示/玩法教程', type: '核心玩法' },
      { time: '情绪爆点', content: '实战效果/玩家反应', type: '情绪共鸣' },
      { time: '结尾', content: '"全新内容，立即体验"', type: 'CTA' }
    ],
    tags: ['剧情叙事', '沉浸剧情', '探索好奇'],
    applyTo: '有IP联动、新角色、新玩法更新时',
    tip: '适合版本更新、节日活动、IP联动期间投放'
  },
  {
    id: 'formula7',
    name: '短平快+高频测试',
    subtitle: '新创意榜测试公式',
    icon: '⚡',
    color: '#FFBE0B',
    case: {
      game: 'Hexa Diamonds',
      popularity: '13万/周',
      duration: '30秒',
      days: '4-5天'
    },
    structure: [
      { time: '0-3秒', content: '核心玩法展示', type: '黄金3秒' },
      { time: '10秒', content: '快节奏剪辑（3-5个场景切换）', type: '核心玩法' },
      { time: '情绪爆点', content: '爽点集中爆发', type: '情绪共鸣' },
      { time: '结尾', content: '简单直接"点击下载"', type: 'CTA' }
    ],
    tags: ['玩法', '休闲治愈', '快节奏'],
    applyTo: '超休闲游戏、轻度游戏、休闲益智类',
    tip: '节奏要快，3-5秒内必须出现第一个爽点'
  }
];

// 榜单对比数据
const chartComparison = [
  { name: '每周热门榜', period: '30-100天', formula: '深度内容+长期优化', duration: '60秒+', tags: '成就进步、解压治愈' },
  { name: '每周飙升榜', period: '7-14天', formula: '热点事件+快速响应', duration: '30-60秒', tags: '技巧挑战、逆境反击' },
  { name: '新创意榜', period: '4-8天', formula: '创新测试+快速迭代', duration: '15-40秒', tags: '真人、技巧挑战、探索好奇' }
];

// 主题切换图标
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export default function Home() {
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'formulas' | 'cases'>('formulas');
  
  // 标题选择和版本生成状态
  const [titleCards, setTitleCards] = useState<string[]>([]);
  const [showTitleSelection, setShowTitleSelection] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [titleLoading, setTitleLoading] = useState(false);
  const [titleBatch, setTitleBatch] = useState(1);
  const [parsedVersions, setParsedVersions] = useState<any[]>([]);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null);
  const [oneMinuteVersion, setOneMinuteVersion] = useState<any>(null); // 一分钟版本
  const [errorMessage, setErrorMessage] = useState<string>(''); // 错误信息
  
  // 筛选状态和弹窗
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [modalFormula, setModalFormula] = useState<any>(null);
  
  // 生成中弹窗
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [generatingText, setGeneratingText] = useState('AI 正在生成创意脚本...');
  
  const [formData, setFormData] = useState({
    gameName: '',
    gameType: '',
    coreGameplay: '',
    targetAudience: '',
    duration: '30',
    platform: '抖音',
    sellingPoint: '',
    painPoint: '',
  });

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  // 生成标题卡片
  const handleGenerateTitles = async () => {
    if (!selectedFormula || !formData.coreGameplay.trim()) {
      alert('请用一句话描述你的游戏');
      return;
    }
    setTitleLoading(true);
    setTitleBatch(1);
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaId: selectedFormula,
          gameDescription: formData.coreGameplay,
          platform: formData.platform,
          batch: 1,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTitleCards(data.titles);
        setShowTitleSelection(true);
      } else {
        alert('生成失败：' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('请求失败，请检查网络连接后重试');
    } finally {
      setTitleLoading(false);
    }
  };

  // 换一批标题
  const handleRefreshTitles = async () => {
    if (!selectedFormula) return;
    setTitleLoading(true);
    const newBatch = titleBatch + 1;
    setTitleBatch(newBatch);
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaId: selectedFormula,
          gameDescription: formData.coreGameplay,
          platform: formData.platform,
          batch: newBatch,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTitleCards(data.titles);
      } else {
        alert('生成失败：' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('请求失败，请检查网络连接后重试');
    } finally {
      setTitleLoading(false);
    }
  };

  // 选择标题后生成3个版本
  const handleSelectTitle = async (title: string, index: number) => {
    if (selectedTitleIndex !== null) return; // 防止重复点击
    setSelectedTitleIndex(index);
    setSelectedTitle(title);
    setShowGeneratingModal(true);
    setGeneratingText('AI 正在生成创意脚本...');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaId: selectedFormula,
          gameDescription: formData.coreGameplay,
          platform: formData.platform,
          selectedTitle: title,
          version: 'three', // 生成三个版本
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        // 解析版本（只解析A、B、C）
        const versions = parseVersions(data.result);
        setParsedVersions(versions);
        setOneMinuteVersion(null); // 清空一分钟版本
        setShowTitleSelection(false);
      } else {
        alert('生成失败：' + (data.error || '未知错误'));
        setSelectedTitleIndex(null);
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('请求失败，请检查网络连接后重试');
      setSelectedTitleIndex(null);
    } finally {
      setShowGeneratingModal(false);
    }
  };

  // 生成一分钟版本
  const handleGenerateOneMinute = async () => {
    if (!selectedTitle) return;
    setShowGeneratingModal(true);
    setGeneratingText('AI 正在生成一分钟数据版...');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaId: selectedFormula,
          gameDescription: formData.coreGameplay,
          platform: formData.platform,
          selectedTitle: selectedTitle,
          version: 'oneminute', // 只生成一分钟版本
        }),
      });
      const data = await response.json();
      if (data.success) {
        // 解析一分钟版本
        const versions = parseVersions(data.result);
        const oneMin = versions.find(v => v.letter === 'D');
        if (oneMin) {
          setOneMinuteVersion(oneMin);
        }
      } else {
        alert('生成失败：' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('请求失败，请检查网络连接后重试');
    } finally {
      setShowGeneratingModal(false);
    }
  };

  // 解析版本A、B、C、D
  const parseVersions = (result: string) => {
    const versions: any[] = [];
    const versionMap: Record<string, { letter: string; title: string; subtitle: string; color: string }> = {
      'A': { letter: 'A', title: '激进版', subtitle: '节奏更快，冲突更强，适合追求刺激的用户', color: '#FF6B35' },
      'B': { letter: 'B', title: '猎奇版', subtitle: '制造悬念，引发好奇，适合猎奇心理强的用户', color: '#9B59B6' },
      'C': { letter: 'C', title: '数据版', subtitle: '突出数字、成就、对比，适合理性决策的用户', color: '#00D9FF' },
      'D': { letter: 'D', title: '一分钟数据版', subtitle: '60秒精简版，数据密集，适合快速投放测试', color: '#10B981' },
    };
    
    // 匹配版本A、B、C、D
    const versionRegex = /#\s*版本([ABCD])[：:]\s*([^\n]+)\n([\s\S]*?)(?=#\s*版本|#\s*投放建议|$)/g;
    let match;
    
    while ((match = versionRegex.exec(result)) !== null) {
      const letter = match[1];
      const content = match[3].trim();
      const info = versionMap[letter];
      
      if (info) {
        versions.push({
          letter: info.letter,
          title: info.title,
          subtitle: info.subtitle,
          color: info.color,
          content: content,
        });
      }
    }
    
    return versions;
  };

  // 本地备用标题生成
  const generateLocalTitles = (gameDesc: string, formulaName: string) => {
    const keywords = gameDesc.slice(0, 20);
    return [
      `${keywords}竟然这么好玩，上头到停不下来`,
      `玩了${keywords}三天三夜，根本停不下来`,
      `${keywords}新手必看，这些技巧让你快速上手`,
      `为什么${keywords}突然火了？玩了才知道`,
      `${keywords}隐藏玩法大揭秘，99%的人不知道`,
      `从菜鸟到大神，${keywords}只需要这几步`,
      `${keywords}最强攻略，看完直接起飞`,
      `别再用老方法玩${keywords}了，试试这个`,
      `${keywords}大神都在用的秘密技巧`,
      `玩了${keywords}之后，其他游戏都不香了`,
    ];
  };

  const handleGenerate = async () => {
    if (!selectedFormula) {
      alert('请先选择一个公式');
      return;
    }
    if (!formData.coreGameplay.trim()) {
      alert('请用一句话描述你的游戏');
      return;
    }
    // 显示生成中弹窗
    setShowGeneratingModal(true);
    setGeneratingText('AI 正在生成创意标题...');
    setTitleLoading(true);
    setTitleBatch(1);
    setErrorMessage('');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
      
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaId: selectedFormula,
          gameDescription: formData.coreGameplay,
          platform: formData.platform,
          batch: 1,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success && data.titles && data.titles.length > 0) {
        setTitleCards(data.titles);
        setShowTitleSelection(true);
        console.log('Titles set:', data.titles);
      } else {
        // API 返回空数据，使用本地备用
        console.warn('API returned empty, using local titles');
        const localTitles = generateLocalTitles(formData.coreGameplay, selectedFormulaData?.name || '');
        setTitleCards(localTitles);
        setShowTitleSelection(true);
      }
    } catch (error: any) {
      console.error('Generate error:', error);
      // 发生错误，使用本地备用标题
      console.warn('API error, using local titles');
      const localTitles = generateLocalTitles(formData.coreGameplay, selectedFormulaData?.name || '');
      setTitleCards(localTitles);
      setShowTitleSelection(true);
      setErrorMessage('AI 服务响应较慢，已使用备用标题');
    } finally {
      setTitleLoading(false);
      setShowGeneratingModal(false);
    }
  };

  const selectedFormulaData = formulas.find(f => f.id === selectedFormula);

  if (!mounted) return null;

  return (
    <main className="min-h-screen transition-colors duration-500">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none grid-bg opacity-50" />
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${isDark ? 'bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]' : 'bg-gradient-to-b from-transparent via-[#f8f9fa]/50 to-[#f8f9fa]'}`} />

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative border-b sticky top-0 z-50 backdrop-blur-md"
        style={{ 
          backgroundColor: isDark ? 'rgba(10, 10, 15, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative w-12 h-12"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 rounded-lg rotate-3" style={{ background: isDark ? 'linear-gradient(to bottom right, #00F0FF, #A855F7)' : 'linear-gradient(to bottom right, #0066FF, #7C3AED)' }} />
              <div className="absolute inset-0 rounded-lg flex items-center justify-center text-xl font-black" style={{ backgroundColor: isDark ? '#0a0a0f' : '#f8f9fa' }}>
                <span className="gradient-text">7F</span>
              </div>
            </motion.div>
            <div>
              <h1 className="font-black text-xl tracking-tight">
                <span className="gradient-text">创意公式工坊</span>
              </h1>
              <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                爆款创意公式 · 基于广大大数据
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation Tabs - 删除榜单对比 */}
            <div className="hidden md:flex items-center gap-2 mr-4">
              {[
                { id: 'formulas', label: '爆款公式' },
                { id: 'cases', label: '实战案例' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'hover:bg-white/5'
                  }`}
                  style={{ color: activeTab === tab.id ? undefined : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)') }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl transition-all duration-300"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <MoonIcon /> : <SunIcon />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Formulas Tab */}
          {activeTab === 'formulas' && (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <motion.section className="mb-12">
                <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight text-center">
                  <span className="block gradient-text">爆款创意公式</span>
                </h2>
                
                {/* 筛选按钮 - 在标题下面 */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {[
                    { id: 'all', label: '全部公式', color: '#6366f1' },
                    { id: 'hot', label: '每周热门榜', color: '#f59e0b' },
                    { id: 'surging', label: '每周飙升榜', color: '#ef4444' },
                    { id: 'new', label: '新创意榜', color: '#06b6d4' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilterCategory(btn.id)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                        filterCategory === btn.id
                          ? 'text-white shadow-lg'
                          : isDark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'
                      }`}
                      style={{
                        backgroundColor: filterCategory === btn.id 
                          ? btn.color
                          : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                        border: `2px solid ${filterCategory === btn.id ? btn.color : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}`
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                  {/* 榜单对比弹窗按钮 */}
                  <button
                    onClick={() => setShowComparisonModal(true)}
                    className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                    style={{
                      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                      border: `2px solid ${isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
                      color: '#8b5cf6'
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    榜单对比
                  </button>
                </div>
                
                {/* 日期 - 在按钮下面，卡片上面 */}
                <div className="flex justify-end mb-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-block px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                    }}
                  >
                    20260413--20260419
                  </motion.div>
                </div>
              </motion.section>

              {/* Formula Cards Grid */}
              <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {formulas.filter(formula => {
                  if (filterCategory === 'all') return true;
                  if (filterCategory === 'hot') return formula.subtitle.includes('热门');
                  if (filterCategory === 'surging') return formula.subtitle.includes('飙升');
                  if (filterCategory === 'new') return formula.subtitle.includes('新创意');
                  return true;
                }).map((formula, index) => (
                  <motion.div
                    key={formula.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                    onClick={() => {
                    setModalFormula(formula);
                    setShowFormulaModal(true);
                  }}
                    className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      selectedFormula === formula.id
                        ? 'ring-2'
                        : 'hover:scale-[1.02]'
                    }`}
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                      borderColor: selectedFormula === formula.id ? formula.color : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                      boxShadow: selectedFormula === formula.id ? `0 0 30px ${formula.color}20` : 'none'
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ 
                          backgroundColor: `${formula.color}20`,
                          border: `1px solid ${formula.color}40`
                        }}
                      >
                        {formula.icon}
                      </div>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${formula.color}15`,
                          color: formula.color
                        }}
                      >
                        {formula.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black mb-2" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                      {formula.name}
                    </h3>

                    {/* Case Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>代表案例</span>
                        <span className="font-medium" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>{formula.case.game}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>人气值</span>
                        <span className="font-bold" style={{ color: formula.color }}>{formula.case.popularity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>素材时长</span>
                        <span style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>{formula.case.duration}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {formula.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                  </motion.div>
                ))}
              </section>

            </motion.div>
          )}

          {/* Cases Tab - Script Generator */}
          {activeTab === 'cases' && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {!result ? (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-black text-center mb-8" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                    使用公式生成脚本
                  </h2>
                  
                  {/* Selected Formula Display */}
                  {selectedFormulaData && (
                    <div 
                      className="p-4 rounded-xl mb-8 flex items-center justify-between"
                      style={{ 
                        backgroundColor: `${selectedFormulaData.color}15`,
                        border: `1px solid ${selectedFormulaData.color}40`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedFormulaData.icon}</span>
                        <div>
                          <p className="font-bold" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>{selectedFormulaData.name}</p>
                          <p className="text-xs" style={{ color: selectedFormulaData.color }}>{selectedFormulaData.subtitle}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('formulas')}
                        className="text-sm px-3 py-1 rounded-lg hover:opacity-80"
                        style={{ color: selectedFormulaData.color }}
                      >
                        更换公式 →
                      </button>
                    </div>
                  )}

                  {/* 简化的表单 */}
                  <div 
                    className="p-8 rounded-3xl border"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="space-y-6">
                      {/* 一句话描述游戏 */}
                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                          用一句话描述你的游戏 *
                        </label>
                        <textarea
                          value={formData.coreGameplay}
                          onChange={(e) => setFormData({...formData, coreGameplay: e.target.value})}
                          placeholder="例如：一款末世生存游戏，玩家需要在废墟中建立避难所，收集资源，抵御丧尸入侵..."
                          className="w-full px-4 py-4 rounded-xl focus:outline-none transition-all resize-none"
                          style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                            color: isDark ? '#ffffff' : '#1a1a2e',
                            minHeight: '100px'
                          }}
                        />
                      </div>

                      {/* 投放平台 */}
                      <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                          投放平台 *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['抖音', '快手', '微信视频号', 'TikTok', 'YouTube'].map((platform) => (
                            <button
                              key={platform}
                              onClick={() => setFormData({...formData, platform})}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                formData.platform === platform
                                  ? 'text-white'
                                  : isDark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'
                              }`}
                              style={{
                                backgroundColor: formData.platform === platform 
                                  ? selectedFormulaData?.color || '#00F0FF'
                                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                              }}
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 错误信息显示 */}
                      {errorMessage && (
                        <div 
                          className="p-4 rounded-xl text-sm"
                          style={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444'
                          }}
                        >
                          {errorMessage}
                        </div>
                      )}

                      <motion.button
                        onClick={() => {
                          setErrorMessage('');
                          handleGenerate();
                        }}
                        disabled={loading || !formData.coreGameplay.trim() || !selectedFormula}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-black text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        style={{
                          background: selectedFormulaData 
                            ? `linear-gradient(135deg, ${selectedFormulaData.color}40, ${selectedFormulaData.color}20)`
                            : 'linear-gradient(135deg, rgba(0,240,255,0.4), rgba(0,240,255,0.2))',
                          border: `1px solid ${selectedFormulaData ? selectedFormulaData.color + '60' : 'rgba(0,240,255,0.6)'}`,
                          color: isDark ? '#ffffff' : '#1a1a2e'
                        }}
                      >
                        {loading ? 'AI 生成中...' : '生成脚本'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : showTitleSelection ? (
                // 标题选择界面
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black mb-2" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                      选择核心创意标题
                    </h2>
                    <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                      基于「{selectedFormulaData?.name}」公式生成的10个标题
                    </p>
                  </div>

                  {/* 标题卡片网格 */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {titleCards.map((title, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: selectedTitleIndex === index ? 0.7 : 1, 
                          y: 0,
                          scale: selectedTitleIndex === index ? 0.98 : 1
                        }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectTitle(title, index)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden ${
                          selectedTitleIndex === index ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: selectedTitleIndex === index 
                            ? `${selectedFormulaData?.color}15`
                            : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'),
                          borderColor: selectedTitleIndex === index 
                            ? selectedFormulaData?.color 
                            : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                          boxShadow: selectedTitleIndex === index ? `0 0 20px ${selectedFormulaData?.color}30` : 'none'
                        }}
                      >
                        {/* 选中遮罩 */}
                        {selectedTitleIndex === index && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: `${selectedFormulaData?.color}20` }}
                          >
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold"
                              style={{ 
                                backgroundColor: selectedFormulaData?.color,
                                color: '#fff'
                              }}
                            >
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              生成中...
                            </div>
                          </motion.div>
                        )}
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                            style={{ 
                              backgroundColor: selectedTitleIndex === index 
                                ? selectedFormulaData?.color 
                                : `${selectedFormulaData?.color}20`,
                              color: selectedTitleIndex === index ? '#fff' : selectedFormulaData?.color
                            }}
                          >
                            {index + 1}
                          </span>
                          <p className="flex-1 text-sm font-medium leading-relaxed" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                            {title}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleRefreshTitles}
                      disabled={titleLoading}
                      className="flex-1 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        color: isDark ? '#ffffff' : '#1a1a2e'
                      }}
                    >
                      {titleLoading ? '生成中...' : '换一批'}
                    </button>
                    <button
                      onClick={() => setShowTitleSelection(false)}
                      className="flex-1 py-3 rounded-xl font-bold transition-all"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        color: isDark ? '#ffffff' : '#1a1a2e'
                      }}
                    >
                      返回
                    </button>
                  </div>
                </motion.div>
              ) : result ? (
                // 四个版本展示
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-5xl mx-auto"
                >
                  {/* 标题栏 */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                        四个版本脚本
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                        核心标题：{selectedTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setResult(null);
                        setParsedVersions([]);
                        setShowTitleSelection(false);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: isDark ? 'rgba(0,240,255,0.1)' : 'rgba(0,100,255,0.1)',
                        border: `1px solid ${isDark ? 'rgba(0,240,255,0.3)' : 'rgba(0,100,255,0.3)'}`,
                        color: isDark ? '#00F0FF' : '#0066FF'
                      }}
                    >
                      重新生成
                    </button>
                  </div>

                  {/* 三个版本卡片 */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {parsedVersions.filter(v => v.letter !== 'D').map((version, index) => (
                      <motion.div
                        key={version.letter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-2xl border overflow-hidden flex flex-col"
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }}
                      >
                        {/* 版本头部 */}
                        <div 
                          className="p-4 flex items-center justify-between"
                          style={{ 
                            background: `linear-gradient(135deg, ${version.color}20, ${version.color}10)`,
                            borderBottom: `2px solid ${version.color}40`
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                              style={{ 
                                backgroundColor: version.color,
                                color: '#fff'
                              }}
                            >
                              {version.letter}
                            </div>
                            <div>
                              <h3 className="font-bold" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                                {version.title}
                              </h3>
                              <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                                {version.subtitle}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(version.content)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            style={{
                              backgroundColor: `${version.color}20`,
                              color: version.color,
                              border: `1px solid ${version.color}40`
                            }}
                          >
                            复制
                          </button>
                        </div>

                        {/* 脚本内容 - 美化排版 */}
                        <div className="p-4 flex-1 max-h-96 overflow-y-auto">
                          <div className="space-y-3">
                            {version.content.split('\n').filter((line: string) => line.trim()).map((line: string, lineIndex: number) => {
                              // 检测是否是时间节点行 (如: 0-3秒、15秒等)
                              const isTimeLine = /^\d+[-~]?\d*秒?/.test(line.trim()) || line.includes('|');
                              // 检测是否是类型标签行 (如: 【黄金3秒】)
                              const isTypeLine = line.includes('【') && line.includes('】');
                              // 检测是否是小标题
                              const isSubTitle = line.trim().startsWith('#') || line.trim().startsWith('##');
                              
                              if (isTimeLine) {
                                const parts = line.split('|').map(p => p.trim());
                                return (
                                  <div 
                                    key={lineIndex}
                                    className="flex gap-3 p-3 rounded-lg"
                                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                                  >
                                    {parts.map((part, partIndex) => (
                                      <div key={partIndex} className={partIndex === 0 ? 'flex-shrink-0' : 'flex-1'}>
                                        {partIndex === 0 ? (
                                          <span 
                                            className="inline-block px-2 py-1 rounded text-xs font-bold"
                                            style={{ 
                                              backgroundColor: `${version.color}20`,
                                              color: version.color
                                            }}
                                          >
                                            {part}
                                          </span>
                                        ) : (
                                          <span className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)' }}>
                                            {part}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                              
                              if (isTypeLine) {
                                return (
                                  <div 
                                    key={lineIndex}
                                    className="flex items-center gap-2 mt-4 mb-2"
                                  >
                                    <span 
                                      className="px-2 py-0.5 rounded text-xs font-bold"
                                      style={{ 
                                        backgroundColor: `${version.color}30`,
                                        color: version.color
                                      }}
                                    >
                                      {line.match(/【(.+?)】/)?.[1] || line}
                                    </span>
                                  </div>
                                );
                              }
                              
                              if (isSubTitle) {
                                return (
                                  <h4 
                                    key={lineIndex}
                                    className="text-sm font-bold mt-4 mb-2"
                                    style={{ color: version.color }}
                                  >
                                    {line.replace(/^#+\s*/, '')}
                                  </h4>
                                );
                              }
                              
                              return (
                                <p 
                                  key={lineIndex}
                                  className="text-sm pl-2 border-l-2"
                                  style={{ 
                                    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                    borderColor: `${version.color}30`
                                  }}
                                >
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        </div>

                        {/* 一分钟按钮 */}
                        <div className="p-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                          <button
                            onClick={handleGenerateOneMinute}
                            disabled={!!oneMinuteVersion}
                            className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{
                              backgroundColor: oneMinuteVersion ? '#10B98120' : '#10B981',
                              color: oneMinuteVersion ? '#10B981' : '#fff',
                            }}
                          >
                            {oneMinuteVersion ? (
                              <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                已生成一分钟版
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                生成一分钟版
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 一分钟数据版 - 大卡片 */}
                  {oneMinuteVersion && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-8 rounded-2xl border overflow-hidden"
                      style={{ 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        boxShadow: `0 10px 40px ${oneMinuteVersion.color}20`
                      }}
                    >
                      {/* 版本头部 */}
                      <div 
                        className="p-5 flex items-center justify-between"
                        style={{ 
                          background: `linear-gradient(135deg, #10B98130, #10B98110)`,
                          borderBottom: `2px solid #10B98140`
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                            style={{ 
                              backgroundColor: '#10B981',
                              color: '#fff',
                              boxShadow: `0 4px 15px #10B98160`
                            }}
                          >
                            60s
                          </div>
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                              一分钟的数据版
                            </h3>
                            <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                              精简版60秒脚本，适合快速投放测试，数据驱动，信息密集
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(oneMinuteVersion?.content || '')}
                          className="px-6 py-3 rounded-xl transition-all text-sm font-bold hover:scale-105"
                          style={{ 
                            backgroundColor: '#10B981',
                            color: '#fff',
                            boxShadow: `0 4px 15px #10B98140`
                          }}
                        >
                          复制完整版
                        </button>
                      </div>

                      {/* 脚本内容 - 美化排版 */}
                      <div className="p-6 max-h-[500px] overflow-y-auto">
                        <div className="space-y-4">
                          {oneMinuteVersion.content.split('\n').filter((line: string) => line.trim()).map((line: string, lineIndex: number) => {
                            const isTimeLine = /^\d+[-~]?\d*秒?/.test(line.trim()) || line.includes('|');
                            const isTypeLine = line.includes('【') && line.includes('】');
                            const isSubTitle = line.trim().startsWith('#') || line.trim().startsWith('##');
                            
                            if (isTimeLine) {
                              const parts = line.split('|').map((p: string) => p.trim());
                              return (
                                <div 
                                  key={lineIndex}
                                  className="flex gap-4 p-4 rounded-xl"
                                  style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.03)' }}
                                >
                                  {parts.map((part: string, partIndex: number) => (
                                    <div key={partIndex} className={partIndex === 0 ? 'flex-shrink-0' : 'flex-1'}>
                                      {partIndex === 0 ? (
                                        <span 
                                          className="inline-block px-3 py-1.5 rounded-lg text-sm font-bold"
                                          style={{ 
                                            backgroundColor: '#10B98120',
                                            color: '#10B981'
                                          }}
                                        >
                                          {part}
                                        </span>
                                      ) : (
                                        <span className="text-base" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)' }}>
                                          {part}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            
                            if (isTypeLine) {
                              return (
                                <div 
                                  key={lineIndex}
                                  className="flex items-center gap-2 mt-6 mb-3"
                                >
                                  <span 
                                    className="px-3 py-1 rounded-lg text-sm font-bold"
                                    style={{ 
                                      backgroundColor: '#10B98130',
                                      color: '#10B981'
                                    }}
                                  >
                                    {line.match(/【(.+?)】/)?.[1] || line}
                                  </span>
                                </div>
                              );
                            }
                            
                            if (isSubTitle) {
                              return (
                                <h4 
                                  key={lineIndex}
                                  className="text-base font-bold mt-6 mb-3"
                                  style={{ color: '#10B981' }}
                                >
                                  {line.replace(/^#+\s*/, '')}
                                </h4>
                              );
                            }
                            
                            return (
                              <p 
                                key={lineIndex}
                                className="text-base pl-3 border-l-2"
                                style={{ 
                                  color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                                  borderColor: '#10B98140'
                                }}
                              >
                                {line}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 原始结果折叠 */}
                  <div className="mt-8">
                    <details className="rounded-xl border overflow-hidden" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                      <summary 
                        className="p-4 cursor-pointer font-bold text-sm"
                        style={{ 
                          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                        }}
                      >
                        查看原始文本
                      </summary>
                      <div className="p-4">
                        <pre 
                          className="whitespace-pre-wrap text-xs leading-relaxed font-sans"
                          style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
                        >
                          {result}
                        </pre>
                      </div>
                    </details>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 榜单对比弹窗 */}
      <AnimatePresence>
        {showComparisonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowComparisonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-3xl border max-w-4xl w-full max-h-[90vh] overflow-auto"
              style={{ 
                backgroundColor: isDark ? 'rgba(20,20,30,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div 
                className="p-6 border-b flex items-center justify-between sticky top-0"
                style={{ 
                  backgroundColor: isDark ? 'rgba(20,20,30,0.98)' : 'rgba(255,255,255,0.98)',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
              >
                <h2 className="text-2xl font-black" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                  三榜对比分析
                </h2>
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 弹窗内容 */}
              <div className="p-6">
                {/* 表格 */}
                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                        <th className="text-left py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>榜单类型</th>
                        <th className="text-left py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>投放周期</th>
                        <th className="text-left py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>核心公式</th>
                        <th className="text-left py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>素材时长</th>
                        <th className="text-left py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>关键标签</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartComparison.map((row, i) => (
                        <tr 
                          key={i} 
                          style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
                        >
                          <td className="py-4 px-4 font-bold" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>{row.name}</td>
                          <td className="py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>{row.period}</td>
                          <td className="py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>{row.formula}</td>
                          <td className="py-4 px-4" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>{row.duration}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {row.tags.split('、').map((tag, j) => (
                                <span 
                                  key={j}
                                  className="text-xs px-2 py-0.5 rounded"
                                  style={{ 
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                    color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 策略卡片 */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: '长期优化', desc: '每周热门榜素材投放30-100天，需要持续优化迭代', icon: '📈', color: '#7ED321' },
                    { title: '快速响应', desc: '飙升榜素材7-14天，抓住热点事件快速起量', icon: '⚡', color: '#FFD700' },
                    { title: '高频测试', desc: '新创意榜4-8天快速测试，验证创意方向', icon: '🧪', color: '#FF006E' }
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-2xl"
                      style={{ 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                      }}
                    >
                      <div className="text-4xl mb-4">{card.icon}</div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: card.color }}>{card.title}</h3>
                      <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>{card.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 公式详情弹窗 */}
      <AnimatePresence>
        {showFormulaModal && modalFormula && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowFormulaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-3xl border max-w-2xl w-full max-h-[90vh] overflow-auto"
              style={{ 
                backgroundColor: isDark ? 'rgba(20,20,30,0.98)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div 
                className="p-6 border-b flex items-center justify-between sticky top-0"
                style={{ 
                  backgroundColor: isDark ? 'rgba(20,20,30,0.98)' : 'rgba(255,255,255,0.98)',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ 
                      backgroundColor: `${modalFormula.color}20`,
                      border: `2px solid ${modalFormula.color}`
                    }}
                  >
                    {modalFormula.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                      {modalFormula.name}
                    </h2>
                    <p className="text-sm" style={{ color: modalFormula.color }}>{modalFormula.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFormulaModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 弹窗内容 */}
              <div className="p-6">
                {/* Structure Timeline */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-4" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                    公式结构拆解
                  </h4>
                  <div className="space-y-3">
                    {modalFormula.structure.map((step: any, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div 
                          className="w-20 text-sm font-bold text-right pt-1"
                          style={{ color: modalFormula.color }}
                        >
                          {step.time}
                        </div>
                        <div className="flex-1">
                          <span 
                            className="inline-block px-2 py-0.5 rounded text-xs mb-1"
                            style={{ 
                              backgroundColor: `${modalFormula.color}20`,
                              color: modalFormula.color
                            }}
                          >
                            {step.type}
                          </span>
                          <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                            {step.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply To & Tip */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div 
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                  >
                    <h5 className="font-bold mb-2 text-sm" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                      适用游戏类型
                    </h5>
                    <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                      {modalFormula.applyTo}
                    </p>
                  </div>
                  <div 
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: `${modalFormula.color}10` }}
                  >
                    <h5 className="font-bold mb-2 text-sm" style={{ color: modalFormula.color }}>
                      制作要点
                    </h5>
                    <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                      {modalFormula.tip}
                    </p>
                  </div>
                </div>

                {/* Generate Button */}
                <motion.button
                  onClick={() => {
                    setSelectedFormula(modalFormula.id);
                    setShowFormulaModal(false);
                    setActiveTab('cases');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-black text-lg transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${modalFormula.color}40, ${modalFormula.color}20)`,
                    border: `1px solid ${modalFormula.color}60`,
                    color: isDark ? '#ffffff' : '#1a1a2e'
                  }}
                >
                  使用这个公式生成脚本 →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 生成中弹窗 */}
      <AnimatePresence>
        {showGeneratingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="rounded-3xl border p-8 max-w-md w-full text-center"
              style={{ 
                backgroundColor: isDark ? 'rgba(20,20,30,0.98)' : 'rgba(255,255,255,0.98)',
                borderColor: selectedFormulaData?.color || '#00F0FF',
                boxShadow: `0 0 60px ${selectedFormulaData?.color || '#00F0FF'}40`
              }}
            >
              {/* 动画图标 */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-t-transparent"
                  style={{ borderColor: `${selectedFormulaData?.color || '#00F0FF'}30`, borderTopColor: selectedFormulaData?.color || '#00F0FF' }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-4 border-t-transparent"
                  style={{ borderColor: `${selectedFormulaData?.color || '#00F0FF'}20`, borderTopColor: selectedFormulaData?.color || '#00F0FF' }}
                />
                <div 
                  className="absolute inset-4 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${selectedFormulaData?.color || '#00F0FF'}20` }}
                >
                  <span>{selectedFormulaData?.icon || '✨'}</span>
                </div>
              </div>

              <h3 className="text-xl font-black mb-2" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                {generatingText}
              </h3>
              <p className="text-sm mb-6" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                基于「{selectedFormulaData?.name}」公式<br/>
                生成四个版本的脚本
              </p>

              {/* 进度条 */}
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 30, ease: "linear" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: selectedFormulaData?.color || '#00F0FF' }}
                />
              </div>
              <p className="text-xs mt-3" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                预计需要 10-30 秒
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer 
        className="relative mt-20 border-t"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}>
            创意公式工坊 · 基于广大大 2026-04-20 榜单数据 · Made by 红叶李
          </p>
        </div>
      </footer>
    </main>
  );
}

// Form Components
function FormInput({ label, value, onChange, placeholder, isDark }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; isDark: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl focus:outline-none transition-all"
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          color: isDark ? '#ffffff' : '#1a1a2e'
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

function FormTextArea({ label, value, onChange, placeholder, isDark }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; isDark: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl focus:outline-none transition-all h-24 resize-none"
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          color: isDark ? '#ffffff' : '#1a1a2e'
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
