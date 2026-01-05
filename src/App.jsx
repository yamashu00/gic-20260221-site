import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// GIC PROJECT WEEK 2026 - Website v14.11
// Update: 
// 1. Concept text updated per user request
// 2. Stories subtitle updated
// 3. Added 'url' (Column G) support with click-to-open functionality
// ==========================================

// ★重要：スプレッドシートのCSV読み込み用URL
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1sI9tnD1Gm-4z8gGRDgHvx3DU52EptKMiXxaPXxIg5OU/gviz/tq?tqx=out:csv";

// ★重要：スプレッドシートの列番号設定 (0始まり: A列=0, B列=1, C列=2...)
const COLUMN_MAP = {
  timestamp: 0, // A列
  seminar: 1,   // B列: ゼミ名
  grade: 2,     // C列: 学年
  name: 3,      // D列: 名前
  title: 4,     // E列: 発表タイトル
  content: 5,   // F列: 説明（30文字程度）
  url: 6,       // G列: リンクURL (追加)
  keywords: 7   // H列: キーワード
};

// ==========================================
// アイコンコンポーネント (Inline SVG)
// ==========================================
const ArrowRight = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const Search = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const User = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Calendar = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const MapPin = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Globe = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const ExternalLink = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>;
const X = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>;
const ChevronLeft = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRight = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const Filter = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const Check = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const Copy = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const Tag = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l5 5a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>;

// ==========================================
// コンポーネント群
// ==========================================

const Toast = ({ message, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="bg-neutral-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 min-w-[200px] justify-center border border-neutral-700">
        <div className="bg-green-500 rounded-full p-1">
          <Check size={14} strokeWidth={3} className="text-white" />
        </div>
        <p className="text-sm font-bold tracking-wide">{message}</p>
      </div>
    </div>
  );
};

