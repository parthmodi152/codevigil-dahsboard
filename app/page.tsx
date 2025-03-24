"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GitBranch, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/shared/Header";
import { getFormattedDateAndDay } from "@/utils/formatters/dateFormatter";

interface Repository {
  owner: string;
  name: string;
  url: string;
}

// Loading skeleton component
const LoadingSkeleton = () => (
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
);

// Repository grid component
const RepositoryGrid = ({ repositories }: { repositories: Repository[] }) => (
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
);

// Empty state component
const EmptyState = () => (
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
);

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    // Get formatted date and day
    const { currentDate, currentDay } = getFormattedDateAndDay();
    setCurrentDate(currentDate);
    setCurrentDay(currentDay);

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
    <main>
      <Header currentDay={currentDay} currentDate={currentDate} type="home" />
      
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white px-2 py-1 border-l-4 border-blue-600">Your Repositories</h2>
      
      {loading ? (
        <LoadingSkeleton />
      ) : repositories.length > 0 ? (
        <RepositoryGrid repositories={repositories} />
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
