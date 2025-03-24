"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitBranch, ArrowLeft, ArrowUp, ArrowDown, Minus, Github } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";

interface Metric {
  total_prs: number;
  reviewed_prs: number;
  merged_prs: number;
  median_merge_time: string;
  median_merge_time_seconds: number;
  median_review_turnaround: string;
  median_review_turnaround_seconds: number;
  start_date: string;
  end_date: string;
  period: string;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [aggregation, setAggregation] = useState("weekly");
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
    
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Updated API endpoint URL as per user's correction
        const response = await fetch(
          `/api/repositories/${owner}/${repo}/metrics?aggregation=${aggregation}`
        );
        const data = await response.json();
        setMetrics(data.metrics || []);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (owner && repo) {
      fetchMetrics();
    }
  }, [owner, repo, aggregation]);

  // Format time in hours and minutes
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Calculate average review turnaround time for reference line
  const avgReviewTurnaround = metrics.length > 0
    ? metrics.reduce((sum, metric) => sum + metric.median_review_turnaround_seconds, 0) / metrics.length
    : 0;

  // Calculate average merge time for reference line
  const avgMergeTime = metrics.length > 0
    ? metrics.reduce((sum, metric) => sum + metric.median_merge_time_seconds, 0) / metrics.length
    : 0;

  // Calculate trends (comparing current period with previous period)
  const getTrend = (current: number, previous: number) => {
    if (current === previous) return "unchanged";
    return current > previous ? "up" : "down";
  };

  // Get trend indicators for metrics
  const getTrendIndicator = (trend: string, isPositive: boolean = true) => {
    if (trend === "unchanged") {
      return <Minus className="h-4 w-4 text-gray-500 ml-2" />;
    } else if ((trend === "up" && isPositive) || (trend === "down" && !isPositive)) {
      return <ArrowUp className="h-4 w-4 text-emerald-500 ml-2" />;
    } else {
      return <ArrowDown className="h-4 w-4 text-rose-500 ml-2" />;
    }
  };

  // Calculate trends if we have at least 2 periods of data
  const prTrend = metrics.length >= 2 ? getTrend(metrics[0]?.total_prs, metrics[1]?.total_prs) : "unchanged";
  const mergeTimeTrend = metrics.length >= 2 ? getTrend(metrics[0]?.median_merge_time_seconds, metrics[1]?.median_merge_time_seconds) : "unchanged";
  const reviewTrend = metrics.length >= 2 ? getTrend(metrics[0]?.median_review_turnaround_seconds, metrics[1]?.median_review_turnaround_seconds) : "unchanged";

  // Custom formatter for tooltips
  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      return [`${hours}h ${minutes}m`, 'Review Time'];
    }
    return ['0h 0m', 'Review Time'];
  };

  // Custom formatter for merge time tooltips
  const formatMergeTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      return [`${hours}h ${minutes}m`, 'Merge Time'];
    }
    return ['0h 0m', 'Merge Time'];
  };

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
              <h2 className="text-xl text-slate-600 dark:text-slate-300">
                {owner}/{repo}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{currentDay}, {currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={aggregation} onValueChange={setAggregation}>
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white px-2 py-1 border-l-4 border-blue-600">Today's Stats</h2>
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
                    {metrics[0]?.total_prs || 0}
                    {getTrendIndicator(prTrend)}
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
                    {formatTime(metrics[0]?.median_merge_time_seconds || 0)}
                    {getTrendIndicator(mergeTimeTrend, false)}
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
                    {formatTime(metrics[0]?.median_review_turnaround_seconds || 0)}
                    {getTrendIndicator(reviewTrend, false)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* New Code Review Turnaround Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center">
                    <div className="p-1 bg-indigo-100 dark:bg-indigo-900 rounded-md mr-2">
                      <GitBranch className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Code review turnaround
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    The median time it takes from a code review being requested to it being completed, excluding weekends.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatTime(avgReviewTurnaround)}
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...metrics].reverse()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="period"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          tick={{ fill: '#64748b' }}
                        />
                        <YAxis
                          label={{ 
                            value: 'Hours', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#64748b' }
                          }}
                          tickFormatter={(value) => {
                            const hours = Math.floor(value / 3600);
                            const minutes = Math.floor((value % 3600) / 60);
                            return hours > 0 ? `${hours}h` : `${minutes}m`;
                          }}
                          tick={{ fill: '#64748b' }}
                        />
                        <Tooltip 
                          formatter={formatTooltipValue}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                        <ReferenceLine 
                          y={avgReviewTurnaround} 
                          stroke="#f59e0b" 
                          strokeDasharray="3 3" 
                        />
                        <Bar
                          dataKey="median_review_turnaround_seconds"
                          name="Review Time"
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* New PR Merge Time Chart */}
              <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-md mr-2">
                      <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    PR merge time
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    The median time it takes from a PR opening to it being merged, excluding weekends.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {formatTime(avgMergeTime)}
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...metrics].reverse()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="period"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          tick={{ fill: '#64748b' }}
                        />
                        <YAxis
                          label={{ 
                            value: 'Hours', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#64748b' }
                          }}
                          tickFormatter={(value) => {
                            const hours = Math.floor(value / 3600);
                            const minutes = Math.floor((value % 3600) / 60);
                            return hours > 0 ? `${hours}h` : `${minutes}m`;
                          }}
                          tick={{ fill: '#64748b' }}
                        />
                        <Tooltip 
                          formatter={formatMergeTooltipValue}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                        <ReferenceLine 
                          y={avgMergeTime} 
                          stroke="#f59e0b" 
                          strokeDasharray="3 3" 
                        />
                        <Bar
                          dataKey="median_merge_time_seconds"
                          name="Merge Time"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center">
                  <div className="p-1 bg-violet-100 dark:bg-violet-900 rounded-md mr-2">
                    <GitBranch className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  Pull Request Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[...metrics].reverse()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="period"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis tick={{ fill: '#64748b' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                      <Line
                        type="monotone"
                        dataKey="total_prs"
                        name="Total PRs"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="merged_prs"
                        name="Merged PRs"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="reviewed_prs"
                        name="Reviewed PRs"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-700 dark:text-slate-200">Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-4 text-slate-700 dark:text-slate-300">Period</th>
                        <th className="text-right text-slate-700 dark:text-slate-300">Total PRs</th>
                        <th className="text-right text-slate-700 dark:text-slate-300">Merged PRs</th>
                        <th className="text-right text-slate-700 dark:text-slate-300">Reviewed PRs</th>
                        <th className="text-right text-slate-700 dark:text-slate-300">Merge Time</th>
                        <th className="text-right text-slate-700 dark:text-slate-300">Review Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="py-4 text-slate-700 dark:text-slate-300">{metric.period}</td>
                          <td className="text-right text-slate-700 dark:text-slate-300">{metric.total_prs}</td>
                          <td className="text-right text-slate-700 dark:text-slate-300">{metric.merged_prs}</td>
                          <td className="text-right text-slate-700 dark:text-slate-300">{metric.reviewed_prs}</td>
                          <td className="text-right text-slate-700 dark:text-slate-300">
                            {formatTime(metric.median_merge_time_seconds)}
                          </td>
                          <td className="text-right text-slate-700 dark:text-slate-300">
                            {formatTime(metric.median_review_turnaround_seconds)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
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
