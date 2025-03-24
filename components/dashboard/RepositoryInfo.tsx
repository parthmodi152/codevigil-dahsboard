import React from "react";

interface RepositoryInfoProps {
  owner: string | null;
  repo: string | null;
}

export const RepositoryInfo: React.FC<RepositoryInfoProps> = ({
  owner,
  repo,
}) => {
  return (
    <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
        Repository: <span className="text-blue-600 dark:text-blue-400">{owner}/{repo}</span>
      </h2>
    </div>
  );
};

export default RepositoryInfo; 