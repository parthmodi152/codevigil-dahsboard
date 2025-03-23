"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AddRepository() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/repositories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast({
          title: "Repository added successfully",
          description: `Added ${data.repository.owner}/${data.repository.name}`,
        });
        router.push("/");
      } else {
        throw new Error(data.message || "Failed to add repository");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add repository. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <GitBranch className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">CodeVigil</h1>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Repositories
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                <Input
                  id="repoUrl"
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                  pattern="https://github\.com/[^/]+/[^/]+"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Repository"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
