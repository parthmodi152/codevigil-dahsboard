import React from "react";

export const Footer = () => (
  <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-700 text-center">
    <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
      <span>Created by Parth Modi</span>
      <a 
        href="https://github.com/parthmodi152" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </svg>
        GitHub
      </a>
    </div>
    <div className="mt-2 text-sm text-slate-500 dark:text-slate-500">
      © {new Date().getFullYear()} CodeVigil - GitHub Repository Analytics
    </div>
  </footer>
);

export default Footer; 