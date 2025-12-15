import { 
  Shield, 
  TrendingUp, 
  Zap, 
  LineChart, 
  Grid3X3, 
  Target,
  Brain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AIAvatar {
  name: string;
  description: string;
  icon: React.ElementType;
  style: string;
  color: string;
  bgColor: string;
  isBase?: boolean;
}

const avatars: AIAvatar[] = [
  {
    name: "DeepSeek",
    description: "Base model benchmark",
    icon: Brain,
    style: "General-purpose AI",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    isBase: true,
  },
  {
    name: "Steady Hedge",
    description: "Conservative, risk-controlled trades",
    icon: Shield,
    style: "Low Risk",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
  },
  {
    name: "Majors Momentum",
    description: "Trend-focused on BTC, ETH",
    icon: TrendingUp,
    style: "Trend Following",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
  {
    name: "Altcoin Turbo",
    description: "Aggressive altcoin strategies",
    icon: Zap,
    style: "High Risk",
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
  },
  {
    name: "CTA Force",
    description: "Rule-based, systematic execution",
    icon: LineChart,
    style: "Systematic",
    color: "text-violet-400",
    bgColor: "bg-violet-500/20",
  },
  {
    name: "Infinite Grid",
    description: "Range trading using grid logic",
    icon: Grid3X3,
    style: "Grid Trading",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
  },
  {
    name: "Dip Sniper",
    description: "Contrarian approach, buys dips",
    icon: Target,
    style: "Contrarian",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
  },
];

export function AIAvatarsPanel() {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-gradient-deepseek">Model Arena</span>
          <Badge variant="outline" className="text-xs font-normal border-primary/30 text-primary">
            7 AI Avatars
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Bitget GetAgent • Compare AI trading strategies
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {avatars.map((avatar) => (
          <div
            key={avatar.name}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
              "hover:bg-muted/50 group",
              avatar.isBase && "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg transition-transform group-hover:scale-110",
              avatar.bgColor
            )}>
              <avatar.icon className={cn("h-4 w-4", avatar.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium text-sm truncate",
                  avatar.isBase ? "text-gradient-deepseek" : "text-foreground"
                )}>
                  {avatar.name}
                </span>
                {avatar.isBase && (
                  <Badge className="bg-gradient-deepseek text-xs px-1.5 py-0">
                    Base
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {avatar.description}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-normal border-border/50 hidden sm:flex",
                avatar.color
              )}
            >
              {avatar.style}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}