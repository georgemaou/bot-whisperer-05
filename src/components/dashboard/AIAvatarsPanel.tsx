import { useState, useMemo } from "react";
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  LineChart, 
  Grid3X3, 
  Target,
  Brain,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trophy,
  Medal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AIAvatarPerformance {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  style: string;
  color: string;
  bgColor: string;
  isBase?: boolean;
  metrics: {
    roi: number;
    winRate: number;
    totalTrades: number;
    avgDuration: string;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

const avatarsData: AIAvatarPerformance[] = [
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "Base model benchmark",
    icon: Brain,
    style: "General-purpose AI",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    isBase: true,
    metrics: {
      roi: 18.4,
      winRate: 62.3,
      totalTrades: 847,
      avgDuration: "4h 23m",
      maxDrawdown: 8.2,
      sharpeRatio: 1.87,
    },
  },
  {
    id: "steady-hedge",
    name: "Steady Hedge",
    description: "Conservative, risk-controlled trades",
    icon: Shield,
    style: "Low Risk",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    metrics: {
      roi: 12.1,
      winRate: 71.8,
      totalTrades: 423,
      avgDuration: "12h 45m",
      maxDrawdown: 3.4,
      sharpeRatio: 2.34,
    },
  },
  {
    id: "majors-momentum",
    name: "Majors Momentum",
    description: "Trend-focused on BTC, ETH",
    icon: TrendingUp,
    style: "Trend Following",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    metrics: {
      roi: 24.7,
      winRate: 58.2,
      totalTrades: 612,
      avgDuration: "6h 12m",
      maxDrawdown: 11.3,
      sharpeRatio: 1.92,
    },
  },
  {
    id: "altcoin-turbo",
    name: "Altcoin Turbo",
    description: "Aggressive altcoin strategies",
    icon: Zap,
    style: "High Risk",
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    metrics: {
      roi: 41.2,
      winRate: 48.7,
      totalTrades: 1243,
      avgDuration: "1h 48m",
      maxDrawdown: 22.6,
      sharpeRatio: 1.24,
    },
  },
  {
    id: "cta-force",
    name: "CTA Force",
    description: "Rule-based, systematic execution",
    icon: LineChart,
    style: "Systematic",
    color: "text-violet-400",
    bgColor: "bg-violet-500/20",
    metrics: {
      roi: 15.8,
      winRate: 64.1,
      totalTrades: 534,
      avgDuration: "8h 32m",
      maxDrawdown: 6.7,
      sharpeRatio: 2.11,
    },
  },
  {
    id: "infinite-grid",
    name: "Infinite Grid",
    description: "Range trading using grid logic",
    icon: Grid3X3,
    style: "Grid Trading",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    metrics: {
      roi: 9.4,
      winRate: 78.3,
      totalTrades: 2156,
      avgDuration: "45m",
      maxDrawdown: 4.1,
      sharpeRatio: 1.68,
    },
  },
  {
    id: "dip-sniper",
    name: "Dip Sniper",
    description: "Contrarian approach, buys dips",
    icon: Target,
    style: "Contrarian",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    metrics: {
      roi: 28.9,
      winRate: 54.6,
      totalTrades: 387,
      avgDuration: "18h 15m",
      maxDrawdown: 14.8,
      sharpeRatio: 1.56,
    },
  },
];

type SortKey = "roi" | "winRate" | "totalTrades" | "maxDrawdown" | "sharpeRatio";
type SortOrder = "asc" | "desc";

export function AIAvatarsPanel() {
  const [sortKey, setSortKey] = useState<SortKey>("roi");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedAvatars = useMemo(() => {
    return [...avatarsData].sort((a, b) => {
      const aValue = a.metrics[sortKey];
      const bValue = b.metrics[sortKey];
      const numA = typeof aValue === "string" ? 0 : aValue;
      const numB = typeof bValue === "string" ? 0 : bValue;
      
      // For drawdown, lower is better
      if (sortKey === "maxDrawdown") {
        return sortOrder === "asc" ? numB - numA : numA - numB;
      }
      return sortOrder === "asc" ? numA - numB : numB - numA;
    });
  }, [sortKey, sortOrder]);

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-400" />;
    if (index === 1) return <Medal className="h-4 w-4 text-gray-300" />;
    if (index === 2) return <Medal className="h-4 w-4 text-amber-600" />;
    return <span className="text-xs text-muted-foreground w-4 text-center">{index + 1}</span>;
  };

  const getValueColor = (key: SortKey, value: number, isTop: boolean, isBottom: boolean) => {
    if (key === "maxDrawdown") {
      if (isBottom) return "text-emerald-400";
      if (isTop) return "text-rose-400";
    } else {
      if (isTop) return "text-emerald-400";
      if (isBottom) return "text-rose-400";
    }
    return "text-foreground";
  };

  const SortButton = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 hover:bg-transparent font-medium text-muted-foreground hover:text-foreground"
      onClick={() => handleSort(sortKeyName)}
    >
      {label}
      {sortKey === sortKeyName ? (
        sortOrder === "desc" ? (
          <ArrowDown className="ml-1 h-3 w-3" />
        ) : (
          <ArrowUp className="ml-1 h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  );

  // Find top and bottom values for each metric
  const metricRanges = useMemo(() => {
    const metrics: Record<SortKey, { top: number; bottom: number }> = {
      roi: { top: Math.max(...avatarsData.map(a => a.metrics.roi)), bottom: Math.min(...avatarsData.map(a => a.metrics.roi)) },
      winRate: { top: Math.max(...avatarsData.map(a => a.metrics.winRate)), bottom: Math.min(...avatarsData.map(a => a.metrics.winRate)) },
      totalTrades: { top: Math.max(...avatarsData.map(a => a.metrics.totalTrades)), bottom: Math.min(...avatarsData.map(a => a.metrics.totalTrades)) },
      maxDrawdown: { top: Math.max(...avatarsData.map(a => a.metrics.maxDrawdown)), bottom: Math.min(...avatarsData.map(a => a.metrics.maxDrawdown)) },
      sharpeRatio: { top: Math.max(...avatarsData.map(a => a.metrics.sharpeRatio)), bottom: Math.min(...avatarsData.map(a => a.metrics.sharpeRatio)) },
    };
    return metrics;
  }, []);

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="text-gradient-deepseek">Model Arena Performance</span>
              <Badge variant="outline" className="text-xs font-normal border-primary/30 text-primary">
                Live Rankings
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Bitget GetAgent • Nov 24 - Dec 15, 2025 • Click headers to sort
            </p>
          </div>
          <Badge className="bg-gradient-deepseek text-white">
            7 AI Avatars
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="min-w-[180px]">Avatar</TableHead>
                <TableHead className="text-right">
                  <SortButton label="ROI %" sortKeyName="roi" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton label="Win Rate" sortKeyName="winRate" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton label="Trades" sortKeyName="totalTrades" />
                </TableHead>
                <TableHead className="text-right hidden md:table-cell">Avg Duration</TableHead>
                <TableHead className="text-right">
                  <SortButton label="Max DD" sortKeyName="maxDrawdown" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton label="Sharpe" sortKeyName="sharpeRatio" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAvatars.map((avatar, index) => {
                const IconComponent = avatar.icon;
                return (
                  <TableRow 
                    key={avatar.id}
                    className={cn(
                      "border-border/30 transition-colors",
                      avatar.isBase && "bg-gradient-to-r from-primary/5 to-secondary/5",
                      index === 0 && "bg-yellow-500/5"
                    )}
                  >
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {getRankBadge(index)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", avatar.bgColor)}>
                          <IconComponent className={cn("h-4 w-4", avatar.color)} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium text-sm",
                              avatar.isBase ? "text-gradient-deepseek" : "text-foreground"
                            )}>
                              {avatar.name}
                            </span>
                            {avatar.isBase && (
                              <Badge className="bg-gradient-deepseek text-[10px] px-1.5 py-0">
                                Base
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn("text-[10px] mt-0.5 border-border/50", avatar.color)}
                          >
                            {avatar.style}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono font-medium",
                      getValueColor("roi", avatar.metrics.roi, 
                        avatar.metrics.roi === metricRanges.roi.top,
                        avatar.metrics.roi === metricRanges.roi.bottom
                      )
                    )}>
                      {avatar.metrics.roi > 0 ? "+" : ""}{avatar.metrics.roi.toFixed(1)}%
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono",
                      getValueColor("winRate", avatar.metrics.winRate,
                        avatar.metrics.winRate === metricRanges.winRate.top,
                        avatar.metrics.winRate === metricRanges.winRate.bottom
                      )
                    )}>
                      {avatar.metrics.winRate.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {avatar.metrics.totalTrades.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground hidden md:table-cell">
                      {avatar.metrics.avgDuration}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono",
                      getValueColor("maxDrawdown", avatar.metrics.maxDrawdown,
                        avatar.metrics.maxDrawdown === metricRanges.maxDrawdown.top,
                        avatar.metrics.maxDrawdown === metricRanges.maxDrawdown.bottom
                      )
                    )}>
                      -{avatar.metrics.maxDrawdown.toFixed(1)}%
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono",
                      getValueColor("sharpeRatio", avatar.metrics.sharpeRatio,
                        avatar.metrics.sharpeRatio === metricRanges.sharpeRatio.top,
                        avatar.metrics.sharpeRatio === metricRanges.sharpeRatio.bottom
                      )
                    )}>
                      {avatar.metrics.sharpeRatio.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}