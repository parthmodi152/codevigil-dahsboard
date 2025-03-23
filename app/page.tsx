"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GitBranch, Plus } from "lucide-react";
import Link from "next/link";

interface Repository {
  owner: string;
  name: string;
  url: string;
}

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    // Set current day and date
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    setCurrentDay(days[now.getDay()]);
    setCurrentDate(`${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);

    const fetchRepositories = async () => {
      try {
        const response = await fetch("/api/repositories");
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-full">
              <GitBranch className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CodeVigil</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{currentDay}, {currentDate}</p>
            </div>
          </div>
          <Link href="/add">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Repository
            </Button>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white px-2 py-1 border-l-4 border-blue-600">Your Repositories</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : repositories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repositories.map((repo) => (
              <Link
                key={`${repo.owner}/${repo.name}`}
                href={`/dashboard?owner=${repo.owner}&repo=${repo.name}`}
              >
                <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-700 dark:text-slate-200 flex items-center">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-md mr-2">
                        <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      {repo.owner}/{repo.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {repo.url}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8 border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
            <CardContent>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full inline-flex mb-4">
                <GitBranch className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">No repositories found</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Start by adding your first repository to track its metrics
              </p>
              <Link href="/add">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Repository
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Footer with GitHub link */}
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
      </div>
    </main>
  );
}
