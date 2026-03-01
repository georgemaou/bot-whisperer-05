import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Brain, Sparkles, Wallet, TrendingUp, Bot, BarChart3,
  LogOut, ArrowRight, DollarSign, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Investment {
  id: string;
  amount: number;
  status: string;
  type: string;
  notes: string | null;
  created_at: string;
}

interface Performance {
  total_invested: number;
  current_equity: number;
  roi_percent: number;
  total_trades: number;
  win_rate: number;
}

interface BotAssignment {
  id: string;
  bot_name: string;
  is_active: boolean;
}

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [bots, setBots] = useState<BotAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [requestType, setRequestType] = useState("deposit");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchInvestments(), fetchPerformance(), fetchBots()]);
    setLoading(false);
  };

  const fetchInvestments = async () => {
    const { data } = await supabase
      .from("investments" as any)
      .select("id, amount, status, type, notes, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setInvestments(data as any);
  };

  const fetchPerformance = async () => {
    const { data } = await supabase
      .from("client_performance" as any)
      .select("total_invested, current_equity, roi_percent, total_trades, win_rate")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (data) setPerformance(data as any);
  };

  const fetchBots = async () => {
    const { data } = await supabase
      .from("bot_assignments" as any)
      .select("id, bot_name, is_active")
      .eq("user_id", user!.id);
    if (data) setBots(data as any);
  };

  const submitRequest = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    const { error } = await supabase
      .from("investments" as any)
      .insert({ user_id: user!.id, amount, type: requestType } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request submitted", description: `${requestType} of $${amount} is pending approval.` });
      setDepositAmount("");
      setDialogOpen(false);
      fetchInvestments();
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved": return "border-green-500/30 text-green-400";
      case "rejected": return "border-red-500/30 text-red-400";
      case "pending": return "border-yellow-500/30 text-yellow-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-deepseek glow-primary">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gradient-deepseek">My Portfolio</h1>
                  <Badge variant="outline" className="text-[10px] border-secondary/50 text-secondary">Investor</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-primary/30">
                  <ArrowRight className="mr-2 h-4 w-4" /> Trading View
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Performance Cards */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          ) : (
            <>
              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className="text-xl font-bold font-mono">${Number(performance?.total_invested ?? 0).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Current Equity</p>
                  <p className="text-xl font-bold font-mono">${Number(performance?.current_equity ?? 0).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className={`text-xl font-bold font-mono ${Number(performance?.roi_percent ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {Number(performance?.roi_percent ?? 0).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-xl font-bold font-mono">{performance?.total_trades ?? 0}</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-xl font-bold font-mono">{((Number(performance?.win_rate ?? 0)) * 100).toFixed(1)}%</p>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        {/* Active Bots */}
        <section className="mb-8">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" /> My Trading Bots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-24" /> : bots.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-6">No bots assigned yet. Contact admin to get started.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {bots.map(bot => (
                    <div key={bot.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/50">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{bot.bot_name}</p>
                        <Badge variant="outline" className={bot.is_active ? "border-green-500/30 text-green-400 text-[10px]" : "border-red-500/30 text-red-400 text-[10px]"}>
                          {bot.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Investments */}
        <section>
          <Card className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" /> Transactions
              </CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-deepseek">
                    <Plus className="mr-2 h-4 w-4" /> New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Submit Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={requestType} onValueChange={setRequestType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount ($)</Label>
                      <Input type="number" min="1" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Enter amount" />
                    </div>
                    <Button className="w-full bg-gradient-deepseek" onClick={submitRequest}>
                      Submit Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-48" /> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No transactions yet. Submit a deposit request to get started.
                        </TableCell>
                      </TableRow>
                    ) : investments.map(inv => (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <Badge variant="outline" className={inv.type === "deposit" ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"}>
                            {inv.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">${Number(inv.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor(inv.status)}>{inv.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
