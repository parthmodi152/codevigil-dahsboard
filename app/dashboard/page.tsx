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
import { GitBranch, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <GitBranch className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-primary">CodeVigil</h1>
              <h2 className="text-xl text-muted-foreground">
                {owner}/{repo}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={aggregation} onValueChange={setAggregation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select aggregation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Repositories
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-12 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Pull Requests</CardTitle>
                  <CardDescription>Latest period metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {metrics[0]?.total_prs || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {metrics[0]?.merged_prs || 0} merged
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Median Merge Time</CardTitle>
                  <CardDescription>Time from creation to merge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {formatTime(metrics[0]?.median_merge_time_seconds || 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Review Turnaround</CardTitle>
                  <CardDescription>Time to first review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {formatTime(metrics[0]?.median_review_turnaround_seconds || 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Pull Request Trends</CardTitle>
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="period"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total_prs"
                        name="Total PRs"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="merged_prs"
                        name="Merged PRs"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="reviewed_prs"
                        name="Reviewed PRs"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4">Period</th>
                        <th className="text-right">Total PRs</th>
                        <th className="text-right">Merged PRs</th>
                        <th className="text-right">Reviewed PRs</th>
                        <th className="text-right">Merge Time</th>
                        <th className="text-right">Review Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4">{metric.period}</td>
                          <td className="text-right">{metric.total_prs}</td>
                          <td className="text-right">{metric.merged_prs}</td>
                          <td className="text-right">{metric.reviewed_prs}</td>
                          <td className="text-right">
                            {formatTime(metric.median_merge_time_seconds)}
                          </td>
                          <td className="text-right">
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
      </div>
    </main>
  );
}