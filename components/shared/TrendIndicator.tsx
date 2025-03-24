import React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'unchanged';
  isPositive?: boolean; // Whether up is positive (e.g., for PRs) or negative (e.g., for time metrics)
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, isPositive = true }) => {
  // Check if the trend should be considered good/favorable
  const isGoodTrend = 
    (trend === "up" && isPositive) || // Higher numbers are good (like more PRs)
    (trend === "down" && !isPositive); // Lower numbers are good (like shorter review times)

  if (trend === "unchanged") {
    return <Minus className="h-4 w-4 text-gray-500 ml-2" />;
  } else if (isGoodTrend) {
    return <ArrowUp className="h-4 w-4 text-emerald-500 ml-2" />;
  } else {
    return <ArrowDown className="h-4 w-4 text-rose-500 ml-2" />;
  }
};

export default TrendIndicator; 