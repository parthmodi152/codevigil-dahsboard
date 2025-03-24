import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { Metric } from "./types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PullRequestTrendsChartProps {
  metrics: Metric[];
}

export const PullRequestTrendsChart: React.FC<PullRequestTrendsChartProps> = ({ metrics }) => {
  return (
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
  );
};

export default PullRequestTrendsChart; 