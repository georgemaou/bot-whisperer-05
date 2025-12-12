// API configuration - update this to your FastAPI backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface BotStatus {
  equity: number;
  drawdown: number;
  daily_pnl: number;
  win_rate: number;
  trades_today: number;
  can_trade: boolean;
  timestamp: string;
  peak_equity: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  type: string;
}

export interface HistoricalEquity {
  timestamps: string[];
  equity: number[];
}

export interface BotSettings {
  max_drawdown: number;
  daily_loss_limit: number;
  max_trades_per_day: number;
  position_size_percent: number;
}

// Mock data for development
const mockStatus: BotStatus = {
  equity: 10542.87,
  drawdown: 0.032,
  daily_pnl: 127.45,
  win_rate: 0.68,
  trades_today: 12,
  can_trade: true,
  timestamp: new Date().toISOString(),
  peak_equity: 10890.00,
  total_trades: 156,
  winning_trades: 106,
  losing_trades: 50,
};

const mockAlerts: Alert[] = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), level: 'info', message: 'Trade executed: LONG BTC/USDT @ 43,250.00', type: 'trade' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), level: 'info', message: 'Take profit hit: +2.3% on ETH/USDT', type: 'trade' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), level: 'warning', message: 'Approaching daily loss limit (85%)', type: 'risk' },
  { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), level: 'info', message: 'New signal detected: SOL/USDT bullish divergence', type: 'signal' },
  { id: '5', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), level: 'critical', message: 'Stop loss triggered: -1.5% on AVAX/USDT', type: 'trade' },
];

const generateMockEquityHistory = (): HistoricalEquity => {
  const timestamps: string[] = [];
  const equity: number[] = [];
  let currentEquity = 10000;
  
  for (let i = 24; i >= 0; i--) {
    const date = new Date(Date.now() - i * 1000 * 60 * 60);
    timestamps.push(date.toISOString());
    currentEquity += (Math.random() - 0.45) * 100;
    equity.push(Math.max(currentEquity, 9500));
  }
  
  return { timestamps, equity };
};

const USE_MOCK = true; // Set to false when connecting to real API

export const api = {
  async getStatus(): Promise<BotStatus> {
    if (USE_MOCK) {
      return { ...mockStatus, timestamp: new Date().toISOString() };
    }
    const response = await fetch(`${API_BASE_URL}/api/status`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  },

  async startBot(): Promise<{ message: string }> {
    if (USE_MOCK) {
      return { message: 'Bot started successfully' };
    }
    const response = await fetch(`${API_BASE_URL}/api/start`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to start bot');
    return response.json();
  },

  async stopBot(): Promise<{ message: string }> {
    if (USE_MOCK) {
      return { message: 'Bot stopped successfully' };
    }
    const response = await fetch(`${API_BASE_URL}/api/stop`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to stop bot');
    return response.json();
  },

  async getAlerts(limit: number = 10): Promise<Alert[]> {
    if (USE_MOCK) {
      return mockAlerts.slice(0, limit);
    }
    const response = await fetch(`${API_BASE_URL}/api/alerts?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async getHistoricalEquity(): Promise<HistoricalEquity> {
    if (USE_MOCK) {
      return generateMockEquityHistory();
    }
    const response = await fetch(`${API_BASE_URL}/api/historical-equity`);
    if (!response.ok) throw new Error('Failed to fetch historical equity');
    return response.json();
  },

  async updateSettings(settings: Partial<BotSettings>): Promise<{ message: string }> {
    if (USE_MOCK) {
      return { message: 'Settings updated successfully' };
    }
    const response = await fetch(`${API_BASE_URL}/api/update-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  },
};
