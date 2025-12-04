================================================================================
                            L I N K E D N E T   9 8
================================================================================

                    Professional Posting Wizard v1.0
                    Copyright (c) 2025 LinkedNet Corp.
                    All Rights Reserved.

================================================================================

OVERVIEW
--------

LinkedNet 98 is a nostalgic Windows 98-inspired web application that 
revolutionizes LinkedIn content creation. Instead of struggling with generic 
AI-generated posts, this intelligent wizard interviews you to extract the 
real story behind your achievements, then crafts a compelling, authentic 
LinkedIn post that sounds genuinely human.

FEATURES
--------
[*] AI-Powered Interview
    An expert investigative journalist persona asks probing questions to 
    extract specific details, metrics, emotions, and insights

[*] Real-Time Research
    Leverages Google Search integration to ground your posts in current 
    trends and relevant context

[*] Deep Thinking Mode
    Uses Gemini's thinking model with 32k token budget for sophisticated 
    content synthesis

[*] Retro UI/UX
    Beautiful Windows 98 aesthetic with dark/light mode support

[*] Editable Drafts
    Review and refine generated content before publishing

[*] One-Click Copy
    Instantly copy your polished post to clipboard

================================================================================

TECHNICAL SPECIFICATIONS
-------------------------

Frontend Framework....... React 19.2 + TypeScript
Build Tool............... Vite 6.2
Styling.................. Tailwind CSS (CDN)
AI Provider.............. Google Generative AI (@google/genai)

AI Models:
  * gemini-3-pro-preview - Interview & drafting with deep thinking
  * gemini-2.5-flash - Fast web research with Google Search tool

================================================================================

SYSTEM REQUIREMENTS
-------------------

* Node.js (v16 or higher)
* npm or yarn
* Google Gemini API Key (REQUIRED)

================================================================================

INSTALLATION INSTRUCTIONS
--------------------------

STEP 1: Clone the repository
        > git clone <repository-url>
        > cd linkednet-98

STEP 2: Install dependencies
        > npm install

STEP 3: Set up environment variables
        Create a .env file in the root directory:
        
        GEMINI_API_KEY=your_actual_api_key_here
        
        NOTE: Get your API key from Google AI Studio
              https://makersuite.google.com/app/apikey

STEP 4: Start the development server
        > npm run dev

STEP 5: Open your browser
        Navigate to: http://localhost:3000

================================================================================

HOW IT WORKS
------------

The 4-Stage Process:

  [STAGE 1: INTRO]
    User describes their achievement/topic
    
  [STAGE 2: INTERVIEW]
    AI asks targeted questions to extract details
    User provides specific answers (metrics, emotions, conflicts)
    
  [STAGE 3: RESEARCH & DRAFTING]
    Web research for current trends/context
    Deep thinking synthesis (32k token budget)
    
  [STAGE 4: REVIEW]
    Edit, refine, and copy the final post

Architecture Overview:

  App.tsx
    |-- Stage Management (intro -> interview -> researching -> drafting -> review)
    |-- State Management (React hooks)
    \-- UI Rendering (retro components)

  services/geminiService.ts
    |-- Interview Mode (gemini-3-pro-preview)
    |-- Research Mode (gemini-2.5-flash + Google Search)
    \-- Drafting Mode (gemini-3-pro-preview + thinking config)

  components/RetroComponents.tsx
    |-- RetroWindow
    |-- RetroButton
    |-- RetroInput
    |-- RetroTextArea
    |-- RetroCard
    \-- ProgressBar

================================================================================

DESIGN PHILOSOPHY
-----------------

Anti-AI-ism:
  The system is specifically designed to avoid generic AI-generated content:
  
  [X] No "delve", "tapestry", "landscape", "game-changer"
  [X] No excessive emojis or em-dashes
  [√] Hook-driven but not clickbaity
  [√] Conversational and authentic
  [√] Specific metrics and real details

Interview-First Approach:
  Unlike typical AI writing tools, LinkedNet 98:
  
  1. Asks one question at a time
  2. Probes for specifics (numbers, emotions, conflicts)
  3. Extracts contrarian views and "aha moments"
  4. Gathers context before writing anything

================================================================================

AVAILABLE COMMANDS
------------------

Command                    Description
-------------------------------------------------------------------------------
npm run dev                Start development server (port 3000)
npm run build              Build for production
npm run preview            Preview production build

================================================================================

RETRO UI FEATURES
-----------------

[*] Windows 98 window chrome with title bars
[*] 3D beveled buttons with shadow effects
[*] Classic scrollbars with retro styling
[*] Terminal-inspired dark mode (green-on-black)
[*] Pixel fonts (VT323) for headers
[*] Monospace fonts (Courier Prime) for body text
[*] Responsive design for mobile and desktop

================================================================================

ENVIRONMENT VARIABLES
---------------------

Variable                   Description                           Required
-------------------------------------------------------------------------------
GEMINI_API_KEY             Google Gemini API key for AI features    [YES]

NOTE: The Vite config aliases this to both process.env.API_KEY and 
      process.env.GEMINI_API_KEY for compatibility.

================================================================================

DIRECTORY STRUCTURE
-------------------

linkednet-98/
|
+-- components/
|   \-- RetroComponents.tsx ......... Reusable UI components
|
+-- services/
|   \-- geminiService.ts ............ AI service wrapper
|
+-- App.tsx ......................... Main application logic
+-- index.tsx ....................... React entry point
+-- index.html ...................... HTML template with Tailwind
+-- types.ts ........................ TypeScript interfaces
+-- vite.config.ts .................. Vite configuration
+-- tsconfig.json ................... TypeScript configuration
+-- package.json .................... Dependencies
+-- metadata.json ................... App metadata
\-- README.md ....................... This file

================================================================================

TROUBLESHOOTING
---------------

PROBLEM: API Key Issues
SOLUTION:
  * Ensure GEMINI_API_KEY is set in .env file
  * Verify the key is valid at Google AI Studio
    (https://makersuite.google.com/app/apikey)
  * Restart the dev server after adding the key

PROBLEM: Build Errors
SOLUTION:
  * Delete node_modules and reinstall: npm install
  * Clear Vite cache: npx vite --force

PROBLEM: Styling Issues
SOLUTION:
  * Check that Tailwind CSS CDN is loading in index.html
  * Verify dark mode toggle is working properly

================================================================================

CONTRIBUTING
------------

Contributions are welcome! Areas for improvement:

  * Additional AI model support
  * More retro UI themes (Windows 95, Mac OS 9, etc.)
  * Export formats (PDF, Markdown, etc.)
  * Post scheduling integrations
  * Analytics and engagement tracking

================================================================================

ACKNOWLEDGMENTS
---------------

* Google Gemini AI for powerful language models
* Tailwind CSS for utility-first styling
* React Team for the amazing framework
* Windows 98 for the nostalgic inspiration

================================================================================

                  Built with passion and 90s nostalgia
          "Because the best LinkedIn posts come from real 
                    conversations, not prompts"

================================================================================
                         End of Documentation
================================================================================
