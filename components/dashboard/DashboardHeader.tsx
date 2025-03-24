import React from "react";
import Link from "next/link";
import { GitBranch, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardHeaderProps {
  owner: string | null;
  repo: string | null;
  currentDay: string;
  currentDate: string;
  aggregation: string;
  onAggregationChange: (value: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  owner,
  repo,
  currentDay,
  currentDate,
  aggregation,
  onAggregationChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-600 text-white rounded-full">
          <GitBranch className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CodeVigil</h1>
          <h2 className="text-xl text-slate-600 dark:text-slate-300">
            {owner}/{repo}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{currentDay}, {currentDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Select value={aggregation} onValueChange={onAggregationChange}>
          <SelectTrigger className="w-[180px] border-slate-300 dark:border-slate-600">
            <SelectValue placeholder="Select aggregation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
        <Link href="/">
          <Button variant="outline" className="border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Repositories
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader; 