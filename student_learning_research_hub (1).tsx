import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Key, 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Award, 
  BarChart3, 
  Layers, 
  Search, 
  ChevronRight, 
  Copy, 
  Download, 
  RefreshCw, 
  UserCheck, 
  Zap, 
  GraduationCap 
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // API Key & User State
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Student',
    major: 'Computer Science & AI',
    university: 'Stanford University',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  });

  // Local Storage simulation for notes, flashcards, quizzes & tasks
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('hub_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Neural Networks Overview', content: '# Neural Networks\n- Inputs & Weights\n- Activation Functions (ReLU, Sigmoid)\n- Backpropagation algorithm', date: '2026-11-01' },
      { id: 2, title: 'Quantum Computing Intro', content: '# Qubits vs Bits\n- Superposition\n- Entanglement\n- Quantum Logic Gates', date: '2026-11-04' }
    ];
  });

  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('hub_flashcards');
    return saved ? JSON.parse(saved) : [
      { id: 1, front: 'What is Backpropagation?', back: 'An algorithm used in artificial neural networks to calculate a gradient that is needed in the calculation of the weights to be used in the network.', category: 'AI Basics' },
      { id: 2, front: 'Define Quantum Superposition', back: 'A principle of quantum mechanics where a system can exist in multiple states simultaneously until measured.', category: 'Physics' }
    ];
  });

  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('hub_quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const [studyStats, setStudyStats] = useState({
    papersAnalyzed: 14,
    flashcardsMastered: 28,
    notesCreated: notes.length,
    studyHoursThisWeek: 16.5
  });

  // Init Key from Local Storage
  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
      setApiKey(stored);
      setSavedKey(stored);
    } else {
      setShowKeyModal(true);
    }
  }, []);

  const saveApiKeyHandler = (keyToSave) => {
    const trimmed = keyToSave.trim();
    setApiKey(trimmed);
    setSavedKey(trimmed);
    localStorage.setItem('gemini_api_key', trimmed);
    setShowKeyModal(false);
  };

  // Helper for Gemini API calls
  const callGeminiAPI = async (prompt, systemInstruction = "") => {
    const currentKey = savedKey || apiKey;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${currentKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    let retries = 3;
    let delay = 1000;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Header/Logo */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-wide">ScholarAI Hub</h1>
                <p className="text-xs text-indigo-400 font-medium">Student Learning & Research</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'research' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <BrainCircuit className="w-5 h-5" />
              <span>AI Research Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'notes' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Notes Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'flashcards' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span>Flashcard Deck</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'quizzes' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Quiz Builder</span>
            </button>
          </nav>
        </div>

        {/* API Key Status & Profile Bottom Info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/80 rounded-xl p-3 flex items-center justify-between border border-slate-700/50">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <Key className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200">Google AI Studio</p>
                <p className="text-[10px] text-slate-400 truncate">{savedKey ? 'Key Configured' : 'Missing API Key'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowKeyModal(true)}
              className="text-xs bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 px-2.5 py-1 rounded-lg border border-indigo-500/30 font-medium transition"
            >
              {savedKey ? 'Edit' : 'Setup'}
            </button>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <img src={userProfile.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-700" />
            <div className="truncate">
              <p className="text-sm font-semibold text-slate-200 truncate">{userProfile.name}</p>
              <p className="text-xs text-slate-400 truncate">{userProfile.university}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-xs text-slate-500">Empower your academic research and learning workflows</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-2 rounded-lg border border-slate-200 transition"
            >
              <Key className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">AI Studio Key</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
              {userProfile.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content Views */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView 
              studyStats={studyStats} 
              userProfile={userProfile} 
              setActiveTab={setActiveTab}
              notes={notes}
              flashcards={flashcards}
              hasApiKey={Boolean(savedKey)}
              openKeyModal={() => setShowKeyModal(true)}
            />
          )}

          {activeTab === 'research' && (
            <ResearchLabView 
              callGeminiAPI={callGeminiAPI} 
              hasApiKey={Boolean(savedKey)} 
              openKeyModal={() => setShowKeyModal(true)}
              onAddNote={(newNote) => setNotes([newNote, ...notes])}
            />
          )}

          {activeTab === 'notes' && (
            <NotesWorkspaceView 
              notes={notes} 
              setNotes={setNotes} 
              callGeminiAPI={callGeminiAPI}
              hasApiKey={Boolean(savedKey)}
              openKeyModal={() => setShowKeyModal(true)}
              onGenerateFlashcards={(cards) => {
                setFlashcards([...cards, ...flashcards]);
                setActiveTab('flashcards');
              }}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardDeckView 
              flashcards={flashcards} 
              setFlashcards={setFlashcards} 
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizBuilderView 
              quizzes={quizzes} 
              setQuizzes={setQuizzes} 
              notes={notes} 
              callGeminiAPI={callGeminiAPI}
              hasApiKey={Boolean(savedKey)}
              openKeyModal={() => setShowKeyModal(true)}
            />
          )}
        </div>
      </main>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Google AI Studio Setup</h3>
                  <p className="text-xs text-slate-500">Configure your API Key to enable AI Features</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              To utilize the AI Research Assistant, automatic flashcards, note summaries, and quiz generators, enter your API key from Google AI Studio.
            </p>

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 mb-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-900">
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <span>How to get your API key:</span>
              </div>
              <ol className="text-xs text-indigo-800 space-y-1 pl-5 list-decimal">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-medium hover:text-indigo-900">Google AI Studio</a></li>
                <li>Log in with your Google Account</li>
                <li>Click <strong>"Create API key"</strong></li>
                <li>Paste the copied key below</li>
              </ol>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Gemini API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => saveApiKeyHandler(apiKey)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/20 transition"
                >
                  Save API Key
                </button>
                {savedKey && (
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm py-2.5 px-4 rounded-xl transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 1. DASHBOARD VIEW
// ----------------------------------------------------------------------
function DashboardView({ studyStats, userProfile, setActiveTab, notes, flashcards, hasApiKey, openKeyModal }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Student Hub</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, {userProfile.name}!</h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Accelerate your academic work. Summarize complex research papers, generate interactive study materials, and keep your course notes organized.
          </p>
          
          {!hasApiKey && (
            <div className="pt-2">
              <button
                onClick={openKeyModal}
                className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl font-semibold text-xs transition shadow-md"
              >
                <Key className="w-4 h-4" />
                <span>Configure Google AI Studio API Key</span>
              </button>
            </div>
          )}
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{studyStats.papersAnalyzed}</p>
            <p className="text-xs text-slate-500 font-medium">Papers Summarized</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{flashcards.length}</p>
            <p className="text-xs text-slate-500 font-medium">Active Flashcards</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{notes.length}</p>
            <p className="text-xs text-slate-500 font-medium">Saved Notes</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{studyStats.studyHoursThisWeek}h</p>
            <p className="text-xs text-slate-500 font-medium">Study Session Time</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Tools */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span>Quick Launch Studio</span>
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('research')}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Analyze Research Paper</p>
                  <p className="text-xs text-slate-500">Extract insights, key findings & references</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">New Smart Note</p>
                  <p className="text-xs text-slate-500">Draft notes with instant AI concept expansions</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Generate Practice Quiz</p>
                  <p className="text-xs text-slate-500">Test knowledge from notes or custom topics</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
            </button>
          </div>
        </div>

        {/* Recent Notes Preview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Recent Academic Notes</span>
              </h3>
              <button 
                onClick={() => setActiveTab('notes')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View All
              </button>
            </div>

            {notes.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">No notes created yet. Head to the Notes Workspace!</p>
            ) : (
              <div className="space-y-3">
                {notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/60 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{note.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{note.content.replace(/#|\*/g, '')}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-md">
                      {note.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. AI RESEARCH LAB VIEW
// ----------------------------------------------------------------------
function ResearchLabView({ callGeminiAPI, hasApiKey, openKeyModal, onAddNote }) {
  const [activeResearchTab, setActiveResearchTab] = useState('summarizer');
  
  // Paper Summarizer Inputs
  const [paperText, setPaperText] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Concept Explainer Inputs
  const [conceptQuery, setConceptQuery] = useState('');
  const [targetAudience, setTargetAudience] = useState('Undergraduate');
  const [explanationResult, setExplanationResult] = useState(null);
  const [loadingConcept, setLoadingConcept] = useState(false);

  // Citation Generator Inputs
  const [citationTitle, setCitationTitle] = useState('');
  const [citationAuthors, setCitationAuthors] = useState('');
  const [citationYear, setCitationYear] = useState('');
  const [citationFormat, setCitationFormat] = useState('APA');
  const [citationResult, setCitationResult] = useState('');
  const [loadingCitation, setLoadingCitation] = useState(false);

  // Summarize Handler
  const handleSummarize = async () => {
    if (!hasApiKey) return openKeyModal();
    if (!paperText.trim()) return;

    setLoadingSummary(true);
    setSummaryResult(null);

    const prompt = `Analyze the following academic paper text/abstract. Provide a structured summary containing:
1. Executive Summary (2-3 sentences)
2. Core Research Problem & Methodology
3. Key Findings & Contributions
4. Critical Limitations or Future Directions

Paper Content:
${paperText}`;

    const systemInstruction = "You are an expert academic research assistant with deep expertise in scientific analysis, clarity, and precision.";

    try {
      const res = await callGeminiAPI(prompt, systemInstruction);
      setSummaryResult(res);
    } catch (err) {
      setSummaryResult(`Error generating summary: ${err.message}`);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Concept Explanation Handler
  const handleExplainConcept = async () => {
    if (!hasApiKey) return openKeyModal();
    if (!conceptQuery.trim()) return;

    setLoadingConcept(true);
    setExplanationResult(null);

    const prompt = `Explain the concept: "${conceptQuery}" for a student at the target level: ${targetAudience}.
Provide:
1. Clear Intuitive Definition
2. Real-world Analogy
3. Technical Explanation & Formula (if applicable)
4. 3 Common Misconceptions`;

    const systemInstruction = "You are a distinguished university professor known for extraordinarily clear, engaging explanations.";

    try {
      const res = await callGeminiAPI(prompt, systemInstruction);
      setExplanationResult(res);
    } catch (err) {
      setExplanationResult(`Error: ${err.message}`);
    } finally {
      setLoadingConcept(false);
    }
  };

  // Citation Generator Handler
  const handleGenerateCitation = async () => {
    if (!citationTitle.trim()) return;
    setLoadingCitation(true);

    const prompt = `Generate a standard academic citation in ${citationFormat} style for:
Title: ${citationTitle}
Authors: ${citationAuthors || 'Unknown Authors'}
Year: ${citationYear || 'n.d.'}

Return ONLY the formatted citation string followed by a short note if details were missing.`;

    try {
      const res = await callGeminiAPI(prompt);
      setCitationResult(res);
    } catch (err) {
      setCitationResult(`Error generating citation: ${err.message}`);
    } finally {
      setLoadingCitation(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveResearchTab('summarizer')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeResearchTab === 'summarizer' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Paper Summarizer & Analyzer
        </button>
        <button
          onClick={() => setActiveResearchTab('explainer')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeResearchTab === 'explainer' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Deep Concept Explainer
        </button>
        <button
          onClick={() => setActiveResearchTab('citation')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeResearchTab === 'citation' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Citation Generator
        </button>
      </div>

      {/* 1. Paper Summarizer */}
      {activeResearchTab === 'summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Paste Research Abstract or Paper Content</h3>
            <textarea
              rows={12}
              value={paperText}
              onChange={(e) => setPaperText(e.target.value)}
              placeholder="Paste research paper text, abstract, or methodology section here..."
              className="w-full p-3.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <button
              onClick={handleSummarize}
              disabled={loadingSummary || !paperText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
            >
              {loadingSummary ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing & Digesting Paper...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Academic Analysis</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-base">Analysis Output</h3>
                {summaryResult && (
                  <button
                    onClick={() => {
                      onAddNote({
                        id: Date.now(),
                        title: 'Paper Summary Note',
                        content: summaryResult,
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save to Notes</span>
                  </button>
                )}
              </div>

              {!summaryResult && !loadingSummary && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl p-6">
                  <BrainCircuit className="w-10 h-10 text-slate-300" />
                  <p className="text-xs text-center font-medium">Summary results will be formatted here with structured findings and key methodology takeaways.</p>
                </div>
              )}

              {loadingSummary && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                  <p className="text-xs font-semibold">Gemini is synthesizing paper insights...</p>
                </div>
              )}

              {summaryResult && (
                <div className="prose prose-slate prose-sm max-w-none max-h-[450px] overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {summaryResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Deep Concept Explainer */}
      {activeResearchTab === 'explainer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Explain Complex Concept</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Concept or Topic Name</label>
              <input
                type="text"
                value={conceptQuery}
                onChange={(e) => setConceptQuery(e.target.value)}
                placeholder="e.g. Fourier Transform, Gradient Descent, P vs NP"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Level Target</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="High School">High School / Introductory</option>
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Graduate / Researcher">Graduate / PhD Researcher</option>
              </select>
            </div>

            <button
              onClick={handleExplainConcept}
              disabled={loadingConcept || !conceptQuery.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              {loadingConcept ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Explanation...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  <span>Break Down Concept</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-4">Breakdown & Breakdown</h3>

            {!explanationResult && !loadingConcept && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-6">
                <HelpCircle className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs text-center">Get clear definitions, analogies, and mathematical intuitions.</p>
              </div>
            )}

            {loadingConcept && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="text-xs font-semibold">Structuring multi-level explanation...</p>
              </div>
            )}

            {explanationResult && (
              <div className="prose prose-slate prose-sm max-w-none max-h-[450px] overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                {explanationResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Citation Generator */}
      {activeResearchTab === 'citation' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 text-base">Instant Citation Generator</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Paper or Book Title</label>
              <input
                type="text"
                value={citationTitle}
                onChange={(e) => setCitationTitle(e.target.value)}
                placeholder="Attention Is All You Need"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Author(s)</label>
              <input
                type="text"
                value={citationAuthors}
                onChange={(e) => setCitationAuthors(e.target.value)}
                placeholder="Vaswani, A., Shazeer, N., et al."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Year</label>
              <input
                type="text"
                value={citationYear}
                onChange={(e) => setCitationYear(e.target.value)}
                placeholder="2017"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Citation Style Standard</label>
              <div className="grid grid-cols-4 gap-2">
                {['APA', 'MLA', 'Chicago', 'IEEE'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCitationFormat(style)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      citationFormat === style
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateCitation}
            disabled={loadingCitation || !citationTitle.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition"
          >
            {loadingCitation ? 'Formatting Citation...' : 'Generate Format Citation'}
          </button>

          {citationResult && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 relative group">
              <p className="text-xs text-slate-400 font-mono">Formatted {citationFormat}:</p>
              <p className="text-sm font-mono select-all">{citationResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. NOTES WORKSPACE VIEW
// ----------------------------------------------------------------------
function NotesWorkspaceView({ notes, setNotes, callGeminiAPI, hasApiKey, openKeyModal, onGenerateFlashcards }) {
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  const [isAiExpanding, setIsAiExpanding] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      date: new Date().toISOString().split('T')[0]
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (activeNoteId === id) {
      setActiveNoteId(filtered[0]?.id || null);
    }
  };

  const handleUpdateActiveNote = (field, value) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, [field]: value } : n));
  };

  // AI Assistant in Notes: Expand concepts
  const handleAiExpandNote = async () => {
    if (!hasApiKey) return openKeyModal();
    if (!activeNote || !activeNote.content.trim()) return;

    setIsAiExpanding(true);

    const prompt = `Here are my study notes on "${activeNote.title}":
${activeNote.content}

Expand these notes with key academic insights, bullet points of critical context, and 2 summary study questions. Format in Markdown.`;

    try {
      const expansion = await callGeminiAPI(prompt, "You are a smart note-taking copilot for academic research.");
      handleUpdateActiveNote('content', activeNote.content + "\n\n--- AI Expansion ---\n" + expansion);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiExpanding(false);
    }
  };

  // Generate Flashcards from active note
  const handleGenerateCardsFromNote = async () => {
    if (!hasApiKey) return openKeyModal();
    if (!activeNote || !activeNote.content.trim()) return;

    setIsAiExpanding(true);

    const prompt = `Extract 3 flashcards from these study notes:
${activeNote.content}

Format response EXACTLY as JSON array with properties 'front', 'back', 'category'. Do not include markdown code block syntax.`;

    try {
      const res = await callGeminiAPI(prompt);
      // clean output
      const clean = res.replace(/```json|```/g, '').trim();
      const parsedCards = JSON.parse(clean);
      const formatted = parsedCards.map((c, i) => ({
        id: Date.now() + i,
        front: c.front,
        back: c.back,
        category: c.category || activeNote.title
      }));
      onGenerateFlashcards(formatted);
    } catch (err) {
      alert("Could not automatically format flashcards. Try again with more content.");
    } finally {
      setIsAiExpanding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[720px]">
      {/* Sidebar List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-slate-800 text-sm">Study Notes ({notes.length})</h3>
            <button
              onClick={handleCreateNote}
              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[600px]">
            {notes.map((n) => (
              <div
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                className={`p-3.5 rounded-xl cursor-pointer border transition flex justify-between items-start ${
                  activeNoteId === n.id
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="truncate">
                  <h4 className="text-sm font-bold truncate">{n.title || 'Untitled'}</h4>
                  <p className="text-xs text-slate-400 mt-1">{n.date}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(n.id);
                  }}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note Content Editor */}
      <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
        {activeNote ? (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 pb-3 border-b border-slate-100">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateActiveNote('title', e.target.value)}
                placeholder="Note Title..."
                className="text-xl font-bold text-slate-800 outline-none w-full bg-transparent"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAiExpandNote}
                  disabled={isAiExpanding}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Enrich</span>
                </button>
                <button
                  onClick={handleGenerateCardsFromNote}
                  disabled={isAiExpanding}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Make Flashcards</span>
                </button>
              </div>
            </div>

            <textarea
              value={activeNote.content}
              onChange={(e) => handleUpdateActiveNote('content', e.target.value)}
              placeholder="Write Markdown notes here..."
              className="flex-1 w-full p-2 text-sm text-slate-800 outline-none resize-none font-mono leading-relaxed"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm">Select or create a note to begin editing.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. FLASHCARD DECK VIEW
// ----------------------------------------------------------------------
function FlashcardDeckView({ flashcards, setFlashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New Flashcard state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const currentCard = flashcards[currentIndex];

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard = {
      id: Date.now(),
      front: newFront,
      back: newBack,
      category: newCategory
    };

    setFlashcards([newCard, ...flashcards]);
    setNewFront('');
    setNewBack('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive Flashcard Player */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
              {currentCard ? currentCard.category : 'Deck Empty'}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {flashcards.length > 0 ? `${currentIndex + 1} / ${flashcards.length}` : '0 / 0'}
            </span>
          </div>

          {currentCard ? (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-80 bg-slate-900 text-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl transition-all duration-300 transform hover:scale-[1.01] relative"
            >
              <p className="text-xs text-indigo-400 font-mono mb-4 uppercase tracking-wider">
                {isFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Flip)'}
              </p>
              <p className="text-lg sm:text-xl font-medium leading-relaxed max-w-lg">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              <span className="absolute bottom-4 text-[10px] text-slate-500">Tap anywhere to flip card</span>
            </div>
          ) : (
            <div className="w-full h-80 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
              <p className="text-xs">No flashcards in your study deck yet.</p>
            </div>
          )}

          {/* Controls */}
          {flashcards.length > 0 && (
            <div className="flex items-center space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition"
              >
                Previous
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition shadow-md"
              >
                Flip Card
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Card Creation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-base">Add New Flashcard</h3>
        <form onSubmit={handleAddCard} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Front (Question / Prompt)</label>
            <textarea
              rows={2}
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="e.g. What is the Big O complexity of QuickSort?"
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Back (Answer)</label>
            <textarea
              rows={3}
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              placeholder="e.g. Average: O(n log n), Worst case: O(n²)"
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Category</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Algorithms"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition"
          >
            Add to Active Deck
          </button>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. QUIZ BUILDER VIEW
// ----------------------------------------------------------------------
function QuizBuilderView({ quizzes, setQuizzes, notes, callGeminiAPI, hasApiKey, openKeyModal }) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  const handleGenerateQuiz = async () => {
    if (!hasApiKey) return openKeyModal();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setActiveQuiz(null);
    setQuizScore(null);
    setUserAnswers({});

    const prompt = `Generate a ${numQuestions}-question multiple choice quiz on the topic: "${topic}".
Format output strictly as JSON array of objects with keys:
- 'question': string
- 'options': array of 4 string choices
- 'answerIndex': integer index (0-3) of correct choice
Do NOT include markdown syntax around the JSON output.`;

    try {
      const res = await callGeminiAPI(prompt);
      const clean = res.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      const quizObj = {
        id: Date.now(),
        topic,
        questions: parsed
      };

      setActiveQuiz(quizObj);
      setQuizzes([quizObj, ...quizzes]);
    } catch (err) {
      alert("Failed to build quiz. Please check topic or API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quiz Setup Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-base">Generate Knowledge Check</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Study Subject / Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Organic Chemistry Reactions"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Questions</label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value={3}>3 Questions</option>
            <option value={5}>5 Questions</option>
          </select>
        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={isGenerating || !topic.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Test...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Create Practice Quiz</span>
            </>
          )}
        </button>
      </div>

      {/* Active Quiz Area */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        {activeQuiz ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-lg">{activeQuiz.topic} Quiz</h3>
              {quizScore !== null && (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Score: {quizScore} / {activeQuiz.questions.length}
                </span>
              )}
            </div>

            <div className="space-y-6">
              {activeQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
                  <p className="text-sm font-semibold text-slate-800">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[qIdx] === optIdx;
                      const isCorrect = q.answerIndex === optIdx;
                      let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";

                      if (quizScore !== null) {
                        if (isCorrect) btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                        else if (isSelected) btnStyle = "bg-red-100 border-red-400 text-red-900";
                      } else if (isSelected) {
                        btnStyle = "bg-indigo-600 text-white border-indigo-600";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (quizScore === null) {
                              setUserAnswers({ ...userAnswers, [qIdx]: optIdx });
                            }
                          }}
                          className={`p-3 text-xs text-left rounded-xl border transition ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {quizScore === null && (
              <button
                onClick={handleSubmitQuiz}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Submit Answers
              </button>
            )}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <Sparkles className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-xs">Enter a topic on the left to generate an instant interactive quiz.</p>
          </div>
        )}
      </div>
    </div>
  );
}