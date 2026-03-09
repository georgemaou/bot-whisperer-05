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
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { id: 'max_drawdown', label: 'Max DD %', key: 'max_drawdown' as const },
    { id: 'daily_loss_limit', label: 'Daily Loss %', key: 'daily_loss_limit' as const },
    { id: 'max_trades', label: 'Max Trades', key: 'max_trades_per_day' as const },
    { id: 'position_size', label: 'Position %', key: 'position_size_percent' as const },
  ];

  return (
    <div className="glass-card rounded-xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <Settings className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Risk Settings</h3>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-warning/[0.06] border border-warning/15">
          <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
          <p className="text-[10px] text-warning leading-relaxed">
            Changes affect live risk management.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.id} className="space-y-1.5">
              <Label htmlFor={f.id} className="text-[11px] text-muted-foreground">{f.label}</Label>
              <Input
                id={f.id}
                type="number"
                value={settings[f.key]}
                onChange={(e) => setSettings({ ...settings, [f.key]: Number(e.target.value) })}
                className="font-mono text-xs h-8 bg-muted/30 border-border/50"
              />
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          size="sm"
          className="w-full bg-gradient-brand text-primary-foreground hover:opacity-90"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
