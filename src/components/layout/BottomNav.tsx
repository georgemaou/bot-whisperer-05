import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, History, Shield, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/backtest", icon: History, label: "Backtest" },
];

export function BottomNav() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const dynamicItems = [
    ...navItems,
    ...(isAdmin ? [{ path: "/admin", icon: Shield, label: "Admin" }] : []),
    ...(user && !isAdmin ? [{ path: "/dashboard", icon: BarChart3, label: "Portfolio" }] : []),
    ...(!user ? [{ path: "/auth", icon: LogIn, label: "Login" }] : [{ path: "/dashboard", icon: User, label: "Account" }]),
  ];

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {dynamicItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_hsl(170,100%,50%)]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="h-0.5 w-4 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
