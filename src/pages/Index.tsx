import { useEffect, useState } from "react";
import { 
  Wallet, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3, 
  Activity,
  Bot
} from "lucide-react";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { BotControls } from "@/components/dashboard/BotControls";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { EquityChart } from "@/components/dashboard/EquityChart";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { api, BotStatus } from "@/lib/api";

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
              <div className="p-2 rounded-lg bg-primary/10 glow-primary">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">CryptoBot</h1>
                <p className="text-xs text-muted-foreground">Trading Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EquityChart />
          </div>
          <div className="space-y-6">
            <div className="h-[300px]">
              <AlertsPanel />
            </div>
            <SettingsPanel />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-xs text-center text-muted-foreground">
            CryptoBot Dashboard • Real-time trading monitoring and control
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
