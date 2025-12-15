import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { 
  Wallet, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3, 
  Activity,
  Brain,
  History,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { BotControls } from "@/components/dashboard/BotControls";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { AIAvatarsPanel } from "@/components/dashboard/AIAvatarsPanel";
import { api, BotStatus } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy chart component to reduce initial bundle size
const EquityChart = lazy(() => import("@/components/dashboard/EquityChart").then(m => ({ default: m.EquityChart })));

const Index = () => {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const data = await api.getStatus();
      setStatus(data);
    } catch (error) {
      console.error("Failed to fetch status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (value: number) => 
    `${(value * 100).toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-deepseek glow-primary animate-float">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gradient-deepseek">DeepSeek</h1>
                  <Badge variant="outline" className="text-[10px] border-secondary/50 text-secondary">
                    AI Trading Bot
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Bitget GetAgent Model Arena
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/backtest">
                <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary/50 hover:bg-primary/10">
                  <History className="mr-2 h-4 w-4" />
                  Backtest
                </Button>
              </Link>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-mono text-foreground">
                  {status ? new Date(status.timestamp).toLocaleTimeString() : '--:--:--'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Bot Controls */}
        <section className="mb-8">
          <BotControls 
            isRunning={status?.can_trade ?? false} 
            onStatusChange={fetchStatus}
          />
        </section>

        {/* Status Cards Grid */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-foreground">Bot Status</h2>
            <Badge className="bg-gradient-deepseek text-white text-[10px] flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Optimized
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatusCard
              title="Equity"
              value={status ? formatCurrency(status.equity) : '--'}
              icon={Wallet}
              variant="default"
            />
            <StatusCard
              title="Drawdown"
              value={status ? formatPercent(status.drawdown) : '--'}
              icon={TrendingDown}
              variant={status && status.drawdown > 0.1 ? 'danger' : 'default'}
            />
            <StatusCard
              title="Daily P&L"
              value={status ? formatCurrency(status.daily_pnl) : '--'}
              icon={DollarSign}
              variant={status && status.daily_pnl >= 0 ? 'success' : 'danger'}
            />
            <StatusCard
              title="Win Rate"
              value={status ? formatPercent(status.win_rate) : '--'}
              icon={Target}
              variant={status && status.win_rate >= 0.5 ? 'success' : 'warning'}
            />
            <StatusCard
              title="Trades Today"
              value={status?.trades_today ?? '--'}
              icon={BarChart3}
              variant="default"
            />
            <StatusCard
              title="Total Trades"
              value={status?.total_trades ?? '--'}
              icon={Activity}
              variant="default"
            />
          </div>
        </section>

        {/* Charts and Panels */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2" style={{ contain: 'layout style paint' }}>
            <Suspense fallback={<div className="glass-card rounded-lg h-full min-h-[300px] flex items-center justify-center"><Skeleton className="w-full h-full" /></div>}>
              <EquityChart />
            </Suspense>
          </div>
          <div className="space-y-6">
            <div className="h-[300px]">
              <AlertsPanel />
            </div>
            <SettingsPanel />
          </div>
        </section>

        {/* AI Avatars Section */}
        <section className="mb-8">
          <AIAvatarsPanel />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              DeepSeek AI Trading Bot • Bitget GetAgent Model Arena
            </p>
            <p className="text-xs text-muted-foreground">
              Campaign: Nov 24 - Dec 15, 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;