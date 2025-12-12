import { useState } from "react";
import { Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    max_drawdown: 10,
    daily_loss_limit: 5,
    max_trades_per_day: 20,
    position_size_percent: 2,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await api.updateSettings({
        max_drawdown: settings.max_drawdown / 100,
        daily_loss_limit: settings.daily_loss_limit / 100,
        max_trades_per_day: settings.max_trades_per_day,
        position_size_percent: settings.position_size_percent / 100,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-lg">
      <div className="flex items-center gap-2 p-4 border-b border-border/50">
        <Settings className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Risk Settings</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-xs text-warning">
            Changing these settings will affect your bot's risk management. Proceed with caution.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max_drawdown" className="text-sm text-muted-foreground">
              Max Drawdown (%)
            </Label>
            <Input
              id="max_drawdown"
              type="number"
              value={settings.max_drawdown}
              onChange={(e) => setSettings({ ...settings, max_drawdown: Number(e.target.value) })}
              className="font-mono bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="daily_loss_limit" className="text-sm text-muted-foreground">
              Daily Loss Limit (%)
            </Label>
            <Input
              id="daily_loss_limit"
              type="number"
              value={settings.daily_loss_limit}
              onChange={(e) => setSettings({ ...settings, daily_loss_limit: Number(e.target.value) })}
              className="font-mono bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_trades" className="text-sm text-muted-foreground">
              Max Trades/Day
            </Label>
            <Input
              id="max_trades"
              type="number"
              value={settings.max_trades_per_day}
              onChange={(e) => setSettings({ ...settings, max_trades_per_day: Number(e.target.value) })}
              className="font-mono bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position_size" className="text-sm text-muted-foreground">
              Position Size (%)
            </Label>
            <Input
              id="position_size"
              type="number"
              value={settings.position_size_percent}
              onChange={(e) => setSettings({ ...settings, position_size_percent: Number(e.target.value) })}
              className="font-mono bg-background/50"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
