import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatTime } from "@/utils/formatters/timeFormatter";

interface Metric {
  total_prs: number;
  reviewed_prs: number;
  merged_prs: number;
  median_merge_time_seconds: number;
  median_review_turnaround_seconds: number;
  period: string;
}

interface MetricsTableProps {
  metrics: Metric[];
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ metrics }) => {
  return (
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
  );
};

export default MetricsTable; 