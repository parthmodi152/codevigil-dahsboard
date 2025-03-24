"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFormattedDateAndDay } from "@/utils/formatters/dateFormatter";
import { useMetrics } from "@/hooks/useMetrics";

// Import shared components
import Header from "@/components/shared/Header";
import RepositoryInfo from "@/components/dashboard/RepositoryInfo";

// Import dashboard-specific components
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
    <main>
      <Header 
        currentDay={currentDay}
        currentDate={currentDate}
        type="dashboard"
        aggregation={aggregation}
        onAggregationChange={setAggregation}
      />
      <RepositoryInfo owner={owner} repo={repo} />
      
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
        
          <StatCards 
            metrics={metrics}
            prTrend={prTrend}
            mergeTimeTrend={mergeTimeTrend}
            reviewTrend={reviewTrend}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
    </main>
  );
}
