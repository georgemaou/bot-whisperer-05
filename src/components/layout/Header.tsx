import { Link } from "react-router-dom";
import { Brain, Sparkles, History, Shield, Wallet, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  lastUpdated?: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="border-b border-border/40 bg-card/60 backdrop-blur-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-brand glow-primary animate-float">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gradient-brand">DeepSeek</h1>
                <Badge variant="outline" className="text-[9px] border-primary/30 text-primary hidden sm:inline-flex">
                  AI BOT
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground items-center gap-1 hidden sm:flex">
                <Sparkles className="h-2.5 w-2.5" />
                Bitget GetAgent Arena
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/backtest">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <History className="mr-1.5 h-4 w-4" />
                Backtest
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Shield className="mr-1.5 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            {user && !isAdmin && (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Wallet className="mr-1.5 h-4 w-4" />
                  Portfolio
                </Button>
              </Link>
            )}

            <div className="w-px h-6 bg-border mx-1" />

            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-brand text-primary-foreground hover:opacity-90">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}

            {lastUpdated && (
              <div className="text-right ml-2">
                <p className="text-[10px] text-muted-foreground">Updated</p>
                <p className="text-xs font-mono text-foreground">{lastUpdated}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
