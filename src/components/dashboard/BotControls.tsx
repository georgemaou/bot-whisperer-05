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

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const result = await api.startBot();
      toast.success(result.message);
      onStatusChange();
    } catch (error) {
      toast.error("Failed to start bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      const result = await api.stopBot();
      toast.success(result.message);
      onStatusChange();
    } catch (error) {
      toast.error("Failed to stop bot");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-full",
              isRunning 
                ? "bg-success/20 animate-pulse-glow" 
                : "bg-muted"
            )}
          >
            <Power className={cn(
              "h-6 w-6",
              isRunning ? "text-success" : "text-muted-foreground"
            )} />
            {isRunning && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-success"></span>
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Bot Status: {" "}
              <span className={isRunning ? "text-success" : "text-muted-foreground"}>
                {isRunning ? "RUNNING" : "STOPPED"}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRunning 
                ? "Actively monitoring markets and executing trades" 
                : "Bot is idle - no trading activity"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleStart}
            disabled={isRunning || isLoading}
            className="bg-success hover:bg-success/90 text-success-foreground gap-2"
          >
            <Play className="h-4 w-4" />
            Start
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isRunning || isLoading}
            variant="destructive"
            className="gap-2"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
        </div>
      </div>
    </div>
  );
}
