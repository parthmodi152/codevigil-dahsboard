"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, ArrowLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFormattedDateAndDay } from "@/utils/formatters/dateFormatter";
import Header from "@/components/shared/Header";

// Repository form component
const RepositoryForm = ({ 
  repoUrl, 
  setRepoUrl, 
  isValid, 
  validateUrl, 
  errorMessage, 
  loading, 
  handleSubmit 
}: {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  isValid: boolean;
  validateUrl: (url: string) => boolean;
  errorMessage: string;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) => (
  <Card className="max-w-2xl mx-auto border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
    <CardHeader>
      <CardTitle className="text-slate-700 dark:text-slate-200">Repository Details</CardTitle>
      <CardDescription className="text-slate-500 dark:text-slate-400">
        Enter the URL of a GitHub repository to start tracking its metrics
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="repoUrl" className="text-slate-700 dark:text-slate-200">GitHub Repository URL</Label>
          <Input
            id="repoUrl"
            type="url"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => {
              setRepoUrl(e.target.value);
              if (!isValid) validateUrl(e.target.value);
            }}
            className={`border-slate-300 dark:border-slate-600 ${!isValid ? 'border-red-500 dark:border-red-500' : ''}`}
            required
          />
          {!isValid && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Repository...
            </div>
          ) : "Add Repository"}
        </Button>
      </form>
    </CardContent>
  </Card>
);

export default function AddRepository() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();
  
  // Get formatted date and day using the shared utility
  const { currentDate, currentDay } = getFormattedDateAndDay();

  const validateUrl = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/;
    if (!url) {
      setIsValid(false);
      setErrorMessage("Please enter a repository URL");
      return false;
    } else if (!githubRegex.test(url)) {
      setIsValid(false);
      setErrorMessage("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
      return false;
    }
    setIsValid(true);
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(repoUrl)) {
      return;
    }
    
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
        description: error instanceof Error ? error.message : "Failed to add repository. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header currentDay={currentDay} currentDate={currentDate} type="add" />
      
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white px-2 py-1 border-l-4 border-blue-600">Add New Repository</h2>
      
      <Card className="mx-auto max-w-2xl shadow-md">
        <RepositoryForm
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          isValid={isValid}
          validateUrl={validateUrl}
          errorMessage={errorMessage}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </Card>
    </main>
  );
}
