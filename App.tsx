import React, { useState, useEffect, useRef } from 'react';
import { RetroWindow, RetroButton, RetroInput, RetroTextArea, RetroCard, ProgressBar } from './components/RetroComponents';
import { geminiService } from './services/geminiService';
import { Message, ResearchResult, AppStage } from './types';
import { Globe, Mail } from 'lucide-react';

type IconProps = {
  size?: number;
  className?: string;
};

const Linkedin: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M7.5 8.5H4.5V19.5H7.5V8.5ZM6 4.5C5.03 4.5 4.25 5.28 4.25 6.25C4.25 7.22 5.03 8 6 8C6.97 8 7.75 7.22 7.75 6.25C7.75 5.28 6.97 4.5 6 4.5ZM19.5 13.28V19.5H16.5V13.75C16.5 12.25 16.47 10.31 14.4 10.31C12.3 10.31 12 11.95 12 13.64V19.5H9V8.5H11.88V10H11.92C12.32 9.25 13.3 8.44 14.8 8.44C17.92 8.44 19.5 10.4 19.5 13.28Z"
      fill="currentColor"
    />
  </svg>
);

const LIVE_SITE_URL = 'https://linkednet-98.netlify.app';
const REPOSITORY_URL = 'https://github.com/rohtheroos-84/linkednet-98';

const FOUNDER_LINKS: ReadonlyArray<{ label: string; href: string; Icon: React.FC<IconProps> }> = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rohitnagendran84/',
    Icon: Linkedin,
  },
  {
    label: 'Portfolio',
    href: 'https://rohit-builds.netlify.app',
    Icon: Globe as React.FC<IconProps>,
  },
  {
    label: 'Email',
    href: 'mailto:rohit84.official@gmail.com',
    Icon: Mail as React.FC<IconProps>,
  },
];

