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
          time: new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
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
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 border border-border/50">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-mono font-semibold text-primary">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-lg h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-border/50">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Equity Curve</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          Last 24 hours
        </span>
      </div>
      
      <div className="flex-1 p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              dx={-10}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="hsl(187, 100%, 50%)"
              strokeWidth={2}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
