import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Hash, User, Calendar, MapPin, Globe, ExternalLink, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

// ==========================================
// GIC PROJECT WEEK 2026 - Website v10
// ==========================================

// ★重要：スプレッドシートのCSV読み込み用URL
// 共有いただいた「Webに公開」用URLを設定しました。
// フォームの回答が自動的に反映されます。
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmS_u6N9LLsm4WTTZtHUIS4QeVhyKNqFG9-ZUfiUhW-6J4Q18sOc1ZCB-tx63mcAyDAatM7EWJo7PO/pub?gid=1938097291&single=true&output=csv"; 

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Projects Library State
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectSelectedCategory, setProjectSelectedCategory] = useState('All');
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [displayProjects, setDisplayProjects] = useState([]);
  
  // Stories Search State
  const [storySearchTerm, setStorySearchTerm] = useState('');
  const [storySelectedSeminar, setStorySelectedSeminar] = useState('All');
  const [storySelectedGrade, setStorySelectedGrade] = useState('All');
  const [storyCurrentPage, setStoryCurrentPage] = useState(1);
  
  // Stories Data State
  const [storiesData, setStoriesData] = useState([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);

  const projectItemsPerPage = 6;
  const storyItemsPerPage = 9;

  // --- 初期ダミーデータ (データ取得までのつなぎ) ---
  const initialStoriesData = [
    { id: 1, seminar: "新ゼミ", grade: "2年", name: "青木", theme: "カードカウティン２", description: "既存の枠組みを超えた新しいカードゲームの提案と実践。", image: "bg-neutral-800", tags: ["#ゲーム", "#開発", "#遊び"] },
    { id: 13, seminar: "貧困vs.起業ゼミ", grade: "2年", name: "大橋", theme: "異なる豊かさの融合がもたらすもの", description: "経済的指標だけではない、精神的・文化的な「豊かさ」の定義と共存。", image: "bg-neutral-300", tags: ["#ウェルビーイング", "#経済", "#価値観"] },
  ];

  // プロジェクトライブラリの固定データ
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

  // --- CSV Parser (カンマ区切り対応) ---
  const parseCSV = (text) => {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;
    
    // 改行コードの正規化
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

    // Googleフォーム(CSV)の列構成に合わせてマッピング
    // 0:タイムスタンプ, 1:ゼミ名, 2:学年, 3:名前, 4:発表タイトル, 5:説明(短), 6:説明(長), 7:キーワード
    return rows.slice(1).map((row, index) => {
      // 必須項目（ゼミ名）がない行はスキップ
      if (!row[1]) return null;

      const seminar = row[1];
      
      // ゼミ名に応じた背景色
      let bgClass = "bg-neutral-200";
      if (seminar.includes("新ゼミ")) bgClass = "bg-neutral-800";
      else if (seminar.includes("貧困")) bgClass = "bg-neutral-300";
      else if (seminar.includes("宗教")) bgClass = "bg-neutral-400";
      else if (seminar.includes("哲学")) bgClass = "bg-neutral-500";
      else if (seminar.includes("生活")) bgClass = "bg-neutral-600";

      return {
        id: `csv-${index}`,
        seminar: seminar,
        grade: row[2] || "",
        name: row[3] || "匿名",
        theme: row[4] || "無題",
        description: row[5] || "", 
        image: bgClass,
        tags: row[7] ? row[7].split('、').map(t => `#${t.trim()}`) : ["#探究"]
      };
    }).filter(item => item !== null);
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchStories = async () => {
      if (!GOOGLE_SHEET_CSV_URL) {
        setStoriesData(initialStoriesData);
        setIsLoadingStories(false);
        return;
      }

      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
          console.warn('Network response was not ok, using initial data');
          setStoriesData(initialStoriesData);
          return;
        }
        const text = await response.text();
        // 読み込んだテキストがHTML（ログイン画面など）でないか簡易チェック
        if (text.trim().startsWith("<!DOCTYPE html>")) {
           console.warn("Got HTML instead of CSV. Check permission.");
           setStoriesData(initialStoriesData);
           return;
        }

        const parsedData = parseCSV(text);
        
        if (parsedData.length > 0) {
          setStoriesData(parsedData);
        } else {
          setStoriesData(initialStoriesData);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStoriesData(initialStoriesData);
      } finally {
        setIsLoadingStories(false);
      }
    };

    fetchStories();
  }, []);

  // --- Shuffle Projects (Initial Load) ---
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    setDisplayProjects(shuffleArray(allProjectsData));
  }, []);

  // --- Filtering & Pagination Logic ---
  // Projects
  const filteredProjects = displayProjects.filter(project => {
    const categoryMatch = projectSelectedCategory === 'All' || project.category.includes(projectSelectedCategory);
    const searchLower = projectSearchTerm.toLowerCase();
    const searchMatch = project.title.toLowerCase().includes(searchLower) ||
                       project.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
                       project.author.toLowerCase().includes(searchLower) ||
                       project.category.toLowerCase().includes(searchLower);
    return categoryMatch && searchMatch;
  });
  const currentProjects = filteredProjects.slice((projectCurrentPage - 1) * projectItemsPerPage, projectCurrentPage * projectItemsPerPage);
  const projectTotalPages = Math.ceil(filteredProjects.length / projectItemsPerPage);

  // Stories
  const filteredStories = storiesData.filter(story => {
    const seminarMatch = storySelectedSeminar === 'All' || story.seminar === storySelectedSeminar;
    const gradeMatch = storySelectedGrade === 'All' || story.grade === storySelectedGrade;
    const searchLower = storySearchTerm.toLowerCase();
    const searchMatch = (story.theme && story.theme.toLowerCase().includes(searchLower)) ||
                        (story.description && story.description.toLowerCase().includes(searchLower)) ||
                        (story.tags && story.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
                        (story.name && story.name.toLowerCase().includes(searchLower));
    return seminarMatch && gradeMatch && searchMatch;
  });
  const currentStories = filteredStories.slice((storyCurrentPage - 1) * storyItemsPerPage, storyCurrentPage * storyItemsPerPage);
  const storyTotalPages = Math.ceil(filteredStories.length / storyItemsPerPage);

  // Reset pagination on filter change
  useEffect(() => { setProjectCurrentPage(1); }, [projectSearchTerm, projectSelectedCategory]);
  useEffect(() => { setStoryCurrentPage(1); }, [storySearchTerm, storySelectedSeminar, storySelectedGrade]);

  // Handlers
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

  const handleProjectPageChange = (page) => {
    setProjectCurrentPage(page);
    const librarySection = document.getElementById('projects-library');
    if (librarySection) librarySection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProjectTagClick = (tag, e) => {
    e.preventDefault();
    setProjectSearchTerm(tag.replace('#', ''));
    const librarySection = document.getElementById('projects-library');
    if (librarySection) librarySection.scrollIntoView({ behavior: 'smooth' });
  };

  const seminarOptions = ['All', '新ゼミ', '貧困vs.起業ゼミ', '宗教・文化ゼミ', '哲学-メディア-藝術ゼミ', '生活環境ゼミ'];
  const gradeOptions = ['All', '1年', '2年', '3年'];

  // Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-neutral-100 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold tracking-tighter">
            GIC <span className="font-light">PROJECT WEEK</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide text-neutral-600">
            <a href="#" className="hover:text-black transition-colors">CONCEPT</a>
            <a href="#stories" className="hover:text-black transition-colors">STORIES</a>
            <a href="#projects-library" className="hover:text-black transition-colors">PROJECTS</a>
            <a href="https://forms.gle/JoQsZCWCibyCp4zx8" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-5 py-2 rounded-sm hover:bg-neutral-800 transition-colors">
              参加申し込み
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-neutral-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[50vw] h-full bg-white skew-x-12 translate-x-1/4"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 border border-neutral-200 rounded-full opacity-50"></div>
          <div className="absolute top-40 right-40 w-96 h-96 border border-neutral-200 rounded-full opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full pt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest bg-black text-white uppercase">
                Seigakuin Global Innovation Class
              </span>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
                PROJECT<br />
                WEEK <span className="text-neutral-400">2026</span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed font-medium">
                ものづくり・ことづくりを通して、<br className="md:hidden"/>
                世界に貢献する人材へ。<br />
                <span className="text-neutral-400 font-normal text-base mt-2 block">
                  教わるのではなく、自ら創り出す。<br/>聖学院GICが送る、挑戦と創造の祭典。
                </span>
              </p>
            </div>
            
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end space-y-6">
              <div className="text-right border-l-2 border-black pl-4 lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-4">
                <div className="flex items-center justify-end space-x-2 text-neutral-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-mono text-sm">2026.02.21 (SAT) 13:00-17:00</span>
                </div>
                <div className="flex items-center justify-end space-x-2 text-neutral-500">
                  <MapPin className="w-4 h-4" />
                  <span className="font-mono text-sm">SHIBUYA QWS</span>
                </div>
              </div>
              
              <button className="w-full md:w-auto bg-black text-white px-8 py-4 flex items-center justify-between group hover:bg-neutral-800 transition-all">
                <span className="mr-6 font-bold tracking-widest text-sm">VIEW EXHIBITION</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-6 md:left-1/2 md:-translate-x-1/2 flex items-center space-x-4">
          <div className="h-[1px] w-12 bg-neutral-300"></div>
          <span className="text-xs tracking-widest text-neutral-400">SCROLL DOWN</span>
        </div>
      </header>

      {/* Concept Section */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-sm font-bold tracking-[0.2em] text-neutral-400 mb-2">OUR PHILOSOPHY</h2>
              <div className="h-[1px] w-12 bg-white mb-8"></div>
              <p className="text-3xl font-bold leading-tight mb-6">
                私たちは、<br/>
                新しい時代を<br/>
                創っていきます。
              </p>
              <p className="text-neutral-400 text-sm">
                 Only One for Others
              </p>
            </div>
            
            <div className="lg:w-2/3 space-y-8 text-neutral-300 leading-relaxed text-justify font-light tracking-wide">
              <p>
                グローバルイノベーションクラス（GIC）は、聖学院の理念を真に具現化することを目的に新設されました。
                世界的な課題に自分ごととして取り組み、“ものづくり・ことづくり”を通して、
                他者や世界に貢献できる人材の育成を目指しています。
              </p>
              
              <div className="bg-neutral-900 p-8 border-l-2 border-white my-8">
                <p className="mb-4">
                  このGICでは、4つの独自科目を軸に「やってみる」ことを大切にしており、その経験を共有することで、
                  暗黙知のままになっていたことや言語化されていないことを、より意識的なものに進化させるきっかけにしたいと考えています。
                </p>
                <p>
                  つきましては、ここまでの「途中経過」を報告させていただきたく、発表の機会を設けさせていただきました。
                  今回の展示では、これら4つの独自科目の成果を展示することで、
                  新しい探究の学びの様子をご覧いただけたらと考えています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process/Stories Section */}
      <section id="stories" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-neutral-100 pb-6">
            <div>
              <span className="text-xs font-bold text-neutral-400 tracking-widest block mb-2">BEHIND THE SCENES</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Stories</h2>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-neutral-500">
              生徒70名の探究プロセス
            </div>
          </div>

          {/* Stories Filter Bar */}
          <div className="bg-neutral-50 p-6 rounded-sm mb-12 border border-neutral-200">
            <div className="flex items-center mb-4 text-xs font-bold text-neutral-500 tracking-widest">
              <Filter className="w-3 h-3 mr-2" />
              SEARCH FILTER
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-neutral-400 mb-1">ゼミ (Seminar)</label>
                <div className="relative">
                  <select 
                    value={storySelectedSeminar}
                    onChange={(e) => setStorySelectedSeminar(e.target.value)}
                    className="w-full appearance-none bg-white border border-neutral-200 text-neutral-700 py-3 px-4 pr-8 rounded-sm leading-tight focus:outline-none focus:border-black focus:bg-white transition-colors"
                  >
                    {seminarOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-400 mb-1">学年 (Grade)</label>
                <div className="relative">
                  <select 
                    value={storySelectedGrade}
                    onChange={(e) => setStorySelectedGrade(e.target.value)}
                    className="w-full appearance-none bg-white border border-neutral-200 text-neutral-700 py-3 px-4 pr-8 rounded-sm leading-tight focus:outline-none focus:border-black focus:bg-white transition-colors"
                  >
                    {gradeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-neutral-400 mb-1">キーワード (Keyword)</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="text"
                    placeholder="テーマ、生徒名、タグ..."
                    value={storySearchTerm}
                    onChange={(e) => setStorySearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button 
                  onClick={() => { setStorySearchTerm(''); setStorySelectedSeminar('All'); setStorySelectedGrade('All'); }}
                  className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 font-bold py-3 px-4 rounded-sm transition-colors text-sm flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-1" /> Clear
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center text-xs text-neutral-400">
               <div>Found <span className="text-black font-bold">{filteredStories.length}</span> students</div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 min-h-[500px]">
            {isLoadingStories ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
              </div>
            ) : currentStories.length > 0 ? (
              currentStories.map((story) => (
                <article key={story.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-neutral-100">
                    <div className={`w-full h-full ${story.image} transition-transform duration-700 group-hover:scale-105 flex items-center justify-center`}>
                      <span className="text-neutral-500 text-xs font-mono">Image: {story.seminar}</span>
                    </div>
                    <div className="absolute top-0 left-0 bg-black text-white px-3 py-2 text-xs font-bold tracking-wider z-10">
                      {story.seminar}
                    </div>
                    <div className="absolute top-0 right-0 bg-white/90 backdrop-blur px-3 py-2 text-xs font-bold tracking-wider z-10 border-b border-l border-neutral-100">
                      {story.grade}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-neutral-600 transition-colors">
                      {story.theme}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-3">
                      {story.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {story.tags && story.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          onClick={(e) => handleTagClick(tag, e, 'stories')}
                          className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded-sm cursor-pointer hover:bg-neutral-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-medium uppercase tracking-wide">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {story.name}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-neutral-400 py-12">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>No stories found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Stories Pagination */}
          {storyTotalPages > 1 && (
            <div className="mt-16 flex justify-center items-center space-x-2">
              <button 
                onClick={() => setStoryCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={storyCurrentPage === 1}
                className="p-2 border border-neutral-200 rounded-sm hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: storyTotalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setStoryCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-sm transition-all ${
                    storyCurrentPage === page 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setStoryCurrentPage(prev => Math.min(prev + 1, storyTotalPages))}
                disabled={storyCurrentPage === storyTotalPages}
                className="p-2 border border-neutral-200 rounded-sm hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects-library" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-4">GIC Projects Library</h2>
              <p className="text-neutral-500 text-sm">Projects Archive</p>
            </div>
          </div>
          
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
             {currentProjects.length > 0 ? (
                currentProjects.map((project, index) => (
                   <a href={project.link} target="_blank" rel="noopener noreferrer" key={index} className="block bg-white p-8 border border-neutral-100 hover:border-black hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
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
                {Array.from({length: projectTotalPages}, (_, i) => i+1).map(page => (
                   <button key={page} onClick={()=>handleProjectPageChange(page)} className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-sm transition-all ${projectCurrentPage===page ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'}`}>{page}</button>
                ))}
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