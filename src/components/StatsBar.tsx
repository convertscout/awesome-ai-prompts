import { FileText, Wrench, Briefcase, Users } from "lucide-react";

interface StatsBarProps {
  promptCount: number;
  mcpCount: number;
  jobCount: number;
  memberCount: number;
}

export const StatsBar = ({ promptCount, mcpCount, jobCount, memberCount }: StatsBarProps) => {
  const stats = [
    { icon: FileText, label: "Prompts", value: promptCount },
    { icon: Wrench, label: "MCPs", value: mcpCount },
    { icon: Briefcase, label: "Jobs", value: jobCount },
    { icon: Users, label: "Members", value: `${(memberCount / 1000).toFixed(0)}K+` },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-4 px-4 rounded-lg bg-muted/30 border border-border/50">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex items-center gap-2">
          <stat.icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {typeof stat.value === "number" ? stat.value : stat.value}
          </span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
          {index < stats.length - 1 && (
            <span className="hidden md:inline text-border ml-4">•</span>
          )}
        </div>
      ))}
    </div>
  );
};
