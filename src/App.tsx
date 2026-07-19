import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles, 
  EyeOff, 
  Info,
  AlertTriangle,
  Maximize2,
  Minimize2,
  FileText,
  Play,
  Pause,
  Link,
  CheckSquare,
  Copy
} from 'lucide-react';

// Define Interface for Chapter
interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string[];
  url?: string;
}

// Initial default chapters to match screenshots exactly and show immediate content
const DEFAULT_CHAPTERS: Chapter[] = [
  {
    id: "chap-171",
    number: 171,
    title: "Chapter 171: A Fork in History",
    content: [
      "The figure was tall, taller even than Inquisitor Vanna by the look of it. It was terribly thin, as if the heavy black coat wrapped nothing more than a strip of dried flesh. Indoors, beneath that broad black umbrella, the intruder kept its face hidden under the lowered canopy.",
      "But one glance was enough. The old priest could see the twisted, blasphemous shadows coiling around that body.",
      "“Dregs of the black sun?” the old man barked, staring at the figure in fury and disbelief. “You dare set foot in this sacred archive?”",
      "The gunshot shattered the silence. The old priest had already ripped the large-caliber revolver from his waist. The blessed bullet roared forward in fire and thunder – but his body was too slow. Before the shot had even fully gone off, the figure had already moved. Two phantom shapes shot out from beneath the hem of its coat. The first intercepted the bullet in midair.",
      "The second crossed ten full meters in an instant and lashed the old priest across the shoulder. Metal screamed. The old priest’s body flew sideways and slammed into a nearby shelf. The massive structure shuddered, and books and files rained down in a crash. The strange black figure stepped forward, moving toward where the old priest had fallen. A low, chaotic murmur came from within."
    ]
  },
  {
    id: "chap-172",
    number: 172,
    title: "Chapter 172: Vanna’s Discovery",
    content: [
      "Vanna stood silently at the top of the stairs leading down to the underground sanctum, staring at the black door that had just restored itself before everyone’s eyes. Three hours ago, she had led her team into this abandoned cathedral. Inside, they had found warm, steady lamplight, a main hall that looked perfectly normal, a nun quietly at prayer, and a spotless pulpit.",
      "Two hours ago, she had shaken off that obviously abnormal nun, searching the chambers with her consecrated lantern. But the underground sanctum sprang into sharp relief. The slashes on the walls, the bullet scars, the gouges left by desperate steel – they looked like words written over and over by time itself, as if the sealed space had been trying to tell her something all along.",
      "[Words?]",
      "Vanna’s brows drew together. A flash of insight cut through her thoughts. If the nun who died in the underground sanctum had already foreseen her own fate when she sealed the door, then before she died, would she have tried to leave something behind? A record. A warning. Anything for whoever came after. That was exactly what a well-trained cleric would do.",
      "“Search the place again,” she snapped, looking up at the warriors around her. “Everything. Sword marks, bullet scars, bloodstains – all of it. This sister may have left us a message before she died.”",
      "“Yes!”",
      "The guardians moved at once. Holding their consecrated lanterns high, they fanned out through the underground sanctum, searching the already-inspected chamber with far more care than before. Vanna did not waste a second either. The moment the idea took hold, she returned to the spot where the nun had fallen – back to the entrance of the underground sanctum – and began carefully examining the ground and walls around the door.",
      "She had shattered the sanctuary doors herself moments ago, but she did not think the message would be there. Those doors were part of a finely wrought seal, engraved with the goddess’s holy symbols. Damaging them would have weakened the protection of the sanctum. A nun would never have chosen that spot. The sword-bearing nun still lay where she had fallen, blood slowly spreading beneath her, cooling as it ran. As if guided by a powerful will, it crept soundlessly across the floor, gathering itself into a trail of footprints that stretched toward the administrator console..."
    ]
  },
  {
    id: "chap-173",
    number: 173,
    title: "Chapter 173: The Fire Is Spreading",
    content: [
      "Subspace corruption did not fade on its own, any more than justice upheld itself on its own. After years of fighting the twisted shadows in the world’s deep layers, Vanna knew that better than anyone. If this cathedral had once been corrupted by subspace, and the nun stationed here had already been defeated by that corruption, then whatever had invaded the place would never have conveniently perished on its own. The strange echo of the nun in the main hall, the wrongness hanging over the entire Sixth District... all of it pointed to the same conclusion. The great door of the underground sanctum had failed to keep the intruder out. So where had that invading force gone?",
      "Vanna raised the consecrated lantern in her hand. Holy, whale-oil powered flames licked against the dark glass, casting warm amber shadows across the wet floor.",
      "She swept her gaze across the underground sanctum.",
      "“If subspace really did corrupt this place... where did it go?”"
    ]
  }
];

// Helper function to clean and filter a list of paragraphs to remove comment sections, form fields, and boilerplate
const cleanChapterParagraphs = (paragraphs: string[]): string[] => {
  if (!paragraphs) return [];
  let cutOffIndex = -1;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    const lower = p.toLowerCase();
    
    // WordPress comment section, author inputs, or script blocks
    if (
      lower === 'name' || 
      lower === 'email' || 
      lower === 'website' || 
      lower === 'comment' || 
      lower === 'leave a reply' || 
      lower === 'leave a comment' || 
      lower === 'cancel reply' ||
      lower === 'post comment' ||
      lower.includes('comment form') ||
      lower.includes('post comment') ||
      lower.includes('add a comment') ||
      lower.includes('submit comment') ||
      lower.includes('cdata') ||
      lower.includes('ak_js') ||
      lower.includes('document.getelementbyid') ||
      p.startsWith('Δ')
    ) {
      cutOffIndex = i;
      break;
    }
  }
  
  const sliced = cutOffIndex !== -1 ? paragraphs.slice(0, cutOffIndex) : paragraphs;
  
  return sliced.filter(p => {
    const trimmed = p.trim();
    const lower = trimmed.toLowerCase();
    
    if (!trimmed) return false;
    
    // Extra safety against embedded JavaScript / CDATA
    if (
      lower.includes('cdata') || 
      lower.includes('document.getelementbyid') || 
      lower.includes('window.ads') || 
      lower.includes('var ') || 
      lower.includes('function(') ||
      lower.includes('ak_js') ||
      lower.includes('<![cdata[') ||
      lower.includes(']]>') ||
      trimmed.startsWith('Δ')
    ) {
      return false;
    }
    
    if (
      lower === 'name' || 
      lower === 'email' || 
      lower === 'website' || 
      lower === 'comment' || 
      lower === 'leave a reply' || 
      lower === 'leave a comment' || 
      lower === 'cancel reply'
    ) {
      return false;
    }
    
    // Exclude lone dates e.g. "3.07.2026"
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(trimmed)) {
      return false;
    }

    // Exclude Edge voice optimization notes
    if (lower.includes('edge read aloud optimization')) {
      return false;
    }
    
    return true;
  });
};

// Function to auto-detect and clean a chapter's generic title if its first paragraph contains the full title
const cleanGenericChapter = (chap: Chapter): Chapter => {
  if (!chap) return chap;
  
  // Clean all paragraphs in the content first to remove comment fields/junk
  const cleanedContent = cleanChapterParagraphs(chap.content || []);
  if (cleanedContent.length === 0) {
    return { ...chap, content: [] };
  }
  
  const firstPara = cleanedContent[0].trim();
  const titleText = (chap.title || "").trim();
  const titleLower = titleText.toLowerCase();
  const firstParaLower = firstPara.toLowerCase();
  
  // Check if first paragraph is exactly equal to the title, or if one is a heading-like prefix of the other
  const titleFirstParaMatch = (titleLower === firstParaLower) || 
    (firstParaLower.length < 150 && (
      firstParaLower.startsWith(titleLower) || 
      titleLower.startsWith(firstParaLower)
    ));
  
  if (titleFirstParaMatch) {
    // Keep the longer/more descriptive of the two as the title, and remove it from the body
    const updatedTitle = firstPara.length >= titleText.length ? firstPara : titleText;
    return {
      ...chap,
      title: updatedTitle,
      content: cleanedContent.slice(1)
    };
  }
  
  const isGenericTitle = /^(chapter|chap\.?|ch\.?|chapiter)\s*\d+$/i.test(titleLower);
  const startsWithTitle = firstParaLower.startsWith(titleLower);
  const isHeadingLike = firstPara.length < 150 && (
    startsWithTitle ||
    firstParaLower.startsWith('chapter ') ||
    firstParaLower.startsWith('chap. ') ||
    firstParaLower.startsWith('ch. ')
  );
  
  if (isGenericTitle && isHeadingLike) {
    return {
      ...chap,
      title: firstPara,
      content: cleanedContent.slice(1)
    };
  }
  
  return {
    ...chap,
    content: cleanedContent
  };
};

