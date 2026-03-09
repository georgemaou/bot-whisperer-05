import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { api, HistoricalEquity } from "@/lib/api";

export function EquityChart() {
  const [data, setData] = useState<{ time: string; equity: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historical = await api.getHistoricalEquity();
        const chartData = historical.timestamps.map((timestamp, index) => ({
          time: new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          equity: historical.equity[index],
        }));
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch historical equity:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card rounded-lg p-2.5 border border-border/50 text-xs">
          <p className="text-muted-foreground mb-0.5">{label}</p>
          <p className="font-mono font-semibold text-primary">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-xl h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Equity Curve</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
          24h
        </span>
      </div>
      
      <div className="flex-1 p-3 min-h-[300px]" style={{ contain: 'layout style paint' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(170, 100%, 50%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(170, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 10 }}
              dy={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 10 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              dx={-8}
              domain={['dataMin - 100', 'dataMax + 100']}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="hsl(170, 100%, 50%)"
              strokeWidth={2}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
