import { useState, useEffect } from 'react';
import { calculateTrend } from '@/utils/formatters/trendCalculator';
import { Metric } from '@/components/dashboard/types';

interface UseMetricsResult {
  metrics: Metric[];
  loading: boolean;
  avgReviewTurnaround: number;
  avgMergeTime: number;
  prTrend: 'up' | 'down' | 'unchanged';
  mergeTimeTrend: 'up' | 'down' | 'unchanged';
  reviewTrend: 'up' | 'down' | 'unchanged';
}

// Utility functions for calculations
const calculateAverage = (metrics: Metric[], key: keyof Pick<Metric, 'median_review_turnaround_seconds' | 'median_merge_time_seconds'>): number => {
  if (metrics.length === 0) return 0;
  return metrics.reduce((sum, metric) => sum + metric[key], 0) / metrics.length;
};

const calculateMetricTrend = (metrics: Metric[], key: keyof Pick<Metric, 'total_prs' | 'median_merge_time_seconds' | 'median_review_turnaround_seconds'>): 'up' | 'down' | 'unchanged' => {
  if (metrics.length < 2) return 'unchanged';
  return calculateTrend(metrics[0]?.[key] ?? 0, metrics[1]?.[key] ?? 0);
};

export const useMetrics = (owner: string | null, repo: string | null, aggregation: string): UseMetricsResult => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch metrics data
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

  // Calculate derived metrics
  const avgReviewTurnaround = calculateAverage(metrics, 'median_review_turnaround_seconds');
  const avgMergeTime = calculateAverage(metrics, 'median_merge_time_seconds');
  
  const prTrend = calculateMetricTrend(metrics, 'total_prs');
  const mergeTimeTrend = calculateMetricTrend(metrics, 'median_merge_time_seconds');
  const reviewTrend = calculateMetricTrend(metrics, 'median_review_turnaround_seconds');

  return {
    metrics,
    loading,
    avgReviewTurnaround,
    avgMergeTime,
    prTrend,
    mergeTimeTrend,
    reviewTrend,
  };
}; 