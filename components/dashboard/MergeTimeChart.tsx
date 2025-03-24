import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { Metric } from "./types";
import { formatTime, formatTooltipValue, formatYAxisTick } from "@/utils/formatters/timeFormatter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface MergeTimeChartProps {
  metrics: Metric[];
  avgMergeTime: number;
}

export const MergeTimeChart: React.FC<MergeTimeChartProps> = ({
  metrics,
  avgMergeTime,
}) => {
  return (
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
                tickFormatter={formatYAxisTick}
                tick={{ fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value) => formatTooltipValue(value, 'Merge Time')}
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
  );
};

export default MergeTimeChart; 