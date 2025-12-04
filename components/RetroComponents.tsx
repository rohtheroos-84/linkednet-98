import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger';
}

export const RetroButton: React.FC<RetroButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "font-retro text-sm sm:text-base px-4 py-1 sm:py-2 active:shadow-retro-in shadow-retro-out transition-transform active:translate-y-px active:translate-x-px focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 select-none";
  
  // In dark mode, we invert the colors to look like a terminal or high contrast mode
  const lightColors = "bg-retro-gray text-black border border-t-white border-l-white border-b-black border-r-black";
  const darkColors = "dark:bg-retro-dark dark:text-retro-green dark:border-retro-green dark:shadow-none dark:border-2 dark:hover:bg-retro-green dark:hover:text-black";

  return (
    <button 
      className={`${baseStyle} ${lightColors} ${darkColors} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const RetroWindow: React.FC<{ title: string; children: React.ReactNode; className?: string; onClose?: () => void }> = ({ title, children, className = '', onClose }) => {
  return (
    <div className={`bg-retro-gray shadow-retro-out p-1 flex flex-col dark:bg-black dark:border-2 dark:border-retro-green dark:shadow-none ${className}`}>
      <div className="bg-retro-blue px-2 py-1 flex justify-between items-center select-none dark:bg-retro-green">
        <span className="text-white font-bold font-retro text-sm sm:text-lg dark:text-black">{title}</span>
        {onClose && (
          <button onClick={onClose} className="bg-retro-gray text-black font-bold px-1.5 shadow-retro-out active:shadow-retro-in text-xs leading-none w-5 h-5 flex items-center justify-center dark:bg-black dark:text-retro-green dark:border dark:border-retro-green">
            ×
          </button>
        )}
      </div>
      <div className="p-2 sm:p-4 flex-grow flex flex-col h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export const RetroInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input 
      {...props}
      className={`font-retro bg-white shadow-retro-in px-2 py-1 outline-none focus:bg-yellow-100 dark:bg-black dark:text-retro-green dark:border-2 dark:border-retro-green dark:shadow-none dark:focus:bg-retro-dark ${props.className || ''}`}
    />
  );
};

export const RetroTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return (
    <textarea 
      {...props}
      className={`font-retro bg-white shadow-retro-in px-2 py-1 outline-none resize-none focus:bg-yellow-100 scrollbar-retro dark:bg-black dark:text-retro-green dark:border-2 dark:border-retro-green dark:shadow-none dark:focus:bg-retro-dark ${props.className || ''}`}
    />
  );
};

export const RetroCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border-2 border-gray-400 p-2 shadow-inner dark:bg-retro-dark dark:border-retro-green ${className}`}>
        {children}
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="h-4 sm:h-6 bg-white shadow-retro-in p-0.5 w-full mt-2 dark:bg-black dark:border dark:border-retro-green">
      <div 
        className="h-full bg-retro-blue dark:bg-retro-green transition-all duration-300 flex items-center justify-center" 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        {/* Pattern overlay for loading bar effect */}
        <div className="w-full h-full opacity-20 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')]"></div>
      </div>
    </div>
  );
}