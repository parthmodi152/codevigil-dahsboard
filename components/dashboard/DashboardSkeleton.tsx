import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

export const DashboardSkeleton: React.FC = () => {
  return (
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
  );
};

export default DashboardSkeleton; 