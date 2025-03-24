export interface Metric {
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