function App() {
  // State
  const [darkMode, setDarkMode] = useState(false);
  const [stage, setStage] = useState<AppStage>('intro');
  const [aboutReturnStage, setAboutReturnStage] = useState<AppStage>('intro');
  const [topic, setTopic] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [researchData, setResearchData] = useState<ResearchResult | null>(null);
  const [finalPost, setFinalPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');

  // Refs for auto-scrolling
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, stage]);

  // --- Handlers ---

  const handleStart = async () => {
    if (!topic.trim()) return;
    
    setStage('interview');
    setIsLoading(true);
    setLoadingText("Connecting to intelligent agent...");
    
    // Initial user message isn't displayed in chat flow as a bubble immediately, 
    // but acts as the seed. The AI will respond with a question.
    try {
      const response = await geminiService.startInterview(topic);
      setChatHistory([
        { role: 'model', content: response }
      ]);
    } catch (e) {
      alert("Failed to start. Check API Key.");
      setStage('intro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMsg: Message = { role: 'user', content: currentInput };
    setChatHistory(prev => [...prev, userMsg]);
    setCurrentInput('');
    setIsLoading(true);
    setLoadingText("Analyzing response...");

    try {
      const reply = await geminiService.sendReply(currentInput);
      setChatHistory(prev => [...prev, { role: 'model', content: reply }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrafting = async () => {
    setStage('researching');
    setIsLoading(true);
    
    // Step 1: Research
    setLoadingText("Dialing into World Wide Web for research...");
    let rData: ResearchResult | null = null;
    try {
      rData = await geminiService.performResearch(topic);
      setResearchData(rData);
    } catch (e) {
      console.error("Research failed, proceeding without it.");
    }

    // Step 2: Drafting (Deep Thinking)
    setStage('drafting');
    setLoadingText("AI is analyzing and drafting your post...");
    
    try {
      const draft = await geminiService.draftPost(topic, chatHistory, rData);
      setFinalPost(draft);
      setStage('review');
    } catch (e) {
      alert("Drafting failed.");
      setStage('interview'); // Go back
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPost);
    alert("Copied to clipboard!");
  };

  const openAbout = () => {
    if (stage === 'about') return;
    setAboutReturnStage(stage);
    setStage('about');
  };

  const closeAbout = () => {
    setStage(aboutReturnStage === 'about' ? 'intro' : aboutReturnStage);
  };

  // --- Render Helpers ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center px-4">
      <div className="mb-4">
        <h1 className="text-4xl sm:text-6xl font-pixel mb-2 text-retro-blue dark:text-retro-green animate-pulse">LinkedNet 98</h1>
        <p className="font-retro text-lg dark:text-white">Professional Posting Wizard</p>
      </div>
      
      <div className="w-full max-w-md bg-retro-gray p-1 shadow-retro-out dark:bg-retro-dark dark:border-2 dark:border-retro-green dark:shadow-none">
        <div className="bg-white border-2 border-gray-500 p-6 dark:bg-black dark:border-none">
          <label className="block text-left font-retro font-bold mb-2 dark:text-retro-green">
            What is your achievement or insight?
          </label>
          <RetroTextArea 
            placeholder="e.g. I just launched a new SaaS product and learned that marketing is harder than coding..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full h-32 mb-4 text-lg"
            disabled={isLoading}
          />
          <div className="flex flex-wrap justify-between gap-2">
             <RetroButton onClick={openAbout} disabled={isLoading}>
               About This Project
             </RetroButton>
             <RetroButton onClick={handleStart} disabled={isLoading || !topic}>
               {isLoading ? "Loading..." : "Start Wizard >"}
             </RetroButton>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="h-full overflow-y-auto scrollbar-retro pr-1">
      <div className="grid gap-3">
        <RetroCard>
          <h2 className="font-pixel text-2xl text-retro-blue dark:text-retro-green">About LinkedNet 98</h2>
          <p className="font-retro mt-2 text-sm sm:text-base dark:text-white">
            LinkedNet 98 is a Windows 98-inspired AI writing assistant that interviews you first,
            then drafts a specific and human-sounding LinkedIn post from your real experiences.
          </p>
        </RetroCard>

        <RetroCard>
          <h3 className="font-retro font-bold text-lg dark:text-retro-green">How It Works</h3>
          <ol className="font-retro mt-2 text-sm sm:text-base list-decimal list-inside space-y-1 dark:text-white">
            <li>Intro: You enter a topic, achievement, or insight.</li>
            <li>Interview: The AI asks one focused question at a time for detail and nuance.</li>
            <li>Research: The app gathers current context with Google Search grounding.</li>
            <li>Drafting: Gemini turns interview + research into a polished post.</li>
            <li>Review: You edit and copy the final version.</li>
          </ol>
        </RetroCard>

        <RetroCard>
          <h3 className="font-retro font-bold text-lg dark:text-retro-green">Creator</h3>
          <p className="font-retro mt-2 text-sm sm:text-base dark:text-white">
            Built by Rohit Nagendra Prasad. This project blends nostalgic interface design with a practical
            interview-first content workflow for modern LinkedIn writing.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {FOUNDER_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="inline-flex items-center gap-2 font-retro bg-retro-gray text-black border border-t-white border-l-white border-b-black border-r-black px-3 py-1 active:translate-y-px active:translate-x-px dark:bg-black dark:text-retro-green dark:border-retro-green dark:border-2"
              >
                <Icon size={16} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </RetroCard>

        <RetroCard>
          <h3 className="font-retro font-bold text-lg dark:text-retro-green">Project Links</h3>
          <div className="font-retro mt-2 text-sm sm:text-base space-y-1 dark:text-white">
            <p>
              Live app:{' '}
              <a href={LIVE_SITE_URL} target="_blank" rel="noopener noreferrer" className="text-retro-blue underline dark:text-blue-300">
                {LIVE_SITE_URL}
              </a>
            </p>
            <p>
              Repository:{' '}
              <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="text-retro-blue underline dark:text-blue-300">
                {REPOSITORY_URL}
              </a>
            </p>
          </div>
        </RetroCard>
      </div>

      <div className="flex justify-end mt-4">
        <RetroButton onClick={closeAbout}>
          &lt; Back
        </RetroButton>
      </div>
    </div>
  );

  const renderInterview = () => (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white border-2 border-gray-500 inset-0 shadow-inner mb-4 scrollbar-retro dark:bg-black dark:border-retro-green">
        <div className="text-center text-gray-500 text-sm font-retro mb-4 dark:text-gray-400">
          *** CONNECTED TO HOST ***
        </div>
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 font-retro text-sm sm:text-base shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-retro-green dark:text-black dark:border-none' 
                  : 'bg-gray-100 border-gray-300 text-black dark:bg-retro-dark dark:text-white dark:border-retro-green'
              }`}
            >
              <strong className="block mb-1 text-xs uppercase tracking-wider opacity-70">
                {msg.role === 'user' ? 'You' : 'Agent'}
              </strong>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-100 border border-gray-300 p-2 font-retro text-sm italic animate-pulse dark:bg-retro-dark dark:text-retro-green dark:border-retro-green">
               {loadingText}
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex flex-col gap-2 bg-retro-gray p-2 border-t-2 border-white dark:bg-retro-dark dark:border-retro-green">
        <div className="flex gap-2">
            <RetroInput 
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Type your answer here..."
              className="flex-grow"
              disabled={isLoading}
              autoFocus
            />
            <RetroButton onClick={handleSendMessage} disabled={isLoading || !currentInput}>
              Send
            </RetroButton>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-xs font-retro text-gray-600 dark:text-gray-400">
              Session active. Provide details for better results.
            </span>
            <RetroButton 
              onClick={handleDrafting} 
              disabled={isLoading || chatHistory.length < 2} // Require at least one Q&A
              className="bg-retro-blue text-white hover:bg-blue-800 dark:bg-retro-green dark:text-black dark:hover:bg-white"
            >
              Finish & Draft Post
            </RetroButton>
        </div>
      </div>
    </div>
  );

  const renderLoading = (message: string) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-full max-w-md bg-retro-gray border-2 border-white shadow-retro-out p-1 dark:bg-retro-dark dark:border-retro-green dark:shadow-none">
         <div className="bg-retro-blue text-white font-retro font-bold px-2 py-1 mb-4 text-left dark:bg-retro-green dark:text-black">
           System Processing
         </div>
         <div className="p-4 flex flex-col items-center">
            <img 
              src="https://picsum.photos/64/64?grayscale" 
              alt="loading" 
              className="w-16 h-16 mb-4 border border-black animate-spin" 
              style={{ animationDuration: '3s' }}
            />
            <p className="font-retro text-lg mb-2 dark:text-white">{message}</p>
            <ProgressBar progress={stage === 'researching' ? 45 : 80} />
            <p className="text-xs font-mono mt-2 text-gray-500 dark:text-gray-400">
                {stage === 'drafting' ? 'AI Model Processing...' : 'Searching Knowledge Base...'}
            </p>
         </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-2 border-gray-400 p-2 mb-2 shadow-inner overflow-y-auto flex-grow scrollbar-retro dark:bg-black dark:border-retro-green">
        <label className="block font-retro font-bold mb-2 text-gray-700 dark:text-retro-green">Generated Draft:</label>
        <textarea
           className="w-full h-full min-h-[300px] p-4 font-sans text-base leading-relaxed resize-none outline-none dark:bg-black dark:text-white"
           value={finalPost}
           onChange={(e) => setFinalPost(e.target.value)}
        />
      </div>

      {researchData && researchData.urls.length > 0 && (
        <RetroCard className="mb-2 p-2 max-h-32 overflow-y-auto">
          <p className="font-bold text-xs font-retro mb-1 dark:text-retro-green">Sources Used:</p>
          <ul className="list-disc list-inside text-xs font-retro text-blue-800 dark:text-blue-300">
            {researchData.urls.map((url, i) => (
              <li key={i} className="truncate">
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a>
              </li>
            ))}
          </ul>
        </RetroCard>
      )}

      <div className="flex flex-wrap gap-2 justify-end mt-2">
        <RetroButton onClick={() => setStage('interview')} variant="danger">
          &lt; Back to Chat
        </RetroButton>
        <RetroButton onClick={copyToClipboard} className="bg-retro-green text-black font-bold">
          Copy to Clipboard
        </RetroButton>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#008080] dark:bg-[#111] p-2 sm:p-4 md:p-8 flex items-center justify-center font-retro transition-colors duration-200">

      <div className="fixed top-4 left-4 z-50">
        {stage === 'about' ? (
          <RetroButton onClick={closeAbout} className="text-xs" disabled={isLoading}>
            &lt; Back
          </RetroButton>
        ) : (
          <RetroButton onClick={openAbout} className="text-xs" disabled={isLoading}>
            About
          </RetroButton>
        )}
      </div>
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <RetroButton onClick={() => setDarkMode(!darkMode)} className="text-xs">
          {darkMode ? '☀ Light Mode' : '☾ Dark Mode'}
        </RetroButton>
      </div>

      <RetroWindow 
        title={
           stage === 'intro' ? "Welcome to LinkedNet" : 
           stage === 'about' ? "About LinkedNet 98" :
           stage === 'interview' ? "Interview Session" :
           stage === 'review' ? "Post Editor" : "Processing..."
        } 
        className="w-full max-w-4xl h-[85vh] sm:h-[800px]"
      >
        {stage === 'intro' && renderIntro()}
        {stage === 'about' && renderAbout()}
        {stage === 'interview' && renderInterview()}
        {(stage === 'researching' || stage === 'drafting') && renderLoading(loadingText)}
        {stage === 'review' && renderReview()}
      </RetroWindow>

    </div>
  );
}

export default App;