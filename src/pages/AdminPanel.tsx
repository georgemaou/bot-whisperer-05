import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Brain, Users, Wallet, Bot, BarChart3, LogOut, ArrowLeft,
  CheckCircle, XCircle, Clock, TrendingUp, Sparkles, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Client {
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface Investment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  type: string;
  notes: string | null;
  created_at: string;
  profile?: { full_name: string; email: string };
}

interface Performance {
  user_id: string;
  total_invested: number;
  current_equity: number;
  roi_percent: number;
  total_trades: number;
  win_rate: number;
  profile?: { full_name: string; email: string };
}

interface BotAssignment {
  id: string;
  user_id: string;
  bot_name: string;
  is_active: boolean;
  created_at: string;
  profile?: { full_name: string; email: string };
}

const BOT_LIST = [
  "DeepSeek Alpha", "DeepSeek Momentum", "DeepSeek Scalper",
  "DeepSeek Sentinel", "DeepSeek Quant", "DeepSeek Neural", "DeepSeek Omega"
];

const AdminPanel = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [botAssignments, setBotAssignments] = useState<BotAssignment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setDataLoading(true);
    await Promise.all([fetchClients(), fetchInvestments(), fetchPerformances(), fetchBotAssignments()]);
    setDataLoading(false);
  };

  const fetchClients = async () => {
    const { data } = await supabase.from("profiles" as any).select("user_id, full_name, email, created_at");
    if (data) setClients(data as any);
  };

  const fetchInvestments = async () => {
    const { data } = await supabase
      .from("investments" as any)
      .select("id, user_id, amount, status, type, notes, created_at")
      .order("created_at", { ascending: false });
    if (data) {
      // Join with profiles
      const { data: profiles } = await supabase.from("profiles" as any).select("user_id, full_name, email");
      const profileMap = new Map((profiles as any[] || []).map((p: any) => [p.user_id, p]));
      setInvestments((data as any[]).map((inv: any) => ({
        ...inv,
        profile: profileMap.get(inv.user_id) || { full_name: "Unknown", email: "" }
      })));
    }
  };

  const fetchPerformances = async () => {
    const { data } = await supabase.from("client_performance" as any).select("*");
    if (data) {
      const { data: profiles } = await supabase.from("profiles" as any).select("user_id, full_name, email");
      const profileMap = new Map((profiles as any[] || []).map((p: any) => [p.user_id, p]));
      setPerformances((data as any[]).map((perf: any) => ({
        ...perf,
        profile: profileMap.get(perf.user_id) || { full_name: "Unknown", email: "" }
      })));
    }
  };

  const fetchBotAssignments = async () => {
    const { data } = await supabase.from("bot_assignments" as any).select("*");
    if (data) {
      const { data: profiles } = await supabase.from("profiles" as any).select("user_id, full_name, email");
      const profileMap = new Map((profiles as any[] || []).map((p: any) => [p.user_id, p]));
      setBotAssignments((data as any[]).map((ba: any) => ({
        ...ba,
        profile: profileMap.get(ba.user_id) || { full_name: "Unknown", email: "" }
      })));
    }
  };

  const updateInvestmentStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("investments" as any)
      .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Investment ${status}` });
      fetchInvestments();
    }
  };

  const assignBot = async (userId: string, botName: string) => {
    const { error } = await supabase
      .from("bot_assignments" as any)
      .insert({ user_id: userId, bot_name: botName, assigned_by: user?.id } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bot Assigned", description: `${botName} assigned` });
      fetchBotAssignments();
    }
  };

  const toggleBot = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("bot_assignments" as any)
      .update({ is_active: isActive } as any)
      .eq("id", id);
    if (!error) fetchBotAssignments();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="w-32 h-8" />
      </div>
    );
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "rejected": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const totalInvested = clients.length;
  const pendingRequests = investments.filter(i => i.status === "pending").length;
  const totalEquity = performances.reduce((sum, p) => sum + Number(p.current_equity), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-deepseek glow-primary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gradient-deepseek">Admin Panel</h1>
                  <Badge className="bg-gradient-deepseek text-white text-[10px]">Master</Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> DeepSeek Trading Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/")} className="border-primary/30">
                <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{totalInvested}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10"><Clock className="h-5 w-5 text-yellow-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Wallet className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Equity</p>
                <p className="text-2xl font-bold">${totalEquity.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10"><Bot className="h-5 w-5 text-secondary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{botAssignments.filter(b => b.is_active).length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList className="bg-card/80 border border-border/50">
            <TabsTrigger value="clients"><Users className="mr-2 h-4 w-4" />Clients</TabsTrigger>
            <TabsTrigger value="investments"><Wallet className="mr-2 h-4 w-4" />Deposits/Withdrawals</TabsTrigger>
            <TabsTrigger value="bots"><Bot className="mr-2 h-4 w-4" />Bot Assignments</TabsTrigger>
            <TabsTrigger value="performance"><BarChart3 className="mr-2 h-4 w-4" />Performance</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-lg">All Clients</CardTitle></CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="w-full h-48" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No clients yet. Users will appear here after signing up.
                          </TableCell>
                        </TableRow>
                      ) : clients.map((client) => (
                        <TableRow key={client.user_id}>
                          <TableCell className="font-medium">{client.full_name || "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{client.email}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(client.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Select onValueChange={(bot) => assignBot(client.user_id, bot)}>
                              <SelectTrigger className="w-[180px] ml-auto">
                                <SelectValue placeholder="Assign Bot" />
                              </SelectTrigger>
                              <SelectContent>
                                {BOT_LIST.map(bot => (
                                  <SelectItem key={bot} value={bot}>{bot}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments">
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-lg">Deposits & Withdrawals</CardTitle></CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="w-full h-48" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No investment requests yet.
                          </TableCell>
                        </TableRow>
                      ) : investments.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">{inv.profile?.full_name || "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={inv.type === "deposit" ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"}>
                              {inv.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ${Number(inv.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColor(inv.status)}>
                              <span className="flex items-center gap-1">
                                {statusIcon(inv.status)} {inv.status}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(inv.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {inv.status === "pending" && (
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10" onClick={() => updateInvestmentStatus(inv.id, "approved")}>
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => updateInvestmentStatus(inv.id, "rejected")}>
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bot Assignments Tab */}
          <TabsContent value="bots">
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-lg">Bot Assignments</CardTitle></CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="w-full h-48" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Bot</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned</TableHead>
                        <TableHead className="text-right">Toggle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {botAssignments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No bots assigned yet. Assign bots from the Clients tab.
                          </TableCell>
                        </TableRow>
                      ) : botAssignments.map((ba) => (
                        <TableRow key={ba.id}>
                          <TableCell className="font-medium">{ba.profile?.full_name || "—"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4 text-primary" />
                              {ba.bot_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={ba.is_active ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}>
                              {ba.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(ba.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Switch checked={ba.is_active} onCheckedChange={(checked) => toggleBot(ba.id, checked)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className="glass-card border-border/50">
              <CardHeader><CardTitle className="text-lg">Client Performance</CardTitle></CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="w-full h-48" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Invested</TableHead>
                        <TableHead className="text-right">Equity</TableHead>
                        <TableHead className="text-right">ROI %</TableHead>
                        <TableHead className="text-right">Trades</TableHead>
                        <TableHead className="text-right">Win Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performances.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No performance data yet.
                          </TableCell>
                        </TableRow>
                      ) : performances.map((perf) => (
                        <TableRow key={perf.user_id}>
                          <TableCell className="font-medium">{perf.profile?.full_name || "—"}</TableCell>
                          <TableCell className="text-right font-mono">${Number(perf.total_invested).toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono">${Number(perf.current_equity).toLocaleString()}</TableCell>
                          <TableCell className={`text-right font-mono ${Number(perf.roi_percent) >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {Number(perf.roi_percent).toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right font-mono">{perf.total_trades}</TableCell>
                          <TableCell className="text-right font-mono">{(Number(perf.win_rate) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
