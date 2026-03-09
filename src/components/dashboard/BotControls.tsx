import { useState } from "react";
import { Play, Square, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface BotControlsProps {
  isRunning: boolean;
  onStatusChange: () => void;
}

export function BotControls({ isRunning, onStatusChange }: BotControlsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = isRunning ? await api.stopBot() : await api.startBot();
      toast.success(result.message);
      onStatusChange();
    } catch {
      toast.error(isRunning ? "Failed to stop bot" : "Failed to start bot");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-full transition-all",
            isRunning ? "bg-success/15 animate-pulse-glow" : "bg-muted"
          )}>
            <Power className={cn("h-5 w-5", isRunning ? "text-success" : "text-muted-foreground")} />
            {isRunning && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Status:
              <span className={isRunning ? "text-success" : "text-muted-foreground"}>
                {isRunning ? "RUNNING" : "STOPPED"}
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isRunning ? "Monitoring & executing trades" : "Bot is idle"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleToggle}
            disabled={isLoading}
            size="sm"
            className={cn(
              "gap-1.5",
              isRunning
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-success hover:bg-success/90 text-success-foreground"
            )}
          >
            {isRunning ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isRunning ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
}
