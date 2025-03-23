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

  useEffect(() => {
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
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <GitBranch className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">CodeVigil</h1>
          </div>
          <Link href="/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Repository
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
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
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {repo.owner}/{repo.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground truncate">
                      {repo.url}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">No repositories found</h2>
              <p className="text-muted-foreground mb-4">
                Start by adding your first repository
              </p>
              <Link href="/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Repository
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
