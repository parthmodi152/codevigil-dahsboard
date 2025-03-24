"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFormattedDateAndDay } from "@/utils/formatters/dateFormatter";
import { useMetrics } from "@/hooks/useMetrics";

// Import shared components
import Footer from "@/components/shared/Footer";

// Import dashboard-specific components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import StatCards from "@/components/dashboard/StatCards";
import ReviewTimeChart from "@/components/dashboard/ReviewTimeChart";
import MergeTimeChart from "@/components/dashboard/MergeTimeChart";
import PullRequestTrendsChart from "@/components/dashboard/PullRequestTrendsChart";
import MetricsTable from "@/components/dashboard/MetricsTable";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const [aggregation, setAggregation] = useState("weekly");
  
  // Get formatted date and day
  const { currentDate, currentDay } = getFormattedDateAndDay();
  
  // Get metrics data and derived stats using custom hook
  const { 
    metrics, 
    loading, 
    avgReviewTurnaround, 
    avgMergeTime, 
    prTrend, 
    mergeTimeTrend, 
    reviewTrend 
  } = useMetrics(owner, repo, aggregation);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          owner={owner}
          repo={repo}
          currentDay={currentDay}
          currentDate={currentDate}
          aggregation={aggregation}
          onAggregationChange={setAggregation}
        />

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white px-2 py-1 border-l-4 border-blue-600">Today's Stats</h2>
            
            <StatCards 
              metrics={metrics}
              prTrend={prTrend}
              mergeTimeTrend={mergeTimeTrend}
              reviewTrend={reviewTrend}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <ReviewTimeChart 
                metrics={metrics} 
                avgReviewTurnaround={avgReviewTurnaround} 
              />
              
              <MergeTimeChart 
                metrics={metrics} 
                avgMergeTime={avgMergeTime} 
              />
            </div>

            <PullRequestTrendsChart metrics={metrics} />
            
            <MetricsTable metrics={metrics} />
          </>
        )}
        
        <Footer />
      </div>
    </main>
  );
}
