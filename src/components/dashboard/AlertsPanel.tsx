import { useEffect, useState } from "react";
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, Alert } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.getAlerts(10);
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (level: Alert['level']) => {
    switch (level) {
      case 'critical': return <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />;
      case 'warning': return <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />;
      default: return <Info className="h-3.5 w-3.5 text-primary shrink-0" />;
    }
  };

  const getAlertBorder = (level: Alert['level']) => {
    switch (level) {
      case 'critical': return 'border-l-destructive';
      case 'warning': return 'border-l-warning';
      default: return 'border-l-primary';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="glass-card rounded-xl h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <Bell className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Alerts</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
          {alerts.length}
        </span>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div
              key={alert.id}
              className={cn(
                "p-2.5 rounded-lg border-l-2 bg-muted/20 animate-slide-up",
                getAlertBorder(alert.level)
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-2">
                {getAlertIcon(alert.level)}
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-foreground leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{formatTime(alert.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
              <p className="text-xs">No alerts</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
