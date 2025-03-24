import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import TrendIndicator from "@/components/shared/TrendIndicator";
import { formatTime } from "@/utils/formatters/timeFormatter";

interface Metric {
  total_prs: number;
  reviewed_prs: number;
  merged_prs: number;
  median_merge_time_seconds: number;
  median_review_turnaround_seconds: number;
  period: string;
}

interface StatCardsProps {
  metrics: Metric[];
  prTrend: 'up' | 'down' | 'unchanged';
  mergeTimeTrend: 'up' | 'down' | 'unchanged';
  reviewTrend: 'up' | 'down' | 'unchanged';
}

export const StatCards: React.FC<StatCardsProps> = ({
  metrics,
  prTrend,
  mergeTimeTrend,
  reviewTrend,
}) => {
  const currentMetric = metrics[0] || { 
    total_prs: 0, 
    median_merge_time_seconds: 0, 
    median_review_turnaround_seconds: 0 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-700 dark:text-slate-200">
            Pull Requests
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Latest period metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold flex items-center text-blue-600 dark:text-blue-400">
            {currentMetric.total_prs}
            <TrendIndicator trend={prTrend} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            merged
          </p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-700 dark:text-slate-200">
            Median Merge Time
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Time from creation to merge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold flex items-center text-indigo-600 dark:text-indigo-400">
            {formatTime(currentMetric.median_merge_time_seconds)}
            <TrendIndicator trend={mergeTimeTrend} isPositive={false} />
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-700 dark:text-slate-200">
            Review Turnaround
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Time to first review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold flex items-center text-violet-600 dark:text-violet-400">
            {formatTime(currentMetric.median_review_turnaround_seconds)}
            <TrendIndicator trend={reviewTrend} isPositive={false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards; 