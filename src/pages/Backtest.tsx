import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Play, ArrowLeft, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface BacktestResult {
  equity: { date: string; value: number }[];
  metrics: {
    totalReturn: number;
    cagr: number;
    maxDrawdown: number;
    sharpeRatio: number;
    winRate: number;
    totalTrades: number;
    profitFactor: number;
  };
}

const generateMockBacktestData = (startDate: Date, endDate: Date): BacktestResult => {
  const equity: { date: string; value: number }[] = [];
  let currentEquity = 10000;
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((endTime - startTime) / dayMs);
  
  // Generate monthly data points for performance
  const monthlyInterval = Math.max(1, Math.floor(totalDays / 180));
  
  for (let i = 0; i <= totalDays; i += monthlyInterval) {
    const date = new Date(startTime + i * dayMs);
    // Simulate market-like returns with upward bias
    const dailyReturn = (Math.random() - 0.45) * 0.03;
    currentEquity *= (1 + dailyReturn);
    currentEquity = Math.max(currentEquity * 0.7, currentEquity); // Limit drawdowns
    
    equity.push({
      date: format(date, 'MMM yyyy'),
      value: Math.round(currentEquity * 100) / 100,
    });
  }

  const finalEquity = equity[equity.length - 1].value;
  const years = totalDays / 365;
  const totalReturn = ((finalEquity - 10000) / 10000) * 100;
  const cagr = (Math.pow(finalEquity / 10000, 1 / years) - 1) * 100;
  
  // Calculate max drawdown
  let peak = 10000;
  let maxDrawdown = 0;
  equity.forEach(({ value }) => {
    if (value > peak) peak = value;
    const drawdown = ((peak - value) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  return {
    equity,
    metrics: {
      totalReturn: Math.round(totalReturn * 100) / 100,
      cagr: Math.round(cagr * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      sharpeRatio: Math.round((0.8 + Math.random() * 1.2) * 100) / 100,
      winRate: Math.round((55 + Math.random() * 15) * 100) / 100,
      totalTrades: Math.floor(totalDays / 3),
      profitFactor: Math.round((1.2 + Math.random() * 0.8) * 100) / 100,
    },
  };
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-muted-foreground text-sm">{payload[0].payload.date}</p>
        <p className="text-foreground font-mono font-semibold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function Backtest() {
  const [startDate, setStartDate] = useState<Date>(new Date('2009-01-01'));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [strategy, setStrategy] = useState<string>('momentum');
  const [initialCapital, setInitialCapital] = useState<string>('10000');
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBacktest = async () => {
    setIsRunning(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    const data = generateMockBacktestData(startDate, endDate);
    setResult(data);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Backtest</h1>
            <p className="text-muted-foreground">Test your strategy on historical data</p>
          </div>
        </div>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      disabled={(date) => date > new Date() || date < new Date("2009-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      disabled={(date) => date > new Date() || date < startDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Strategy */}
              <div className="space-y-2">
                <Label>Strategy</Label>
                <Select value={strategy} onValueChange={setStrategy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="trend-following">Trend Following</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Initial Capital */}
              <div className="space-y-2">
                <Label>Initial Capital ($)</Label>
                <Input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  min="1000"
                  step="1000"
                />
              </div>

              {/* Run Button */}
              <div className="space-y-2">
                <Label className="invisible">Action</Label>
                <Button 
                  onClick={runBacktest} 
                  disabled={isRunning}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isRunning ? 'Running...' : 'Run Backtest'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Total Return</p>
                  <p className={cn(
                    "text-xl font-bold font-mono",
                    result.metrics.totalReturn >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {result.metrics.totalReturn >= 0 ? '+' : ''}{result.metrics.totalReturn}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">CAGR</p>
                  <p className={cn(
                    "text-xl font-bold font-mono",
                    result.metrics.cagr >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {result.metrics.cagr >= 0 ? '+' : ''}{result.metrics.cagr}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Max Drawdown</p>
                  <p className="text-xl font-bold font-mono text-red-500">
                    -{result.metrics.maxDrawdown}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {result.metrics.sharpeRatio}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {result.metrics.winRate}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {result.metrics.totalTrades.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Profit Factor</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {result.metrics.profitFactor}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Equity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.metrics.totalReturn >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  Equity Curve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.equity}>
                      <defs>
                        <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        domain={['dataMin', 'dataMax']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#equityGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
