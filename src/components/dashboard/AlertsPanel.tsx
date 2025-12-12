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
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getAlertStyles = (level: Alert['level']) => {
    switch (level) {
      case 'critical':
        return 'border-l-destructive bg-destructive/5';
      case 'warning':
        return 'border-l-warning bg-warning/5';
      default:
        return 'border-l-primary bg-primary/5';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="glass-card rounded-lg h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-border/50">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Recent Alerts</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          {alerts.length} alerts
        </span>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-lg border-l-2 animate-slide-up",
                getAlertStyles(alert.level)
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-2">
                {getAlertIcon(alert.level)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {formatTime(alert.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent alerts</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
