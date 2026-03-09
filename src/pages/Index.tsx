import { useEffect, useState, lazy, Suspense } from "react";
import { 
  Wallet, TrendingDown, DollarSign, Target, BarChart3, Activity, Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { BotControls } from "@/components/dashboard/BotControls";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { AIAvatarsPanel } from "@/components/dashboard/AIAvatarsPanel";
import { api, BotStatus } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

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

  const fmt = (v: number) =>
    `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header lastUpdated={status ? new Date(status.timestamp).toLocaleTimeString() : undefined} />

      <main className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Bot Controls */}
        <BotControls isRunning={status?.can_trade ?? false} onStatusChange={fetchStatus} />

        {/* Status Cards */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Live Stats</h2>
            <Badge className="bg-gradient-brand text-primary-foreground text-[9px] flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              AI
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatusCard title="Equity" value={status ? fmt(status.equity) : '--'} icon={Wallet} variant="default" />
            <StatusCard title="Drawdown" value={status ? pct(status.drawdown) : '--'} icon={TrendingDown} variant={status && status.drawdown > 0.1 ? 'danger' : 'default'} />
            <StatusCard title="Daily P&L" value={status ? fmt(status.daily_pnl) : '--'} icon={DollarSign} variant={status && status.daily_pnl >= 0 ? 'success' : 'danger'} />
            <StatusCard title="Win Rate" value={status ? pct(status.win_rate) : '--'} icon={Target} variant={status && status.win_rate >= 0.5 ? 'success' : 'warning'} />
            <StatusCard title="Trades Today" value={status?.trades_today ?? '--'} icon={BarChart3} variant="default" />
            <StatusCard title="Total Trades" value={status?.total_trades ?? '--'} icon={Activity} variant="default" />
          </div>
        </section>

        {/* Charts + Panels */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2" style={{ contain: 'layout style paint' }}>
            <Suspense fallback={<div className="glass-card rounded-xl h-full min-h-[300px] flex items-center justify-center"><Skeleton className="w-full h-full" /></div>}>
              <EquityChart />
            </Suspense>
          </div>
          <div className="space-y-4">
            <div className="h-[300px]">
              <AlertsPanel />
            </div>
            <SettingsPanel />
          </div>
        </section>

        {/* AI Avatars */}
        <AIAvatarsPanel />
      </main>

      {/* Footer - desktop only */}
      <footer className="border-t border-border/30 mt-8 hidden md:block">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">DeepSeek AI Trading Bot • Bitget GetAgent Model Arena</p>
            <p className="text-[11px] text-muted-foreground">Campaign: Nov 24 - Dec 15, 2025</p>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
};

export default Index;