export default function App() {
  // --- LIBRARY STATE ---
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('novel_chapters');
    const raw = saved ? JSON.parse(saved) : DEFAULT_CHAPTERS;
    return raw.map(cleanGenericChapter);
  });

  const [bookTitle, setBookTitle] = useState(() => {
    return localStorage.getItem('novel_book_title') || "Deep Sea Embers";
  });

  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    const saved = localStorage.getItem('novel_current_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  // --- UI LAYOUT STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'reader' | 'add' | 'paste' | 'fetch'>('reader');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isReadingSettingsOpen, setIsReadingSettingsOpen] = useState(false);

  // Sequential click/tap tracker for Exit Fullscreen button in distraction-free mode
  const [dfClickCount, setDfClickCount] = useState(0);
  const [showDfExit, setShowDfExit] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isDistractionFree) return;
    
    // Ignore clicks on buttons/inputs inside distraction-free mode
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }

    setDfClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setShowDfExit(prevShow => !prevShow); // Toggle exit button visibility
        return 0; // reset
      }
      return next;
    });

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setDfClickCount(0);
    }, 1000); // 1 second window to tap 3 times
  };

  // --- READING CONTROLS STATE ---
  const [theme, setTheme] = useState<'dark' | 'light' | 'sepia' | 'custom'>(() => {
    return (localStorage.getItem('novel_theme') as any) || 'dark';
  });
  const [customBgColor, setCustomBgColor] = useState(() => {
    return localStorage.getItem('novel_custom_bg') || '#1E2128';
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('novel_font_size');
    return saved ? parseInt(saved, 10) : 21;
  });
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('novel_line_height');
    return saved ? parseFloat(saved) : 2.0;
  });
  const [paragraphSpacing, setParagraphSpacing] = useState(() => {
    const saved = localStorage.getItem('novel_paragraph_spacing');
    return saved ? parseFloat(saved) : 2.5;
  });
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('novel_font_family') || 'Georgia';
  });
  const [pageWidth, setPageWidth] = useState<'narrow' | 'medium' | 'wide' | 'full'>(() => {
    return (localStorage.getItem('novel_page_width') as any) || 'narrow';
  });
  const [infiniteScroll, setInfiniteScroll] = useState(() => {
    const saved = localStorage.getItem('novel_infinite_scroll');
    return saved !== null ? saved === 'true' : true;
  });

  // --- ADD / PASTE CHAPTER FORMS ---
  const [newNumber, setNewNumber] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const [pasteMultipleText, setPasteMultipleText] = useState('');
  const [pasteSplitMode, setPasteSplitMode] = useState<'chapter' | 'custom'>('chapter');
  const [pasteCustomDelimiter, setPasteCustomDelimiter] = useState('---');

  // --- SMART URL SCRAPER RANGE STATE ---
  const [startUrl, setStartUrl] = useState('https://bcatranslation.com/novel/deep-sea-embers/chapter-171/');
  const [endUrl, setEndUrl] = useState('https://bcatranslation.com/novel/deep-sea-embers/chapter-173/');
  const [scrapingQueue, setScrapingQueue] = useState<{ number: number; url: string; status: 'idle' | 'fetching' | 'completed' | 'failed'; error?: string; title?: string }[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeProgressIndex, setScrapeProgressIndex] = useState(0);
  const isScrapingPaused = useRef(false);

  // --- EDIT MODAL STATE ---
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editContent, setEditContent] = useState('');

  // --- BULK SELECTION AND MODIFICATION STATES ---
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [bulkTitlePrefix, setBulkTitlePrefix] = useState('');
  const [bulkTitleSuffix, setBulkTitleSuffix] = useState('');
  const [bulkNumberOffset, setBulkNumberOffset] = useState('');
  const [bulkFindText, setBulkFindText] = useState('');
  const [bulkReplaceText, setBulkReplaceText] = useState('');

  // --- CUSTOM DIALOGS & NOTIFICATION STATE ---
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDanger: false
  });

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showCustomConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    isDanger = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
      confirmText,
      cancelText,
      isDanger
    });
  };

  const showCustomNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      isOpen: true,
      message,
      type
    });
    // Autohide after 3 seconds
    setTimeout(() => {
      setNotification(prev => {
        // Only close if it matches current notification message or is still open
        return { ...prev, isOpen: false };
      });
    }, 3000);
  };

  // --- ELEMENT REFS ---
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const chaptersEndRef = useRef<HTMLDivElement>(null);
  const infiniteObserverRef = useRef<IntersectionObserver | null>(null);

  // --- LOCAL STATE / FLAGS ---
  const isScrollingFromObserver = useRef(false);

  // --- LOCAL PERSISTENCE AUTOSAVE ---
  useEffect(() => {
    localStorage.setItem('novel_chapters', JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem('novel_book_title', bookTitle);
  }, [bookTitle]);

  useEffect(() => {
    localStorage.setItem('novel_current_index', currentChapterIndex.toString());
  }, [currentChapterIndex]);

  useEffect(() => {
    localStorage.setItem('novel_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('novel_custom_bg', customBgColor);
  }, [customBgColor]);

  useEffect(() => {
    localStorage.setItem('novel_font_size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('novel_line_height', lineHeight.toString());
  }, [lineHeight]);

  useEffect(() => {
    localStorage.setItem('novel_paragraph_spacing', paragraphSpacing.toString());
  }, [paragraphSpacing]);

  useEffect(() => {
    localStorage.setItem('novel_font_family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('novel_page_width', pageWidth);
  }, [pageWidth]);

  useEffect(() => {
    localStorage.setItem('novel_infinite_scroll', infiniteScroll.toString());
  }, [infiniteScroll]);

  // Reset distraction-free click tracking when state changes
  useEffect(() => {
    if (!isDistractionFree) {
      setShowDfExit(false);
      setDfClickCount(0);
    }
  }, [isDistractionFree]);

  // Load last scroll position or scroll to top on chapter change
  useEffect(() => {
    if (infiniteScroll) {
      if (isScrollingFromObserver.current) {
        // Change was triggered by natural scrolling intersection observer - do NOT scroll/jump
        isScrollingFromObserver.current = false;
        return;
      }
      // Jump/snap to targeted chapter article if triggered explicitly
      const targetElement = document.getElementById(`chap-article-${chapters[currentChapterIndex]?.id}`);
      if (targetElement && readerContainerRef.current) {
        targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      return;
    }

    // Single chapter mode: standard scroll restore or scroll to top
    const savedScrollY = localStorage.getItem(`scroll_pos_${currentChapterIndex}`);
    if (savedScrollY && readerContainerRef.current) {
      readerContainerRef.current.scrollTop = parseInt(savedScrollY, 10);
    } else if (readerContainerRef.current) {
      readerContainerRef.current.scrollTop = 0;
    }
  }, [currentChapterIndex, infiniteScroll]);

  // Restore saved overall infinite scroll position on mount
  useEffect(() => {
    if (infiniteScroll && readerContainerRef.current) {
      const savedInfiniteScroll = localStorage.getItem('scroll_pos_infinite');
      if (savedInfiniteScroll) {
        setTimeout(() => {
          if (readerContainerRef.current) {
            readerContainerRef.current.scrollTop = parseInt(savedInfiniteScroll, 10);
          }
        }, 100);
      }
    }
  }, []);

  // Handle scroll tracking to auto-save position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target) {
      if (infiniteScroll) {
        localStorage.setItem(`scroll_pos_infinite`, target.scrollTop.toString());
      } else {
        localStorage.setItem(`scroll_pos_${currentChapterIndex}`, target.scrollTop.toString());
      }
    }
  };

  // Track currentChapterIndex in ref to avoid recreating IntersectionObserver on every change (prevents flickering)
  const currentChapterIndexRef = useRef(currentChapterIndex);
  useEffect(() => {
    currentChapterIndexRef.current = currentChapterIndex;
  }, [currentChapterIndex]);

  // Setup IntersectionObserver for Infinite Scroll
  useEffect(() => {
    if (!infiniteScroll || chapters.length === 0) return;

    if (infiniteObserverRef.current) {
      infiniteObserverRef.current.disconnect();
    }

    infiniteObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const indexAttr = entry.target.getAttribute('data-chapter-index');
          if (indexAttr !== null) {
            const index = parseInt(indexAttr, 10);
            if (!isNaN(index) && index !== currentChapterIndexRef.current) {
              isScrollingFromObserver.current = true;
              setCurrentChapterIndex(index);
            }
          }
        }
      });
    }, {
      root: readerContainerRef.current,
      rootMargin: '-20% 0px -60% 0px' // Trigger active index change when chapter is centered in viewport
    });

    // Observe all chapter articles
    const articles = document.querySelectorAll('.chapter-article');
    articles.forEach(art => {
      infiniteObserverRef.current?.observe(art);
    });

    return () => {
      infiniteObserverRef.current?.disconnect();
    };
  }, [infiniteScroll, chapters]); // Omitted currentChapterIndex dependency to stop re-registration loops/flicker

  // --- THEME COLOR MAPS ---
  const isBgDark = (bgColor: string) => {
    const cleanHex = bgColor.replace('#', '');
    if (cleanHex.length !== 6) return true;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq < 128;
  };

  const themeStyles = {
    dark: {
      bg: '#1E2128', // Exact HEX requested by user
      text: '#E2E8F0', // Highly readable light-gray
      secondaryText: '#94A3B8',
      border: 'rgba(255, 255, 255, 0.08)',
      accent: '#FF79B0', // Rosy pink to match the glowing pink/yellow heart aesthetic
      cardBg: '#181B21',
      sidebarBg: '#15181F'
    },
    light: {
      bg: '#FAF8F5',
      text: '#1F2937',
      secondaryText: '#4B5563',
      border: 'rgba(0, 0, 0, 0.08)',
      accent: '#E11D48',
      cardBg: '#FFFFFF',
      sidebarBg: '#F3F4F6'
    },
    sepia: {
      bg: '#F5EFEB',
      text: '#3E2A14',
      secondaryText: '#725E43',
      border: 'rgba(62, 42, 20, 0.08)',
      accent: '#B45309',
      cardBg: '#FBF8F6',
      sidebarBg: '#EAE1D9'
    }
  };

  const getThemeDetails = () => {
    if (theme === 'custom') {
      const dark = isBgDark(customBgColor);
      return {
        bg: customBgColor,
        text: dark ? '#E2E8F0' : '#1F2937',
        secondaryText: dark ? '#94A3B8' : '#4B5563',
        border: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        accent: dark ? '#FF79B0' : '#E11D48',
        cardBg: customBgColor,
        sidebarBg: dark ? '#15181F' : '#F3F4F6'
      };
    }
    return themeStyles[theme];
  };

  const currentTheme = getThemeDetails();

  // --- FONT STYLE MAPS & LISTS ---
  const FONT_MAP: Record<string, string> = {
    Lora: "'Lora', Georgia, serif",
    Merriweather: "'Merriweather', Georgia, serif",
    Georgia: "Georgia, Cambria, 'Times New Roman', serif",
    Inter: "'Inter', system-ui, -apple-system, sans-serif",
    "DM Sans": "'DM Sans', system-ui, -apple-system, sans-serif",
    System: "system-ui, -apple-system, sans-serif"
  };

  const FONTS_LIST = [
    { name: 'Lora', type: 'Serif' },
    { name: 'Merriweather', type: 'Serif' },
    { name: 'Georgia', type: 'Serif' },
    { name: 'Inter', type: 'Sans-serif' },
    { name: 'DM Sans', type: 'Sans-serif' },
    { name: 'System', type: 'Sans-serif' },
  ];

  const COLOR_PRESETS = [
    { name: 'dark-default', hex: '#1E2128', text: '#E2E8F0' },
    { name: 'light-default', hex: '#FAF8F5', text: '#1F2937' },
    { name: 'light-white', hex: '#FFFFFF', text: '#111827' },
    { name: 'sepia', hex: '#F4ECD8', text: '#3E2A14' },
    { name: 'peach', hex: '#FAF5EB', text: '#3E2A14' },
    { name: 'gray', hex: '#F3F4F6', text: '#1F2937' },
    { name: 'navy', hex: '#0F172A', text: '#F1F5F9' },
  ];

  // --- CHAPTER CRUD HANDLERS ---
  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(newNumber, 10);
    if (isNaN(num) || !newTitle.trim() || !newContent.trim()) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    const newChapter: Chapter = cleanGenericChapter({
      id: `manual-${Date.now()}`,
      number: num,
      title: newTitle.trim(),
      content: newContent.split('\n').map(p => p.trim()).filter(Boolean)
    });

    const updated = [...chapters, newChapter].sort((a, b) => a.number - b.number);
    setChapters(updated);
    
    // Switch to reader, select new chapter
    const newIdx = updated.findIndex(c => c.id === newChapter.id);
    if (newIdx !== -1) {
      setCurrentChapterIndex(newIdx);
    }
    
    // Clear form
    setNewNumber('');
    setNewTitle('');
    setNewContent('');
    setActiveTab('reader');
  };

  const handleDeleteChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showCustomConfirm(
      "Delete Chapter",
      "Are you sure you want to delete this chapter? This action cannot be undone.",
      () => {
        const updated = chapters.filter(c => c.id !== id);
        if (updated.length === 0) {
          setChapters([]);
          setCurrentChapterIndex(0);
          showCustomNotification("Chapter deleted successfully.", "success");
          return;
        }

        setChapters(updated);
        if (currentChapterIndex >= updated.length) {
          setCurrentChapterIndex(updated.length - 1);
        }
        showCustomNotification("Chapter deleted successfully.", "success");
      },
      true, // isDanger
      "Delete",
      "Cancel"
    );
  };

  const handleEditChapter = (chapter: Chapter, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChapter(chapter);
    setEditTitle(chapter.title);
    setEditNumber(chapter.number.toString());
    setEditContent(chapter.content.join('\n\n'));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter) return;

    const num = parseInt(editNumber, 10);
    if (isNaN(num) || !editTitle.trim() || !editContent.trim()) {
      showCustomNotification("Please enter valid title, number, and content.", "error");
      return;
    }

    const updatedChapters = chapters.map(c => {
      if (c.id === editingChapter.id) {
        return {
          ...c,
          number: num,
          title: editTitle.trim(),
          content: editContent.split('\n').map(p => p.trim()).filter(Boolean)
        };
      }
      return c;
    }).sort((a, b) => a.number - b.number);

    setChapters(updatedChapters);
    
    // Find new index
    const newIdx = updatedChapters.findIndex(c => c.id === editingChapter.id);
    if (newIdx !== -1) {
      setCurrentChapterIndex(newIdx);
    }

    setEditingChapter(null);
  };

  // --- BULK OPERATIONS HANDLERS ---
  const handleBulkCopy = () => {
    const selected = chapters.filter(c => selectedChapterIds.includes(c.id));
    if (selected.length === 0) return;

    const textToCopy = selected.map(c => {
      return `${c.title}\n\n${c.content.join('\n\n')}`;
    }).join('\n\n---\n\n');

    navigator.clipboard.writeText(textToCopy)
      .then(() => showCustomNotification(`Copied ${selected.length} chapters to your clipboard!`, "success"))
      .catch(err => showCustomNotification("Failed to copy chapters: " + err, "error"));
  };

  const handleBulkDelete = () => {
    if (selectedChapterIds.length === 0) return;
    showCustomConfirm(
      "Bulk Delete Chapters",
      `Are you sure you want to delete the ${selectedChapterIds.length} selected chapters? This action cannot be undone.`,
      () => {
        const updated = chapters.filter(c => !selectedChapterIds.includes(c.id));
        setChapters(updated);
        setSelectedChapterIds([]);
        setIsSelectMode(false);

        setCurrentChapterIndex(0);
        showCustomNotification(`Deleted ${selectedChapterIds.length} chapters successfully.`, "success");
      },
      true, // isDanger
      "Delete Selected",
      "Cancel"
    );
  };

  const handleBulkEdit = () => {
    if (selectedChapterIds.length === 0) return;
    if (selectedChapterIds.length === 1) {
      const target = chapters.find(c => c.id === selectedChapterIds[0]);
      if (target) {
        setEditingChapter(target);
        setEditTitle(target.title);
        setEditNumber(target.number.toString());
        setEditContent(target.content.join('\n\n'));
      }
    } else {
      setIsBulkEditOpen(true);
    }
  };

  const handleSaveBulkEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const offset = parseInt(bulkNumberOffset, 10);
    const hasOffset = !isNaN(offset);
    const findText = bulkFindText;
    const replaceText = bulkReplaceText;
    const hasFindReplace = findText.length > 0;
    const prefix = bulkTitlePrefix;
    const suffix = bulkTitleSuffix;

    if (!prefix && !suffix && !hasOffset && !hasFindReplace) {
      showCustomNotification("Please enter at least one bulk editing modification.", "info");
      return;
    }

    const updatedChapters = chapters.map(c => {
      if (selectedChapterIds.includes(c.id)) {
        let updatedTitle = c.title;
        if (prefix) updatedTitle = prefix + updatedTitle;
        if (suffix) updatedTitle = updatedTitle + suffix;

        let updatedNumber = c.number;
        if (hasOffset) updatedNumber += offset;

        let updatedContent = [...c.content];
        if (hasFindReplace) {
          updatedContent = updatedContent.map(para => {
            return para.replaceAll(findText, replaceText);
          });
        }

        return {
          ...c,
          title: updatedTitle,
          number: updatedNumber,
          content: updatedContent
        };
      }
      return c;
    }).sort((a, b) => a.number - b.number);

    setChapters(updatedChapters);
    setIsBulkEditOpen(false);
    setBulkTitlePrefix('');
    setBulkTitleSuffix('');
    setBulkNumberOffset('');
    setBulkFindText('');
    setBulkReplaceText('');
    setSelectedChapterIds([]);
    setIsSelectMode(false);

    showCustomNotification("Bulk modifications applied successfully!", "success");
  };

  // --- BULK PASTE HANDLER ---
  const handlePasteMultiple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteMultipleText.trim()) return;

    let parsedChapters: Chapter[] = [];
    
    if (pasteSplitMode === 'chapter') {
      // Intelligently splits by words like "Chapter 1", "Chapter 100", "Chapter 173: ..."
      // We look for patterns like "Chapter \d+" or "CHAPTER \d+" or "chapter \d+"
      const lines = pasteMultipleText.split('\n');
      let currentChap: Chapter | null = null;
      let chapCounter = chapters.length > 0 ? Math.max(...chapters.map(c => c.number)) + 1 : 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check if line indicates a new chapter
        const chapterMatch = line.match(/^(?:chapter|Chapter|CHAPTER)\s+(\d+)[:\s]*(.*)/);
        if (chapterMatch) {
          if (currentChap) {
            parsedChapters.push(currentChap);
          }
          const num = parseInt(chapterMatch[1], 10);
          const rawTitle = chapterMatch[2]?.trim() || `Chapter ${num}`;
          currentChap = {
            id: `paste-${Date.now()}-${num}-${Math.random().toString(36).substr(2, 5)}`,
            number: num,
            title: line.includes(':') ? line : `Chapter ${num}: ${rawTitle}`,
            content: []
          };
        } else {
          if (currentChap) {
            currentChap.content.push(line);
          } else {
            // Text before first chapter header: create an initial chapter
            currentChap = {
              id: `paste-${Date.now()}-initial-${Math.random().toString(36).substr(2, 5)}`,
              number: chapCounter++,
              title: `Chapter ${chapCounter - 1}: Imported Chapter`,
              content: [line]
            };
          }
        }
      }
      if (currentChap) {
        parsedChapters.push(currentChap);
      }
    } else {
      // Split by custom delimiter
      const parts = pasteMultipleText.split(pasteCustomDelimiter);
      let chapCounter = chapters.length > 0 ? Math.max(...chapters.map(c => c.number)) + 1 : 1;

      parts.forEach((part, index) => {
        const trimmedPart = part.trim();
        if (!trimmedPart) return;

        const lines = trimmedPart.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        const title = lines[0].length < 100 ? lines[0] : `Chapter ${chapCounter}`;
        const content = lines[0].length < 100 ? lines.slice(1) : lines;

        parsedChapters.push({
          id: `paste-custom-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          number: chapCounter++,
          title: title.startsWith('Chapter') ? title : `Chapter ${chapCounter - 1}: ${title}`,
          content
        });
      });
    }

    if (parsedChapters.length === 0) {
      showCustomNotification("No chapters could be parsed. Check your split settings or template.", "error");
      return;
    }

    const cleanedParsedChapters = parsedChapters.map(cleanGenericChapter);
    const updated = [...chapters, ...cleanedParsedChapters].sort((a, b) => a.number - b.number);
    setChapters(updated);
    
    // Navigate to first added chapter
    const firstAddedId = cleanedParsedChapters[0]?.id || '';
    const newIdx = updated.findIndex(c => c.id === firstAddedId);
    if (newIdx !== -1) {
      setCurrentChapterIndex(newIdx);
    }

    setPasteMultipleText('');
    setActiveTab('reader');
    showCustomNotification(`Successfully imported ${parsedChapters.length} chapters!`, "success");
  };

  // --- AUTOMATED RANGE SCRAPER ENGINE ---
  const handleCalculateRange = () => {
    try {
      // Find all sequences of numbers in start and end URLs
      const regex = /\d+/g;
      const startMatches = [...startUrl.matchAll(regex)];
      const endMatches = [...endUrl.matchAll(regex)];
      
      if (startMatches.length === 0 || endMatches.length === 0) {
        showCustomNotification("Could not find any chapter numbers in the URLs. Please make sure the URLs contain numbers (e.g. /chapter-100/ or /chapter-173.html).", "error");
        return;
      }
      
      // We look at the very last sequence of digits in each URL
      const startMatch = startMatches[startMatches.length - 1];
      const endMatch = endMatches[endMatches.length - 1];
      
      const startNum = parseInt(startMatch[0], 10);
      const endNum = parseInt(endMatch[0], 10);
      
      if (isNaN(startNum) || isNaN(endNum)) {
        showCustomNotification("Invalid chapter numbers extracted from the URLs.", "error");
        return;
      }

      const startIdx = startMatch.index!;
      const startLength = startMatch[0].length;
      
      const urlTemplatePrefix = startUrl.substring(0, startIdx);
      const urlTemplateSuffix = startUrl.substring(startIdx + startLength);
      
      const queue: typeof scrapingQueue = [];
      const min = Math.min(startNum, endNum);
      const max = Math.max(startNum, endNum);
      
      for (let i = min; i <= max; i++) {
        // Handle padding if initial URL had leading zeroes
        let numStr = i.toString();
        if (startMatch[0].startsWith('0') && startMatch[0].length > numStr.length) {
          numStr = numStr.padStart(startMatch[0].length, '0');
        }
        
        queue.push({
          number: i,
          url: `${urlTemplatePrefix}${numStr}${urlTemplateSuffix}`,
          status: 'idle'
        });
      }

      setScrapingQueue(queue);
      setScrapeProgressIndex(0);
      isScrapingPaused.current = false;
      
    } catch (e: any) {
      showCustomNotification(`Error calculating range: ${e.message}`, "error");
    }
  };

  const startScrapingLoop = async () => {
    if (scrapingQueue.length === 0) return;
    setIsScraping(true);
    isScrapingPaused.current = false;

    let currentIndex = scrapeProgressIndex;

    while (currentIndex < scrapingQueue.length && !isScrapingPaused.current) {
      const activeItem = scrapingQueue[currentIndex];

      // Update item status to fetching
      setScrapingQueue(prev => prev.map((item, idx) => 
        idx === currentIndex ? { ...item, status: 'fetching' } : item
      ));

      try {
        const response = await fetch('/api/fetch-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: activeItem.url })
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Add to our chapters list or update existing
        const scrapedChapter: Chapter = cleanGenericChapter({
          id: `scraped-${activeItem.number}-${Date.now()}`,
          number: activeItem.number,
          title: data.title || `Chapter ${activeItem.number}`,
          content: data.paragraphs && data.paragraphs.length > 0 ? data.paragraphs : ["No content extracted from this page."]
        });

        setChapters(prev => {
          // Check if chapter already exists to overwrite or update
          const filtered = prev.filter(c => c.number !== scrapedChapter.number);
          return [...filtered, scrapedChapter].sort((a, b) => a.number - b.number);
        });

        // Update item status to completed
        setScrapingQueue(prev => prev.map((item, idx) => 
          idx === currentIndex ? { ...item, status: 'completed', title: scrapedChapter.title } : item
        ));

      } catch (err: any) {
        console.error(`Scrape failed for chapter ${activeItem.number}:`, err);
        setScrapingQueue(prev => prev.map((item, idx) => 
          idx === currentIndex ? { ...item, status: 'failed', error: err.message || 'Unknown error' } : item
        ));
      }

      currentIndex++;
      setScrapeProgressIndex(currentIndex);

      // Polite delay between requests to avoid hitting the target server too aggressively, but only if not paused
      if (currentIndex < scrapingQueue.length && !isScrapingPaused.current) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    }

    setIsScraping(false);
    if (currentIndex >= scrapingQueue.length) {
      showCustomNotification("Range fetching sequence completed!", "success");
    }
  };

  const pauseScraping = () => {
    isScrapingPaused.current = true;
    setIsScraping(false);
  };

  const clearScrapeQueue = () => {
    setScrapingQueue([]);
    setScrapeProgressIndex(0);
    setIsScraping(false);
    isScrapingPaused.current = false;
  };


  // --- IMPORT / EXPORT LIBRARY HANDLERS ---
  const exportLibrary = () => {
    const dataStr = JSON.stringify({
      bookTitle,
      chapters
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${bookTitle.toLowerCase().replace(/\s+/g, '_')}_library.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importLibrary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.chapters && Array.isArray(parsed.chapters)) {
            setChapters(parsed.chapters);
            if (parsed.bookTitle) {
              setBookTitle(parsed.bookTitle);
            }
            setCurrentChapterIndex(0);
            showCustomNotification("Library successfully imported!", "success");
          } else {
            showCustomNotification("Invalid library file format. Missing chapters list.", "error");
          }
        } catch (err) {
          showCustomNotification("Error parsing JSON file. Please check that it is a valid exported library.", "error");
        }
      };
    }
  };

  const handleResetLibrary = () => {
    showCustomConfirm(
      "Reset Library",
      "Are you sure you want to reset your library to the default 'Deep Sea Embers' chapters? This will overwrite all your custom and scraped chapters.",
      () => {
        setChapters(DEFAULT_CHAPTERS);
        setBookTitle("Deep Sea Embers");
        setCurrentChapterIndex(0);
        localStorage.removeItem('novel_current_index');
        showCustomNotification("Library reset to defaults.", "success");
      },
      true, // isDanger
      "Reset Library",
      "Cancel"
    );
  };

  // --- HELPER RENDERING GETTERS ---
  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.content.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeChapter = chapters[currentChapterIndex] || null;

  return (
    <div 
      id="app-container"
      className="flex h-screen w-screen overflow-hidden transition-colors duration-300 select-none"
      style={{ 
        backgroundColor: currentTheme.bg, 
        color: currentTheme.text,
        fontFamily: FONT_MAP[fontFamily] || FONT_MAP['Georgia']
      }}
    >
      
      {/* 1. SIDEBAR (Collapsible table of contents, search, import/export) */}
      <div 
        id="app-sidebar"
        className={`flex-shrink-0 border-r transition-all duration-300 flex flex-col h-full ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}
        style={{ 
          borderColor: currentTheme.border,
          backgroundColor: currentTheme.sidebarBg
        }}
      >
        {/* Sidebar Header */}
        <div id="sidebar-header" className="p-4 border-b flex items-center justify-between" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: currentTheme.accent }} />
            <input 
              id="book-title-input"
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="bg-transparent font-serif font-bold text-lg focus:outline-none focus:border-b w-48"
              style={{ borderBottomColor: currentTheme.accent }}
              title="Click to rename book"
            />
          </div>
          <button 
            id="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div id="sidebar-tabs" className="grid grid-cols-4 border-b text-xs text-center" style={{ borderColor: currentTheme.border }}>
          <button 
            id="tab-reader"
            onClick={() => { setActiveTab('reader'); }}
            className={`py-3 font-medium transition-colors ${activeTab === 'reader' ? 'border-b-2' : ''}`}
            style={{ 
              borderBottomColor: activeTab === 'reader' ? currentTheme.accent : 'transparent',
              color: activeTab === 'reader' ? currentTheme.text : currentTheme.secondaryText
            }}
          >
            ToC
          </button>
          <button 
            id="tab-add"
            onClick={() => { setActiveTab('add'); }}
            className={`py-3 font-medium transition-colors ${activeTab === 'add' ? 'border-b-2' : ''}`}
            style={{ 
              borderBottomColor: activeTab === 'add' ? currentTheme.accent : 'transparent',
              color: activeTab === 'add' ? currentTheme.text : currentTheme.secondaryText
            }}
          >
            + Chapter
          </button>
          <button 
            id="tab-paste"
            onClick={() => { setActiveTab('paste'); }}
            className={`py-3 font-medium transition-colors ${activeTab === 'paste' ? 'border-b-2' : ''}`}
            style={{ 
              borderBottomColor: activeTab === 'paste' ? currentTheme.accent : 'transparent',
              color: activeTab === 'paste' ? currentTheme.text : currentTheme.secondaryText
            }}
          >
            Paste Multi
          </button>
          <button 
            id="tab-fetch"
            onClick={() => { setActiveTab('fetch'); }}
            className={`py-3 font-medium transition-colors ${activeTab === 'fetch' ? 'border-b-2' : ''}`}
            style={{ 
              borderBottomColor: activeTab === 'fetch' ? currentTheme.accent : 'transparent',
              color: activeTab === 'fetch' ? currentTheme.text : currentTheme.secondaryText
            }}
          >
            Auto Fetch
          </button>
        </div>

        {/* Sidebar Tab Contents */}
        <div id="sidebar-content" className="flex-1 overflow-y-auto p-4 select-text">
          
          {/* TAB: Table of Contents & Search */}
          {activeTab === 'reader' && (
            <div id="toc-container" className="flex flex-col h-full space-y-4">
              {/* Search Box */}
              <div id="search-box" className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3 pointer-events-none" style={{ color: currentTheme.secondaryText }} />
                <input 
                  id="search-chapters-input"
                  type="text"
                  placeholder="Search title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-lg text-sm bg-black/5 dark:bg-white/5 border focus:outline-none"
                  style={{ borderColor: currentTheme.border }}
                />
                {searchQuery && (
                  <button 
                    id="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div id="sidebar-actions" className="grid grid-cols-2 gap-2 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                <button 
                  id="btn-export"
                  onClick={exportLibrary}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border transition-all"
                  style={{ borderColor: currentTheme.border }}
                  title="Export your personal library to a JSON file"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                <label 
                  id="label-import"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border cursor-pointer transition-all text-center"
                  style={{ borderColor: currentTheme.border }}
                  title="Import a previously saved JSON library"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import
                  <input id="input-import-file" type="file" accept=".json" onChange={importLibrary} className="hidden" />
                </label>
              </div>

              {/* Chapters List */}
              <div id="chapters-list-wrapper" className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: currentTheme.secondaryText }}>
                  <span>Chapters ({filteredChapters.length})</span>
                  <div className="flex items-center gap-2">
                    {chapters.length > 0 && (
                      <button
                        id="toggle-select-mode-btn"
                        onClick={() => {
                          setIsSelectMode(!isSelectMode);
                          if (isSelectMode) setSelectedChapterIds([]);
                        }}
                        className="text-[10px] hover:underline flex items-center gap-0.5"
                        style={{ color: isSelectMode ? currentTheme.accent : undefined }}
                        title="Toggle Multi-Select Mode to Delete, Edit or Copy multiple chapters"
                      >
                        <CheckSquare className="w-2.5 h-2.5" />
                        {isSelectMode ? "Cancel Select" : "Select Mode"}
                      </button>
                    )}
                    {chapters.length > 0 && (
                      <button 
                        id="reset-library-btn"
                        onClick={handleResetLibrary}
                        className="text-[10px] hover:underline flex items-center gap-0.5"
                        title="Reset library to defaults"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Bulk Controls & Select All Options when in Select Mode */}
                {isSelectMode && (
                  <div className="space-y-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
                        <input 
                          type="checkbox"
                          checked={selectedChapterIds.length === filteredChapters.length && filteredChapters.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChapterIds(filteredChapters.map(c => c.id));
                            } else {
                              setSelectedChapterIds([]);
                            }
                          }}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 w-3.5 h-3.5 cursor-pointer accent-pink-500"
                        />
                        <span>Select All ({selectedChapterIds.length} of {filteredChapters.length})</span>
                      </label>
                      {selectedChapterIds.length > 0 && (
                        <button 
                          onClick={() => setSelectedChapterIds([])}
                          className="text-[10px] hover:underline opacity-80"
                        >
                          Deselect All
                        </button>
                      )}
                    </div>

                    {selectedChapterIds.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-lg bg-black/10 dark:bg-white/10 border" style={{ borderColor: currentTheme.border }}>
                        <button
                          onClick={handleBulkCopy}
                          className="flex items-center justify-center gap-1 py-1 px-1.5 rounded bg-black/5 dark:bg-white/5 hover:bg-black/15 dark:hover:bg-white/15 text-[11px] font-semibold transition-colors"
                          title="Copy content of selected chapters to clipboard"
                        >
                          <Copy className="w-3 h-3" style={{ color: currentTheme.accent }} />
                          Copy
                        </button>
                        <button
                          onClick={handleBulkEdit}
                          className="flex items-center justify-center gap-1 py-1 px-1.5 rounded bg-black/5 dark:bg-white/5 hover:bg-black/15 dark:hover:bg-white/15 text-[11px] font-semibold transition-colors"
                          title="Edit prefix, title additions, offsets or content replacements in selected chapters"
                        >
                          <Edit3 className="w-3 h-3" style={{ color: currentTheme.accent }} />
                          Edit
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          className="flex items-center justify-center gap-1 py-1 px-1.5 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-500 text-[11px] font-semibold transition-colors animate-pulse"
                          title="Delete selected chapters"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {filteredChapters.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color: currentTheme.secondaryText }}>
                    {searchQuery ? "No chapters match your search." : "No chapters in your library yet. Add or scrape some!"}
                  </div>
                ) : (
                  <div id="chapters-list" className="space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                    {filteredChapters.map((chap, index) => {
                      const isSelected = !infiniteScroll && currentChapterIndex === index;
                      const isHighlighted = infiniteScroll && currentChapterIndex === index;
                      const isChecked = selectedChapterIds.includes(chap.id);
                      return (
                        <div 
                          id={`chapter-item-${chap.id}`}
                          key={chap.id}
                          onClick={(e) => {
                            if (isSelectMode) {
                              e.stopPropagation();
                              setSelectedChapterIds(prev => {
                                if (prev.includes(chap.id)) {
                                  return prev.filter(id => id !== chap.id);
                                } else {
                                  return [...prev, chap.id];
                                }
                              });
                            } else {
                              // Do not disable infinite scroll so they can jump to any chapter within infinity flow
                              setCurrentChapterIndex(chapters.indexOf(chap));
                            }
                          }}
                          className={`group w-full text-left p-2.5 rounded-lg text-sm transition-all flex items-center justify-between cursor-pointer ${
                            isSelectMode && isChecked
                              ? 'bg-black/10 dark:bg-white/10 ring-1 ring-current/25 font-semibold'
                              : isSelected 
                                ? 'bg-black/15 dark:bg-white/15 font-semibold border-l-4' 
                                : isHighlighted 
                                  ? 'bg-black/5 dark:bg-white/5 border-l-4 border-dashed'
                                  : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                          style={{ 
                            borderLeftColor: (!isSelectMode && (isSelected || isHighlighted)) ? currentTheme.accent : 'transparent'
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isSelectMode && (
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // parent onClick handles toggle
                                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 w-3.5 h-3.5 cursor-pointer accent-pink-500 mr-1 flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="truncate font-medium">{chap.title}</div>
                              <div className="text-xs truncate" style={{ color: currentTheme.secondaryText }}>
                                {chap.content.length} paragraphs • #{chap.number}
                              </div>
                            </div>
                          </div>
                          
                          {/* Hover Actions (Edit/Delete) - Only show when NOT in Select Mode */}
                          {!isSelectMode && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                id={`edit-chapter-${chap.id}`}
                                onClick={(e) => handleEditChapter(chap, e)}
                                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs"
                                title="Edit Chapter"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                id={`delete-chapter-${chap.id}`}
                                onClick={(e) => handleDeleteChapter(chap.id, e)}
                                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-rose-500 text-xs"
                                title="Delete Chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Add Single Chapter */}
          {activeTab === 'add' && (
            <form id="add-chapter-form" onSubmit={handleAddChapter} className="space-y-4">
              <h3 className="font-semibold text-sm">Add New Chapter</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Chapter Number</label>
                <input 
                  id="add-chapter-number"
                  type="number"
                  required
                  placeholder="e.g. 174"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                  style={{ borderColor: currentTheme.border }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Chapter Title</label>
                <input 
                  id="add-chapter-title"
                  type="text"
                  required
                  placeholder="e.g. Chapter 174: Setting Sail"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                  style={{ borderColor: currentTheme.border }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Content (Double line break for paragraphs)</label>
                <textarea 
                  id="add-chapter-content"
                  required
                  rows={12}
                  placeholder="Paste chapter text content here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/10 dark:bg-white/10 border text-sm font-sans focus:outline-none"
                  style={{ borderColor: currentTheme.border }}
                />
              </div>

              <button 
                id="btn-add-chapter-submit"
                type="submit"
                className="w-full py-2.5 rounded-lg font-bold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: currentTheme.accent }}
              >
                Add to Library
              </button>
            </form>
          )}

          {/* TAB: Paste Multiple Chapters */}
          {activeTab === 'paste' && (
            <form id="paste-chapters-form" onSubmit={handlePasteMultiple} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Paste Multiple Chapters</h3>
                <p className="text-xs" style={{ color: currentTheme.secondaryText }}>
                  Paste a large file of chapters. We will split them automatically!
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Split Logic</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    id="btn-split-auto"
                    type="button"
                    onClick={() => setPasteSplitMode('chapter')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border ${
                      pasteSplitMode === 'chapter' ? 'bg-black/15 dark:bg-white/15 border-current' : ''
                    }`}
                    style={{ borderColor: pasteSplitMode === 'chapter' ? currentTheme.accent : currentTheme.border }}
                  >
                    By "Chapter X" Heading
                  </button>
                  <button 
                    id="btn-split-custom"
                    type="button"
                    onClick={() => setPasteSplitMode('custom')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border ${
                      pasteSplitMode === 'custom' ? 'bg-black/15 dark:bg-white/15 border-current' : ''
                    }`}
                    style={{ borderColor: pasteSplitMode === 'custom' ? currentTheme.accent : currentTheme.border }}
                  >
                    Custom Separator
                  </button>
                </div>
              </div>

              {pasteSplitMode === 'custom' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Separator Characters</label>
                  <input 
                    id="custom-delimiter-input"
                    type="text"
                    value={pasteCustomDelimiter}
                    onChange={(e) => setPasteCustomDelimiter(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                    style={{ borderColor: currentTheme.border }}
                    placeholder="e.g. ---"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Raw Chapter Dump</label>
                <textarea 
                  id="paste-multiple-textarea"
                  required
                  rows={12}
                  placeholder={`Chapter 174: First Chapter...\n\nText here...\n\nChapter 175: Second Chapter...\n\nText here...`}
                  value={pasteMultipleText}
                  onChange={(e) => setPasteMultipleText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/10 dark:bg-white/10 border text-sm font-sans focus:outline-none"
                  style={{ borderColor: currentTheme.border }}
                />
              </div>

              <button 
                id="btn-paste-chapters-submit"
                type="submit"
                className="w-full py-2.5 rounded-lg font-bold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: currentTheme.accent }}
              >
                Split & Import
              </button>
            </form>
          )}

          {/* TAB: Automated Chapter Range Scraper */}
          {activeTab === 'fetch' && (
            <div id="fetch-range-container" className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Automated Fetch Range</h3>
                <p className="text-xs" style={{ color: currentTheme.secondaryText }}>
                  Input a Start Chapter URL and an End Chapter URL. We will calculate the sequence and copy everything in between automatically!
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Start Chapter URL</label>
                <div className="relative flex items-center">
                  <Link className="w-3.5 h-3.5 absolute left-2.5" style={{ color: currentTheme.secondaryText }} />
                  <input 
                    id="scraper-start-url"
                    type="url"
                    value={startUrl}
                    onChange={(e) => setStartUrl(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 border text-xs focus:outline-none"
                    style={{ borderColor: currentTheme.border }}
                    placeholder="e.g. https://site.com/chapter-100/"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>End Chapter URL</label>
                <div className="relative flex items-center">
                  <Link className="w-3.5 h-3.5 absolute left-2.5" style={{ color: currentTheme.secondaryText }} />
                  <input 
                    id="scraper-end-url"
                    type="url"
                    value={endUrl}
                    onChange={(e) => setEndUrl(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 border text-xs focus:outline-none"
                    style={{ borderColor: currentTheme.border }}
                    placeholder="e.g. https://site.com/chapter-200/"
                  />
                </div>
              </div>

              <button 
                id="btn-calculate-range"
                onClick={handleCalculateRange}
                className="w-full py-2 rounded-lg font-bold text-sm border transition-all bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                style={{ borderColor: currentTheme.border }}
              >
                1. Calculate Range Sequence
              </button>

              {/* Range Queue Results */}
              {scrapingQueue.length > 0 && (
                <div className="space-y-3 pt-2 border-t" style={{ borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between text-xs font-bold uppercase" style={{ color: currentTheme.secondaryText }}>
                    <span>Sequence Queue ({scrapingQueue.length} chapters)</span>
                    <button id="btn-clear-queue" onClick={clearScrapeQueue} className="hover:underline">Clear</button>
                  </div>

                  {/* Scrape Actions */}
                  <div className="flex gap-2">
                    {!isScraping ? (
                      <button 
                        id="btn-start-scrape"
                        onClick={startScrapingLoop}
                        className="flex-1 py-2 rounded-lg font-bold text-xs text-white flex items-center justify-center gap-1 hover:brightness-110"
                        style={{ backgroundColor: currentTheme.accent }}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Start Copying
                      </button>
                    ) : (
                      <button 
                        id="btn-pause-scrape"
                        onClick={pauseScraping}
                        className="flex-1 py-2 rounded-lg font-bold text-xs bg-amber-600 text-white flex items-center justify-center gap-1 hover:bg-amber-700"
                      >
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        Pause
                      </button>
                    )}
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Progress: {scrapeProgressIndex} / {scrapingQueue.length}</span>
                      <span>{Math.round((scrapeProgressIndex / scrapingQueue.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${(scrapeProgressIndex / scrapingQueue.length) * 100}%`,
                          backgroundColor: currentTheme.accent 
                        }}
                      />
                    </div>
                  </div>

                  {/* Queue Scrape Progress Logs */}
                  <div id="scrape-logs" className="max-h-48 overflow-y-auto space-y-1 bg-black/10 dark:bg-white/5 rounded-lg p-2 font-mono text-[10px]">
                    {scrapingQueue.map((item, index) => (
                      <div key={index} className="flex items-start justify-between py-0.5 border-b border-white/5">
                        <span className="truncate pr-1 max-w-[150px]">
                          Chapter {item.number} {item.title && `(${item.title})`}
                        </span>
                        <span>
                          {item.status === 'idle' && <span className="text-gray-500">Pending</span>}
                          {item.status === 'fetching' && <span className="text-blue-400 animate-pulse">Copying...</span>}
                          {item.status === 'completed' && <span className="text-green-500 font-bold">✓ Saved</span>}
                          {item.status === 'failed' && <span className="text-red-500 font-bold" title={item.error}>✕ Error</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help tip */}
              <div id="fetch-range-help" className="p-3 rounded-lg text-xs flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-0.5">How it works:</strong>
                  Our backend bypasses client-side CORS blocks to fetch pages sequentially. It extracts clean paragraphs and titles from standard web layouts, saving them to your device!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN READING FRAME */}
      <div id="reader-frame" className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Floating Controls Overlay (Visible when not distraction free, or on hover/trigger) */}
        {!isDistractionFree && (
          <header 
            id="reader-top-bar"
            className="p-4 border-b flex items-center justify-between flex-shrink-0 relative z-30 select-none transition-all"
            style={{ 
              borderColor: currentTheme.border,
              backgroundColor: currentTheme.bg,
              color: currentTheme.text
            }}
          >
            {/* Left side: Menu button + Current active chapter title */}
            <div className="flex items-center gap-3 min-w-0">
              <button 
                id="toggle-sidebar-btn-header"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                title="Toggle Table of Contents Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-serif font-semibold text-sm md:text-base truncate opacity-90">
                  {activeChapter ? activeChapter.title : bookTitle}
                </span>
                {infiniteScroll && (
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 uppercase tracking-wider font-semibold opacity-75">
                    Infinite Mode
                  </span>
                )}
              </div>
            </div>

            {/* Right side: Search, Sidebar Quick link, Aa / Settings, and Distraction-free */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Search Toggle */}
              <button 
                id="search-header-btn"
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveTab('reader');
                  // focus the search input after a microtask
                  setTimeout(() => {
                    document.getElementById('search-chapters-input')?.focus();
                  }, 100);
                }}
                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title="Search Library"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Reading Settings Page Settings "Aa" button */}
              <button 
                id="reading-settings-btn"
                onClick={() => setIsReadingSettingsOpen(true)}
                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-sm font-semibold border border-transparent hover:border-current/10"
                style={{ color: currentTheme.accent }}
                title="Adjust Text, Theme, and Layout Settings"
              >
                <Settings className="w-4.5 h-4.5" />
                <span className="text-xs font-bold">Aa</span>
              </button>

              {/* Distraction Free Mode */}
              <button 
                id="distraction-free-btn"
                onClick={() => setIsDistractionFree(true)}
                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs flex items-center gap-1 font-semibold"
                title="Distraction-Free Mode (Double click content to exit)"
              >
                <EyeOff className="w-4.5 h-4.5" />
                <span className="hidden md:inline">Distraction-Free</span>
              </button>
            </div>
          </header>
        )}

        {/* Floating Indicator when in Distraction-Free Mode */}
        {isDistractionFree && showDfExit && (
          <div className="absolute top-4 left-4 z-50 flex gap-2 animate-in fade-in zoom-in-95 duration-200">
            <button 
              id="exit-distraction-free-btn"
              onClick={() => setIsDistractionFree(false)}
              className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur border border-white/10 flex items-center gap-1 shadow-lg transition-all"
              title="Show Controls"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Exit Fullscreen Mode</span>
            </button>
          </div>
        )}

        {/* 3. READER CONTAINER (The actual canvas / screen) */}
        <div 
          id="reader-canvas"
          ref={readerContainerRef}
          onScroll={handleScroll}
          onClick={handleCanvasClick}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-10 select-text outline-none relative"
          onDoubleClick={() => setIsDistractionFree(!isDistractionFree)}
          title="Double click or tap 3 times to toggle Distraction-Free controls!"
        >
          {chapters.length === 0 ? (
            <div id="empty-reader" className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
              <BookOpen className="w-16 h-16 mb-4 animate-bounce" style={{ color: currentTheme.accent }} />
              <h2 className="text-2xl font-serif font-bold mb-2">Your Library is Empty</h2>
              <p className="text-sm mb-6" style={{ color: currentTheme.secondaryText }}>
                Create a chapter manually, split-paste text blocks, or paste URLs to automatically download an entire chapter sequence!
              </p>
              <div className="flex gap-3">
                <button 
                  id="empty-add-btn"
                  onClick={() => { setIsSidebarOpen(true); setActiveTab('add'); }}
                  className="px-4 py-2 rounded-lg font-bold text-white text-sm hover:brightness-110"
                  style={{ backgroundColor: currentTheme.accent }}
                >
                  Add Chapter
                </button>
                <button 
                  id="empty-scrape-btn"
                  onClick={() => { setIsSidebarOpen(true); setActiveTab('fetch'); }}
                  className="px-4 py-2 rounded-lg font-bold text-sm border hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: currentTheme.border }}
                >
                  Auto Fetch Range
                </button>
              </div>
            </div>
          ) : (
            <div 
              id="reader-content-width-wrapper"
              className={`mx-auto transition-all duration-300 ${
                pageWidth === 'narrow' ? 'max-w-[720px]' : 
                pageWidth === 'medium' ? 'max-w-[880px]' : 
                pageWidth === 'wide' ? 'max-w-[1020px]' : 'max-w-full px-4'
              }`}
            >
              {/* INFINITE SCROLL RENDER BLOCK */}
              {infiniteScroll ? (
                <div id="infinite-scroll-container" className="space-y-0">
                  {chapters.map((chap, idx) => (
                    <article 
                      id={`chap-article-${chap.id}`}
                      key={chap.id}
                      data-chapter-index={idx}
                      className="chapter-article relative"
                      style={{ 
                        paddingBottom: `${paragraphSpacing}rem`
                      }}
                    >
                      {/* Visual separator between chapters in Infinite Mode */}
                      {idx > 0 && (
                        <div id={`hearts-separator-${idx}`} className="text-center py-12 select-none relative">
                          <hr className="w-1/3 mx-auto opacity-10 mb-8" style={{ borderColor: currentTheme.text }} />
                          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2" style={{ letterSpacing: '0.05em' }}>
                            {bookTitle}
                          </h2>
                          <hr className="w-1/12 mx-auto opacity-20 mt-4" style={{ borderColor: currentTheme.accent }} />
                        </div>
                      )}

                      {/* Header for the first chapter in the list */}
                      {idx === 0 && (
                        <div id="first-chapter-header" className="text-center pb-8 select-none">
                          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">{bookTitle}</h1>
                          <hr className="w-1/12 mx-auto opacity-20 mb-8" style={{ borderColor: currentTheme.accent }} />
                        </div>
                      )}

                      {/* Chapter Title block */}
                      <div className="mb-10 text-left">
                        <h3 
                          className="font-serif font-semibold tracking-tight leading-snug select-text opacity-90 border-b pb-2" 
                          style={{ 
                            fontSize: `${fontSize * 1.15}px`,
                            borderColor: currentTheme.border
                          }}
                        >
                          {chap.title}
                        </h3>
                      </div>

                      {/* Chapter Content Paragraphs */}
                      <div className="space-y-0 select-text" style={{ fontFamily: FONT_MAP[fontFamily] }}>
                        {chap.content.map((para, pIdx) => (
                          <p 
                            id={`chap-${chap.id}-p-${pIdx}`}
                            key={pIdx} 
                            className="leading-relaxed hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 transition-all"
                            style={{ 
                              fontSize: `${fontSize}px`, 
                              lineHeight: lineHeight,
                              marginBottom: `${paragraphSpacing}rem`
                            }}
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </article>
                  ))}
                  <div ref={chaptersEndRef} className="text-center py-12 select-none" style={{ color: currentTheme.secondaryText }}>
                    <p className="text-xs font-mono uppercase tracking-widest">End of Library • Add more chapters in Sidebar</p>
                  </div>
                </div>
              ) : (
                /* SINGLE CHAPTER RENDER BLOCK */
                <article id="single-chapter-view" className="relative">
                  {/* Title */}
                  <div className="text-center select-none mb-4">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{bookTitle}</h1>
                    <hr className="w-1/12 mx-auto opacity-20 mb-6" style={{ borderColor: currentTheme.accent }} />
                  </div>

                  <div className="mb-10 text-left">
                    <h2 
                      className="font-serif font-bold tracking-tight border-b pb-2" 
                      style={{ 
                        fontSize: `${fontSize * 1.2}px`,
                        borderColor: currentTheme.border
                      }}
                    >
                      {activeChapter.title}
                    </h2>
                  </div>

                  {/* Body paragraphs */}
                  <div className="select-text mb-16" style={{ fontFamily: FONT_MAP[fontFamily] }}>
                    {activeChapter.content.map((para, pIdx) => (
                      <p 
                        id={`p-single-${pIdx}`}
                        key={pIdx} 
                        className="leading-relaxed hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 transition-all"
                        style={{ 
                          fontSize: `${fontSize}px`, 
                          lineHeight: lineHeight,
                          marginBottom: `${paragraphSpacing}rem`
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Single Chapter Navigation Actions */}
                  <div id="single-chapter-nav" className="flex items-center justify-between border-t pt-8 pb-12 select-none" style={{ borderColor: currentTheme.border }}>
                    <button 
                      id="prev-chapter-btn"
                      disabled={currentChapterIndex === 0}
                      onClick={() => setCurrentChapterIndex(prev => Math.max(0, prev - 1))}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
                      style={{ borderColor: currentTheme.border }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous Chapter
                    </button>
                    <span className="text-xs font-mono" style={{ color: currentTheme.secondaryText }}>
                      Chapter {currentChapterIndex + 1} of {chapters.length}
                    </span>
                    <button 
                      id="next-chapter-btn"
                      disabled={currentChapterIndex === chapters.length - 1}
                      onClick={() => setCurrentChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
                      style={{ borderColor: currentTheme.border }}
                    >
                      Next Chapter
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. CHAPTER EDITING DIALOG / MODAL */}
      {editingChapter && (
        <div id="edit-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
          <div 
            id="edit-modal-body"
            className="w-full max-w-2xl rounded-2xl border p-6 flex flex-col max-h-[85vh] shadow-2xl"
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              color: currentTheme.text,
              borderColor: currentTheme.border
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: currentTheme.border }}>
              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                <Edit3 className="w-5 h-5" style={{ color: currentTheme.accent }} />
                Edit Chapter Details
              </h3>
              <button 
                id="close-edit-modal-btn"
                onClick={() => setEditingChapter(null)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="edit-chapter-form-submit" onSubmit={handleSaveEdit} className="space-y-4 flex-1 overflow-y-auto pr-1 select-text">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Chapter Index</label>
                  <input 
                    id="edit-chapter-number-input"
                    type="number"
                    required
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                    style={{ borderColor: currentTheme.border }}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Chapter Title Heading</label>
                  <input 
                    id="edit-chapter-title-input"
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                    style={{ borderColor: currentTheme.border }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase block" style={{ color: currentTheme.secondaryText }}>Paragraphs (One paragraph per double line break)</label>
                <textarea 
                  id="edit-chapter-content-input"
                  required
                  rows={14}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black/10 dark:bg-white/10 border text-sm font-sans focus:outline-none"
                  style={{ borderColor: currentTheme.border }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: currentTheme.border }}>
                <button 
                  id="btn-edit-cancel"
                  type="button"
                  onClick={() => setEditingChapter(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: currentTheme.border }}
                >
                  Cancel
                </button>
                <button 
                  id="btn-edit-save"
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white hover:brightness-110"
                  style={{ backgroundColor: currentTheme.accent }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK EDITING DIALOG / MODAL */}
      {isBulkEditOpen && (
        <div id="bulk-edit-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
          <div 
            id="bulk-edit-modal-body"
            className="w-full max-w-lg rounded-2xl border p-6 flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-150"
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              color: currentTheme.text,
              borderColor: currentTheme.border
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: currentTheme.border }}>
              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                <Edit3 className="w-5 h-5" style={{ color: currentTheme.accent }} />
                Bulk Edit ({selectedChapterIds.length} Chapters)
              </h3>
              <button 
                id="close-bulk-edit-modal-btn"
                onClick={() => setIsBulkEditOpen(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="bulk-edit-form-submit" onSubmit={handleSaveBulkEdit} className="space-y-4 flex-1 overflow-y-auto pr-1 select-text">
              <p className="text-xs opacity-70 mb-2">
                Specify any modifications you'd like to apply to all {selectedChapterIds.length} selected chapters. Leave fields blank to skip applying that modification.
              </p>

              <div className="space-y-3">
                {/* 1. Title Modification Prefix/Suffix */}
                <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: currentTheme.accent }}>Modify Titles</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs block opacity-80">Add to Start (Prefix)</label>
                      <input 
                        id="bulk-title-prefix"
                        type="text"
                        placeholder="e.g. Vol 1 - "
                        value={bulkTitlePrefix}
                        onChange={(e) => setBulkTitlePrefix(e.target.value)}
                        className="w-full p-2 rounded bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                        style={{ borderColor: currentTheme.border }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs block opacity-80">Add to End (Suffix)</label>
                      <input 
                        id="bulk-title-suffix"
                        type="text"
                        placeholder="e.g. [Draft]"
                        value={bulkTitleSuffix}
                        onChange={(e) => setBulkTitleSuffix(e.target.value)}
                        className="w-full p-2 rounded bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                        style={{ borderColor: currentTheme.border }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Number Offset */}
                <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: currentTheme.accent }}>Adjust Chapter Indexing</span>
                  <div className="space-y-1">
                    <label className="text-xs block opacity-80">Index Offset (Positive or Negative number)</label>
                    <input 
                      id="bulk-number-offset"
                      type="number"
                      placeholder="e.g. +1 or -5"
                      value={bulkNumberOffset}
                      onChange={(e) => setBulkNumberOffset(e.target.value)}
                      className="w-full p-2 rounded bg-black/10 dark:bg-white/10 border text-sm focus:outline-none"
                      style={{ borderColor: currentTheme.border }}
                    />
                    <span className="text-[10px] opacity-60 block">E.g., enter 1 to shift Chapter 15 to Chapter 16, or -1 to shift Chapter 15 to Chapter 14.</span>
                  </div>
                </div>

                {/* 3. Global Find and Replace */}
                <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: currentTheme.accent }}>Find & Replace in Content</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs block opacity-80 font-mono">Find Text</label>
                      <input 
                        id="bulk-find-text"
                        type="text"
                        placeholder="text to find..."
                        value={bulkFindText}
                        onChange={(e) => setBulkFindText(e.target.value)}
                        className="w-full p-2 rounded bg-black/10 dark:bg-white/10 border text-sm focus:outline-none font-mono"
                        style={{ borderColor: currentTheme.border }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs block opacity-80 font-mono">Replace With</label>
                      <input 
                        id="bulk-replace-text"
                        type="text"
                        placeholder="replacement text..."
                        value={bulkReplaceText}
                        onChange={(e) => setBulkReplaceText(e.target.value)}
                        className="w-full p-2 rounded bg-black/10 dark:bg-white/10 border text-sm focus:outline-none font-mono"
                        style={{ borderColor: currentTheme.border }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: currentTheme.border }}>
                <button 
                  id="btn-bulk-cancel"
                  type="button"
                  onClick={() => setIsBulkEditOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: currentTheme.border }}
                >
                  Cancel
                </button>
                <button 
                  id="btn-bulk-save"
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white hover:brightness-110"
                  style={{ backgroundColor: currentTheme.accent }}
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. GORGEOUS READING SETTINGS DIALOG / MODAL */}
      {isReadingSettingsOpen && (
        <div 
          id="reading-settings-overlay" 
          onClick={() => setIsReadingSettingsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            id="reading-settings-modal"
            onClick={(e) => e.stopPropagation()} // Prevent close on click inside
            className="w-full max-w-sm rounded-3xl border p-6 flex flex-col space-y-6 shadow-2xl relative"
            style={{ 
              backgroundColor: '#1E2128', // Dark background matching Kindle/mockup exactly
              color: '#E2E8F0',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold tracking-tight">Reading Settings</h3>
              <button 
                id="close-reading-settings-btn"
                onClick={() => setIsReadingSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-1">
              
              {/* SECTION 1: Appearance & Page Color */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-white/60">Appearance</span>
                  <button 
                    onClick={() => {
                      // Cycle through default themes
                      if (theme === 'dark') setTheme('light');
                      else if (theme === 'light') setTheme('sepia');
                      else setTheme('dark');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs text-white"
                  >
                    <span>{theme === 'dark' ? '🌙 Dark mode' : theme === 'light' ? '☀️ Light mode' : theme === 'sepia' ? '🌾 Sepia mode' : '🎨 Custom mode'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-white/60 block">Page Color</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {COLOR_PRESETS.map((preset) => {
                      const isActive = currentTheme.bg.toLowerCase() === preset.hex.toLowerCase();
                      return (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => {
                            if (preset.hex === '#1E2128') setTheme('dark');
                            else if (preset.hex === '#FAF8F5') setTheme('light');
                            else if (preset.hex === '#F4ECD8') setTheme('sepia');
                            else {
                              setTheme('custom');
                              setCustomBgColor(preset.hex);
                            }
                          }}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative ${
                            isActive ? 'scale-110 shadow-lg' : 'hover:scale-105'
                          }`}
                          style={{ 
                            backgroundColor: preset.hex,
                            borderColor: isActive ? '#FF79B0' : 'rgba(255, 255, 255, 0.2)'
                          }}
                          title={preset.name}
                        >
                          {isActive && (
                            <Check className="w-4 h-4" style={{ color: preset.hex === '#FFFFFF' || preset.hex === '#FAF5EB' || preset.hex === '#F3F4F6' ? '#000000' : '#FFFFFF' }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-white/50">Custom hex:</span>
                    <input 
                      type="text" 
                      value={customBgColor} 
                      onChange={(e) => {
                        setCustomBgColor(e.target.value);
                        setTheme('custom');
                      }}
                      className="w-20 px-2 py-0.5 rounded bg-white/5 text-white/90 border border-white/10 text-[11px] focus:outline-none focus:border-white/20 font-mono"
                    />
                    <div className="relative w-5 h-5 rounded overflow-hidden border border-white/20 flex-shrink-0">
                      <input 
                        type="color" 
                        value={customBgColor.startsWith('#') && customBgColor.length === 7 ? customBgColor : '#1E2128'}
                        onChange={(e) => {
                          setCustomBgColor(e.target.value);
                          setTheme('custom');
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0 scale-150"
                      />
                      <div className="w-full h-full pointer-events-none" style={{ backgroundColor: customBgColor }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Font Style */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-white/60 block">Font Style</span>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS_LIST.map((f) => {
                    const isSelected = fontFamily === f.name;
                    return (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => setFontFamily(f.name)}
                        className="flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative"
                        style={{ 
                          borderColor: isSelected ? '#FF79B0' : 'rgba(255, 255, 255, 0.1)',
                          backgroundColor: isSelected ? 'rgba(255, 121, 176, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          fontFamily: FONT_MAP[f.name]
                        }}
                      >
                        <span className="text-xs font-semibold text-white">
                          {f.name}
                        </span>
                        <span className="text-[9px] opacity-50 text-white/70">
                          {f.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Font Size */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-white/60">Font Size</span>
                  <span className="text-xs font-mono text-white/90">{fontSize}px</span>
                </div>
                <input 
                  type="range"
                  min="14"
                  max="28"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF79B0]"
                />
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>14px</span>
                  <span>28px</span>
                </div>
              </div>

              {/* SECTION 4: Line Spacing */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-white/60">Line Spacing</span>
                  <span className="text-xs font-mono text-white/90">{lineHeight}</span>
                </div>
                <input 
                  type="range"
                  min="1.3"
                  max="2.4"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLineHeight(val);
                    setParagraphSpacing(val * 1.25);
                  }}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF79B0]"
                />
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>Compact</span>
                  <span>Airy</span>
                </div>
              </div>

              {/* SECTION 5: Page Width */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-white/60 block">Page Width</span>
                <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10">
                  {(['narrow', 'medium', 'wide', 'full'] as const).map((w) => {
                    const isSelected = pageWidth === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setPageWidth(w)}
                        className={`py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                          isSelected ? 'bg-[#FF79B0] text-slate-900 shadow' : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6: Infinite Scroll */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-white/60 block">Infinite Scroll</span>
                  <span className="text-[10px] text-white/40">
                    All chapters flow continuously
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInfiniteScroll(!infiniteScroll)}
                  className="w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5"
                  style={{ 
                    backgroundColor: infiniteScroll ? '#FF79B0' : 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div 
                    className={`w-4.5 h-4.5 rounded-full bg-slate-900 shadow transition-transform ${
                      infiniteScroll ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. CUSTOM CONFIRMATION MODAL */}
      {confirmDialog.isOpen && (
        <div id="custom-confirm-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            id="custom-confirm-modal-body"
            className="w-full max-w-sm rounded-2xl border p-6 flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 select-text"
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              color: currentTheme.text,
              borderColor: currentTheme.border
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              {confirmDialog.isDanger ? (
                <div className="p-2 rounded-full bg-rose-500/10 text-rose-500 flex-shrink-0 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 flex-shrink-0">
                  <Info className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold font-serif">{confirmDialog.title}</h3>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button 
                id="btn-confirm-cancel"
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: currentTheme.border }}
              >
                {confirmDialog.cancelText || "Cancel"}
              </button>
              <button 
                id="btn-confirm-execute"
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:brightness-115 transition-all shadow"
                style={{ 
                  backgroundColor: confirmDialog.isDanger ? '#f43f5e' : currentTheme.accent 
                }}
              >
                {confirmDialog.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CUSTOM FLOATING TOAST NOTIFICATION */}
      {notification.isOpen && (
        <div 
          id="custom-toast-notification" 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm max-w-sm animate-in slide-in-from-bottom-6 fade-in duration-200"
          style={{ 
            backgroundColor: currentTheme.cardBg, 
            color: currentTheme.text,
            borderColor: currentTheme.border
          }}
        >
          {notification.type === 'success' && (
            <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
          )}
          {notification.type === 'error' && (
            <div className="p-1 rounded-full bg-rose-500/15 text-rose-500 flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
          {notification.type === 'info' && (
            <div className="p-1 rounded-full bg-sky-500/15 text-sky-500 flex-shrink-0">
              <Info className="w-4 h-4" />
            </div>
          )}
          <span className="flex-1 font-medium text-xs leading-relaxed">{notification.message}</span>
          <button 
            id="close-toast-btn"
            onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))}
            className="p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