const StoryCard = ({ story, onCopy, delay }) => {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef(null);
  const ignoreClickRef = useRef(false); // コピー直後のクリックを無視するためのフラグ

  const handleCopy = () => {
    const textToCopy = `【${story.title}】\nゼミ: ${story.seminar}\n発表者: ${story.name} (${story.grade})\n\n${story.content}\n\nKeywords: ${story.tags.join(', ')}\n${story.url ? `Link: ${story.url}` : ''}`;
    
    ignoreClickRef.current = true; // コピー操作としてマーク

    if (navigator.clipboard && navigator.clipboard.writeText) {
       navigator.clipboard.writeText(textToCopy).then(() => {
         onCopy(`Copied`);
       }).catch(() => fallbackCopy(textToCopy));
    } else {
       fallbackCopy(textToCopy);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      onCopy(`Copied`);
    } catch (err) {
      onCopy('Failed to copy');
    }
    document.body.removeChild(textarea);
  };

  const startPress = () => {
    ignoreClickRef.current = false;
    setIsPressed(true);
    timerRef.current = setTimeout(() => {
      handleCopy();
      if (navigator.vibrate) navigator.vibrate(50);
      setIsPressed(false);
    }, 800);
  };

  const endPress = () => {
    setIsPressed(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // リンクがある場合のクリック処理
  const handleClick = (e) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    
    // URLがあれば別タブで開く
    if (story.url) {
      // テキスト選択中の場合は遷移しない（簡単な判定）
      if (window.getSelection().toString().length > 0) return;
      window.open(story.url, '_blank');
    }
  };

  return (
    <RevealOnScroll delay={delay}>
      <div 
        className={`
          relative bg-white p-8 border border-neutral-200 shadow-sm 
          hover:border-black hover:shadow-lg transition-all duration-300 
          group h-full flex flex-col select-none rounded-sm text-neutral-800
          ${isPressed ? 'scale-[0.98] ring-2 ring-neutral-400 border-transparent bg-neutral-50' : ''}
          ${story.url ? 'cursor-pointer hover:bg-neutral-50' : 'cursor-default'}
        `}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        onTouchCancel={endPress}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onClick={handleClick}
      >
        {isPressed && (
          <div className="absolute top-0 left-0 h-1 bg-black animate-[width_800ms_linear_forwards]" style={{width: '0%'}}></div>
        )}

        {/* 1. Top Left Chip: ゼミ名 (B列) */}
        <div className="flex justify-between items-start mb-6">
          <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold tracking-widest uppercase truncate max-w-[200px]">
            {story.seminar}
          </span>
          <div className="flex space-x-2">
            {/* URLがある場合、リンクアイコンを表示 */}
            {story.url && (
              <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
            )}
            <Copy className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors" />
          </div>
        </div>

        {/* 2. Main Title: 発表タイトル (E列 - 太文字) */}
        <h4 className={`text-lg font-bold mb-4 leading-snug text-neutral-900 transition-colors ${story.url ? 'group-hover:text-blue-600 group-hover:underline' : ''}`}>
          {story.title}
        </h4>
        
        {/* 3. Description: 説明 30文字程度 (F列) - 全文表示 */}
        <p className="text-sm text-neutral-600 leading-relaxed mb-6 flex-grow whitespace-pre-wrap font-light">
          {story.content}
        </p>

        {/* 4. Tags: キーワード (H列 - ハッシュタグ) */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {story.tags.length > 0 && story.tags[0] !== "" ? (
            story.tags.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center text-[10px] bg-neutral-50 text-neutral-500 border border-neutral-100 px-2 py-1 rounded-sm">
                <Tag className="w-2 h-2 mr-1 opacity-50" />
                {tag.replace('#', '')}
              </span>
            ))
          ) : null}
        </div>

        {/* 5. Footer: 名前 (D列) */}
        <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center justify-between">
          <div className="flex items-center text-xs font-bold text-neutral-800">
            <User className="w-3 h-3 mr-1.5 text-neutral-400" />
            {story.name}
            {/* 学年(C列)も名前の横に小さく表示 */}
            <span className="ml-2 font-normal text-neutral-400">
              {story.grade}
            </span>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
};

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ==========================================
// メインアプリ
// ==========================================
const App = () => {
  const [scrolled, setScrolled] = useState(false);
  
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectSelectedCategory, setProjectSelectedCategory] = useState('All');
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [displayProjects, setDisplayProjects] = useState([]);
  
  const [storySearchTerm, setStorySearchTerm] = useState('');
  const [storySelectedSeminar, setStorySelectedSeminar] = useState('All');
  const [storyCurrentPage, setStoryCurrentPage] = useState(1);
  const [storySeminars, setStorySeminars] = useState(['All']);
  
  const [storiesData, setStoriesData] = useState([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);

  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const projectItemsPerPage = 6;
  const storyItemsPerPage = 9;

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Projects Data (Static)
  const allProjectsData = [
    { title: "地域資源の価値を最大化するために、コミュニティと人材はどのように連携できるか？", category: "QWS: リソース・リボーン", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/resourcereborn", tags: ["#地域創生", "#コミュニティ", "#人的資本"] },
    { title: "デザインが顧客の性格を理解し、今の自分とは違う別の性格への変身を導くためには", category: "QWS: MBTI X DESIGN", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/mbtixdesign", tags: ["#性格診断", "#デザイン思考", "#自己変容"] },
    { title: "どうしたら中高生の物語を未来の価値として紡いでいけるか？", category: "QWS: 村人A", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/murabitoa", tags: ["#ナラティブ", "#未来価値", "#当事者意識"] },
    { title: "思春期の概念を崩す親子のコミュニケーションとは？", category: "QWS: 親子カルタ", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/oyakokaruta", tags: ["#家族関係", "#対話", "#ゲームデザイン"] },
    { title: "サブカルチャーを通して、言葉にできない感情を言葉にするためにはどうしたら良いのか？", category: "QWS: 情熱に満ちた子供達", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/jounetsunimichitakodomotachi", tags: ["#サブカルチャー", "#感情表現", "#言語化"] },
    { title: "衰退する日本文化に新たなニーズを確立させることはできるのか？", category: "QWS: てらす aroma", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/terasuaromaproject", tags: ["#伝統文化", "#香り", "#新市場開拓"] },
    { title: "江戸東京野菜は東京の新しいグルメブランドになるのか？", category: "QWS: Soullume Project", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/soullumeproject", tags: ["#食文化", "#ブランディング", "#地産地消"] },
    { title: "意識高い系を誇れる社会をつくるには？", category: "QWS: 明日、福プロジェクト", author: "QWS Challenge Team", link: "https://shibuya-qws.com/project/asu-fuku", tags: ["#社会課題", "#マインドセット", "#行動変容"] },
    { title: "【国際交流】行知学園との交流イベントレポート～言葉の壁を越えて、未来を語り合う一日に～", category: "Global", author: "International Team", link: "https://www.seigakuin.ed.jp/news/n57351/", tags: ["#国際交流", "#異文化理解", "#対話"] },
    { title: "STEAMとは…浪漫（ロマン）の探究学習である～空間デザイン作品共有会とSTEAMキックオフ〜", category: "STEAM", author: "STEAM Project", link: "https://www.seigakuin.ed.jp/news/n56362/", tags: ["#空間デザイン", "#アート思考", "#ロマン"] },
    { title: "マイナビキャリア甲子園 Innovation部門、優勝！！", category: "Award", author: "Contest Team", link: "https://www.seigakuin.ed.jp/news/n56164/", tags: ["#キャリア甲子園", "#優勝", "#ビジネスプラン"] },
    { title: "【高校GIC】Project Week最終発表会 in SHIBUYA QWS", category: "Event", author: "GIC Student", link: "https://www.seigakuin.ed.jp/news/n56091/", tags: ["#最終発表", "#QWS", "#社会実装"] },
    { title: "スロバキア・Galileo SchoolとのSTEAM交流会を実施", category: "Global / STEAM", author: "International Team", link: "https://www.seigakuin.ed.jp/news/n55941/", tags: ["#スロバキア", "#STEAM交流", "#英語"] },
    { title: "東京音楽大学が新学科新設に向けて高校生と意見交換会を実施", category: "Collaboration", author: "Music & Art", link: "https://www.seigakuin.ed.jp/news/n55937/", tags: ["#高大連携", "#音楽", "#意見交換"] },
    { title: "東京大学英語弁論大会「東大杯」で、本校生徒が優勝しました！", category: "Award", author: "English Dept", link: "https://www.seigakuin.ed.jp/news/n55901/", tags: ["#英語弁論", "#優勝", "#スピーチ"] },
    { title: "マイナビキャリア甲子園準決勝突破、決勝進出へ！", category: "Award", author: "Contest Team", link: "https://www.seigakuin.ed.jp/news/n55866/", tags: ["#キャリア甲子園", "#プレゼン", "#挑戦"] },
    { title: "「日本図学会第一回高校生デジタルモデリングコンテスト」審査委員長賞を受賞！", category: "STEAM / Award", author: "STEAM Project", link: "https://www.seigakuin.ed.jp/news/n55421/", tags: ["#3Dモデリング", "#デジタル工作", "#受賞"] },
    { title: "STEAM ワコムオフィスで作品展示&社員の方々と対話会", category: "STEAM", author: "Art Team", link: "https://www.seigakuin.ed.jp/news/n55391/", tags: ["#Wacom", "#企業連携", "#デジタルアート"] },
    { title: "宗教文化ゼミ OMFインターナショナルを訪問、ミャンマーの課題を見つめる", category: "Social / Global", author: "Social Seminar", link: "https://www.seigakuin.ed.jp/news/n55178/", tags: ["#国際協力", "#ミャンマー", "#宗教文化"] },
    { title: "Project Week中間発表会を行いました", category: "Event", author: "GIC Student", link: "https://www.seigakuin.ed.jp/news/n55064/", tags: ["#中間発表", "#プロセス", "#フィードバック"] },
    { title: "貧困vs.起業ゼミとコラボ、(株)ガイアックス特別授業", category: "Entrepreneurship", author: "Business Seminar", link: "https://www.seigakuin.ed.jp/news/n54449/", tags: ["#起業家精神", "#特別授業", "#ガイアックス"] },
    { title: "武蔵野美大の新井恒陽さんによる特別授業", category: "Art / STEAM", author: "Art Seminar", link: "https://www.seigakuin.ed.jp/news/n54346/", tags: ["#美術教育", "#デザイン", "#特別講義"] },
    { title: "Projectに新しいゼミが誕生！", category: "News", author: "GIC Staff", link: "https://www.seigakuin.ed.jp/news/n54275/", tags: ["#新ゼミ", "#探究活動", "#多様性"] },
    { title: "Project「貧困vs.起業ゼミ」のレゴ®ワーク", category: "Entrepreneurship", author: "Business Seminar", link: "https://www.seigakuin.ed.jp/news/n54176/", tags: ["#レゴシリアスプレイ", "#抽象化", "#対話"] },
    { title: "STEAM・卵テンペラ絵具をつくる", category: "STEAM", author: "Art Seminar", link: "https://www.seigakuin.ed.jp/news/n54103/", tags: ["#古典技法", "#化学", "#美術"] },
    { title: "正解のないことを楽しむ～空間デザイン作品共有会～", category: "STEAM", author: "Design Team", link: "https://www.seigakuin.ed.jp/news/n53800/", tags: ["#空間デザイン", "#共有会", "#創造性"] },
    { title: "GICの集大成、Project Week最終発表会", category: "Event", author: "GIC Student", link: "https://www.seigakuin.ed.jp/news/n53990/", tags: ["#集大成", "#プレゼンテーション", "#成果"] },
    { title: "コネクテッド・インク東京2023に参加", category: "Event / STEAM", author: "STEAM Project", link: "https://www.seigakuin.ed.jp/news/n53322/", tags: ["#ConnectedInk", "#テクノロジー", "#アート"] },
    { title: "サイエンスアゴラ2023に出展しました", category: "Science", author: "Science Team", link: "https://www.seigakuin.ed.jp/news/n53150/", tags: ["#科学コミュニケーション", "#サイエンスアゴラ", "#出展"] },
    { title: "哲学－メディア－藝術ゼミでの哲学対話", category: "Philosophy", author: "Philosophy Seminar", link: "https://www.seigakuin.ed.jp/news/n52679/", tags: ["#哲学対話", "#メディア", "#思考力"] },
    { title: "高１・２年生による『Project Week』中間発表会", category: "Event", author: "GIC Student", link: "https://www.seigakuin.ed.jp/news/n52408/", tags: ["#中間発表", "#ポスターセッション", "#相互評価"] },
    { title: "「高校生映像アワード」全国決勝進出！（日本テレビ放送）", category: "Award", author: "Media Team", link: "https://www.seigakuin.ed.jp/news/n49631/", tags: ["#映像制作", "#全国大会", "#メディア"] },
    { title: "ブルシット・ジョブとエッセンシャルワークの価値の転倒を見つめ、因果関係を解決する", category: "Social", author: "Social Seminar", link: "https://www.seigakuin.ed.jp/news/n49500/", tags: ["#労働論", "#社会構造", "#探究"] },
    { title: "卵テンペラを体験しArt Design", category: "Art / STEAM", author: "Art Seminar", link: "https://www.seigakuin.ed.jp/news/n48861/", tags: ["#素材研究", "#アート体験", "#STEAM"] },
    { title: "『五感を使った空間デザイン』展示会", category: "STEAM", author: "Design Team", link: "https://www.seigakuin.ed.jp/news/n48535/", tags: ["#五感", "#空間演出", "#展示"] },
    { title: "本校生徒が北区志茂四丁目にて「オンライン防災訓練」を開催", category: "Social / Local", author: "Disaster Prevention", link: "https://www.seigakuin.ed.jp/news/n48332/", tags: ["#地域連携", "#防災", "#ICT活用"] },
    { title: "サーキュラー・エコノミー講演会、中石先生をお迎えして", category: "Social / Eco", author: "Eco Project", link: "https://www.seigakuin.ed.jp/news/n47474/", tags: ["#循環型経済", "#SDGs", "#講演会"] },
    { title: "「感情の森 音楽の教室」とのコラボレーション", category: "Art / Music", author: "Music Project", link: "https://www.seigakuin.ed.jp/news/n47422/", tags: ["#音楽", "#感情表現", "#ワークショップ"] },
    { title: "東京大学生産技術研究所と一緒にマイクロプラスチック問題をデザイン", category: "Science / Eco", author: "Science Team", link: "https://www.seigakuin.ed.jp/news/n46843/", tags: ["#環境問題", "#デザイン思考", "#東大連携"] },
    { title: "サステナブルタウンをデザインする", category: "Social / Design", author: "Design Team", link: "https://www.seigakuin.ed.jp/news/n46773/", tags: ["#まちづくり", "#持続可能性", "#都市デザイン"] }
  ];

  // CSV Parsing Logic
  const parseCSV = (text) => {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < normalizedText.length; i++) {
      const char = normalizedText[i];
      const nextChar = normalizedText[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++; 
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
    }

    return rows.slice(1).map((row, index) => {
      if (row.length < 2) return null;
      
      const getCol = (idx) => row[idx] ? row[idx].trim() : "";

      const seminar = getCol(COLUMN_MAP.seminar) || "未分類";
      const grade = getCol(COLUMN_MAP.grade);
      const name = getCol(COLUMN_MAP.name) || "Anonymous";
      const title = getCol(COLUMN_MAP.title) || "(No Title)";
      const content = getCol(COLUMN_MAP.content);
      const url = getCol(COLUMN_MAP.url); // URL取得
      const keywordsRaw = getCol(COLUMN_MAP.keywords);
      
      const tags = keywordsRaw 
        ? keywordsRaw.split(/[,、\s]+/).filter(t => t).map(t => t.startsWith('#') ? t : `#${t}`)
        : [];

      const dateRaw = getCol(COLUMN_MAP.timestamp);
      const date = dateRaw.split(' ')[0];

      if (!title && !content) return null;

      return {
        id: `csv-${index}`,
        seminar,
        grade,
        title,
        name,
        content,
        url,
        date,
        tags
      };
    }).filter(item => item !== null);
  };

  // Data Fetching
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        if (text.trim().startsWith("<!DOCTYPE html>")) {
           console.error("Failed to fetch CSV");
           setIsLoadingStories(false);
           return;
        }
        const parsedData = parseCSV(text);
        if (parsedData.length > 0) {
          const seminars = ['All', ...new Set(parsedData.map(item => item.seminar))];
          setStorySeminars(seminars);
          setStoriesData(shuffleArray(parsedData)); 
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingStories(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    setDisplayProjects(shuffleArray(allProjectsData));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtering Logic
  const filteredProjects = displayProjects.filter(project => {
    const categoryMatch = projectSelectedCategory === 'All' || project.category.includes(projectSelectedCategory);
    const searchLower = projectSearchTerm.toLowerCase();
    const searchMatch = project.title.toLowerCase().includes(searchLower) ||
                       project.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    return categoryMatch && searchMatch;
  });
  const currentProjects = filteredProjects.slice((projectCurrentPage - 1) * projectItemsPerPage, projectCurrentPage * projectItemsPerPage);
  const projectTotalPages = Math.ceil(filteredProjects.length / projectItemsPerPage);

  const filteredStories = storiesData.filter(story => {
    const seminarMatch = storySelectedSeminar === 'All' || story.seminar === storySelectedSeminar;
    const searchLower = storySearchTerm.toLowerCase();
    const searchMatch = (story.title && story.title.toLowerCase().includes(searchLower)) ||
                        (story.content && story.content.toLowerCase().includes(searchLower)) ||
                        (story.name && story.name.toLowerCase().includes(searchLower));
    return seminarMatch && searchMatch;
  });
  const currentStories = filteredStories.slice((storyCurrentPage - 1) * storyItemsPerPage, storyCurrentPage * storyItemsPerPage);
  const storyTotalPages = Math.ceil(filteredStories.length / storyItemsPerPage);

  useEffect(() => { setProjectCurrentPage(1); }, [projectSearchTerm, projectSelectedCategory]);
  useEffect(() => { setStoryCurrentPage(1); }, [storySearchTerm, storySelectedSeminar]);

  const handleTagClick = (tag, e, sectionId) => {
    e.preventDefault();
    const term = tag.replace('#', '');
    if (sectionId === 'projects-library') {
      setProjectSearchTerm(term);
    } else {
      setStorySearchTerm(term);
    }
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const section = document.getElementById('projects-library');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      <Toast message={toastMsg} isVisible={showToast} />

      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-neutral-800 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold tracking-tighter text-white">
            GIC <span className="font-light text-neutral-400">PROJECT WEEK</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">CONCEPT</a>
            <a href="#stories" className="hover:text-white transition-colors">STORIES</a>
            <a href="#projects-library" className="hover:text-white transition-colors">PROJECTS</a>
            <a href="https://forms.gle/JoQsZCWCibyCp4zx8" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-5 py-2 rounded-sm hover:bg-neutral-200 transition-colors">
              参加申し込み
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60">
            <source src="/hero-movie.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full pt-20 relative z-10">
          <RevealOnScroll>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8">
                <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest bg-white text-black uppercase">
                  Seigakuin Global Innovation Class
                </span>
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-white drop-shadow-lg">
                  PROJECT<br />WEEK <span className="text-neutral-400">2026</span>
                </h1>
                <p className="text-lg md:text-xl text-neutral-200 max-w-2xl leading-relaxed font-medium drop-shadow-md">
                  ものづくり・ことづくりを通して、<br className="md:hidden"/>
                  世界に貢献する人材へ。<br />
                  <span className="text-neutral-400 font-normal text-base mt-2 block">
                    教わるのではなく、自ら創り出す。<br/>聖学院GICが送る、挑戦と創造の祭典。
                  </span>
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col items-start lg:items-end space-y-6 text-white">
                <div className="text-right border-l-2 border-white pl-4 lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-4">
                  <div className="flex items-center justify-end space-x-2 text-neutral-300 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-mono text-sm">2026.02.21 (SAT) 13:00-17:00</span>
                  </div>
                  <div className="flex items-center justify-end space-x-2 text-neutral-300">
                    <MapPin className="w-4 h-4" />
                    <span className="font-mono text-sm">SHIBUYA QWS</span>
                  </div>
                </div>
                <button onClick={scrollToProjects} className="w-full md:w-auto bg-white text-black px-8 py-4 flex items-center justify-between group hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300">
                  <span className="mr-6 font-bold tracking-widest text-sm">VIEW EXHIBITION</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
        <div className="absolute bottom-8 left-6 md:left-1/2 md:-translate-x-1/2 flex items-center space-x-4 animate-bounce z-10">
          <div className="h-[1px] w-12 bg-neutral-500"></div>
          <span className="text-xs tracking-widest text-neutral-400">SCROLL DOWN</span>
        </div>
      </header>

      {/* Concept */}
      <section className="py-32 bg-black text-white relative border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3">
                <h2 className="text-sm font-bold tracking-[0.2em] text-neutral-500 mb-2">OUR PHILOSOPHY</h2>
                <div className="h-[1px] w-12 bg-white mb-8"></div>
                <p className="text-3xl font-bold leading-tight mb-6 text-white">
                  私たちは、<br/>新しい時代を<br/>創っていきます。
                </p>
                <p className="text-neutral-500 text-sm">Only One for Others</p>
              </div>
              <div className="lg:w-2/3 space-y-8 text-neutral-400 leading-relaxed text-justify font-light tracking-wide">
                <p>
                  グローバルイノベーションクラス（GIC）は、聖学院の理念を真に具現化することを目的に新設されました。
                  世界的な課題に自分ごととして取り組み、“ものづくり・ことづくり”を通して、
                  他者や世界に貢献できる人材の育成を目指しています。
                </p>
                <div className="bg-neutral-900 p-8 border-l-2 border-neutral-700 my-8">
                  <p className="mb-4">このGICでは、「やってみる」ことを大切にしており、その経験を共有することで、暗黙知のままになっていたことや言語化されていないことを、より意識的なものに進化させるきっかけにしたいと考えています。</p>
                  <p>つきましては、ここまでの「途中経過」を報告させていただきたく、発表の機会を設けさせていただきました。今回の展示では、これら4つの独自科目の成果を展示することで、日々の学びの様子をご覧いただけたらと考えています。</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Stories */}
      <section id="stories" className="py-24 bg-white text-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-neutral-100 pb-6">
              <div>
                <span className="text-xs font-bold text-neutral-400 tracking-widest block mb-2">BEHIND THE SCENES</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Stories</h2>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-neutral-500">
                生徒・教員の挑戦と創造
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="bg-neutral-50 p-6 rounded-sm mb-12 border border-neutral-200">
              <div className="flex items-center mb-4 text-xs font-bold text-neutral-500 tracking-widest">
                <Filter className="w-3 h-3 mr-2" />
                SEARCH FILTER
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-neutral-400 mb-1">ゼミ (Seminar)</label>
                  <div className="relative">
                    <select value={storySelectedSeminar} onChange={(e) => setStorySelectedSeminar(e.target.value)} className="w-full appearance-none bg-white border border-neutral-200 text-neutral-700 py-3 px-4 pr-8 rounded-sm leading-tight focus:outline-none focus:border-black focus:bg-white transition-colors">
                      {storySeminars.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                  </div>
                </div>
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-neutral-400 mb-1">キーワード (Keyword)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="タイトル、名前、キーワードで検索..." value={storySearchTerm} onChange={(e) => setStorySearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-colors" />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button onClick={() => { setStorySearchTerm(''); setStorySelectedSeminar('All'); }} className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 font-bold py-3 px-4 rounded-sm transition-colors text-sm flex items-center justify-center">
                    <X className="w-4 h-4 mr-1" /> Clear
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center text-xs text-neutral-400">
                 <div>Found <span className="text-black font-bold">{filteredStories.length}</span> items</div>
                 <div><span className="text-neutral-400 mr-2">Sync:</span><span className="font-bold text-black">Google Sheets</span></div>
              </div>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[500px]">
            {isLoadingStories ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-400">
                <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mb-4"></div>
                <p className="text-sm">Loading data from spreadsheet...</p>
              </div>
            ) : currentStories.length > 0 ? (
              currentStories.map((story, index) => (
                <StoryCard key={story.id} story={story} onCopy={triggerToast} delay={index * 50} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-neutral-400 py-12">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>No stories found matching your criteria.</p>
                <p className="text-xs mt-2">スプレッドシートにデータを入力してください</p>
              </div>
            )}
          </div>

          {/* Stories Pagination (簡易実装) */}
          {storyTotalPages > 1 && (
            <div className="mt-16 flex justify-center items-center space-x-2">
              <button onClick={() => setStoryCurrentPage(prev => Math.max(prev - 1, 1))} disabled={storyCurrentPage === 1} className="p-2 border border-neutral-200 rounded-sm hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm px-4">Page {storyCurrentPage} of {storyTotalPages}</span>
              <button onClick={() => setStoryCurrentPage(prev => Math.min(prev + 1, storyTotalPages))} disabled={storyCurrentPage === storyTotalPages} className="p-2 border border-neutral-200 rounded-sm hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </section>

      {/* Projects Library */}
      <section id="projects-library" className="py-24 bg-neutral-50 text-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">GIC Projects Library</h2>
                <p className="text-neutral-500 text-sm">Projects Archive</p>
              </div>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={100}>
            <div className="bg-white p-6 rounded-sm shadow-sm border border-neutral-100 mb-12">
               <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                     <input type="text" placeholder="キーワード、タグ、テーマで検索..." value={projectSearchTerm} onChange={(e)=>setProjectSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-colors" />
                     {projectSearchTerm && <button onClick={()=>setProjectSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"><X className="w-4 h-4" /></button>}
                  </div>
                  <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
                     {['All', 'STEAM', 'QWS', 'Global', 'Entrepreneurship', 'Award'].map((cat, i) => (
                        <button key={i} onClick={()=>setProjectSelectedCategory(cat)} className={`px-4 py-3 rounded-sm text-xs font-bold tracking-wider transition-all whitespace-nowrap ${projectSelectedCategory===cat ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'}`}>{cat}</button>
                     ))}
                  </div>
               </div>
               <div className="mt-4 text-xs text-neutral-400 text-right">Showing {filteredProjects.length} results</div>
            </div>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
             {currentProjects.length > 0 ? (
                currentProjects.map((project, index) => (
                   <RevealOnScroll key={index} delay={index * 50}>
                     <a href={project.link} target="_blank" rel="noopener noreferrer" className="block bg-white p-8 border border-neutral-100 hover:border-black hover:shadow-lg transition-all duration-300 group h-full flex flex-col hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-6">
                           <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold tracking-widest uppercase truncate max-w-[200px]">{project.category}</span>
                           <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0" />
                        </div>
                        <h4 className="text-lg font-bold mb-4 group-hover:underline decoration-1 underline-offset-4 leading-tight flex-grow line-clamp-3">{project.title}</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                           {project.tags && project.tags.map((tag, i) => (
                              <span key={i} onClick={(e)=>handleTagClick(tag, e, 'projects-library')} className="text-[10px] text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm whitespace-nowrap hover:bg-neutral-200 hover:text-black transition-colors cursor-pointer">{tag}</span>
                           ))}
                        </div>
                        <div className="pt-4 border-t border-neutral-50 mt-auto">
                           <p className="text-xs text-neutral-400 flex items-center"><User className="w-3 h-3 mr-1" /> {project.author}</p>
                        </div>
                     </a>
                   </RevealOnScroll>
                ))
             ) : (
                <div className="col-span-full flex flex-col items-center justify-center text-neutral-400 py-12">
                   <Search className="w-12 h-12 mb-4 opacity-20" />
                   <p>No projects found matching your criteria.</p>
                   <button onClick={()=>{setProjectSearchTerm(''); setProjectSelectedCategory('All');}} className="mt-4 text-black underline text-sm">Clear filters</button>
                </div>
             )}
          </div>
          
          {projectTotalPages > 1 && (
             <div className="mt-16 flex justify-center items-center space-x-2">
                <button onClick={()=>handleProjectPageChange(projectCurrentPage-1)} disabled={projectCurrentPage===1} className="p-2 border border-neutral-200 rounded-sm hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm px-4">Page {projectCurrentPage} of {projectTotalPages}</span>
                <button onClick={()=>handleProjectPageChange(projectCurrentPage+1)} disabled={projectCurrentPage===projectTotalPages} className="p-2 border border-neutral-200 rounded-sm hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"><ChevronRight className="w-4 h-4" /></button>
             </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 border-b border-neutral-800 pb-12 mb-12">
            <div className="md:col-span-5">
              <h2 className="text-3xl font-bold tracking-tighter mb-6">GIC PROJECT WEEK 2026</h2>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                聖学院高等学校 Global Innovation Class<br/>
                〒114-8502 東京都北区中里3-12-1<br/>
                <br/>
                本サイトは、2026年 GICプロジェクトウィークの<br/>
                活動記録および成果発表のために制作されました。
              </p>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-6 text-xs tracking-widest text-neutral-500">CONTENTS</h3>
                <ul className="space-y-4 text-sm text-neutral-300">
                  <li><a href="#" className="hover:text-white transition-colors">Concept</a></li>
                  <li><a href="#stories" className="hover:text-white transition-colors">Stories</a></li>
                  <li><a href="#projects-library" className="hover:text-white transition-colors">Projects</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-6 text-xs tracking-widest text-neutral-500">LINKS</h3>
                <ul className="space-y-4 text-sm text-neutral-300">
                  <li><a href="https://www.seigakuin.ed.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">聖学院中学校・高等学校</a></li>
                  <li><a href="https://seig-edu.note.jp/m/mb19ca994d438" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GIC Note公式</a></li>
                </ul>
              </div>
              <div>
                 <h3 className="font-bold mb-6 text-xs tracking-widest text-neutral-500">FOLLOW US</h3>
                 <div className="flex space-x-4">
                    <Globe className="w-5 h-5 text-neutral-300 hover:text-white cursor-pointer" />
                 </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
            <p>© 2026 Seigakuin High School GIC. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed for Inquiry & Innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;