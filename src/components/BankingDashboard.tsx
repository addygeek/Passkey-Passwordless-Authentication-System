import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  RefreshCw,
  Download,
  Send,
  Plus,
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface BankingDashboardProps {
  username: string;
  onLogout: () => void;
}

const BankingDashboard: React.FC<BankingDashboardProps> = ({ username, onLogout }) => {
  const [showBalance, setShowBalance] = React.useState(true);
  
  // Generate synthetic banking data
  const accountNumber = `XXXX XXXX ${Math.floor(Math.random() * 9000 + 1000)}`;
  const ifscCode = 'SBIN0000123';
  const branchName = 'Main Branch, Mumbai';
  const customerID = `CID${Math.floor(Math.random() * 900000 + 100000)}`;
  const accountBalance = (Math.random() * 500000 + 50000).toFixed(2);
  const availableBalance = (parseFloat(accountBalance) - Math.random() * 5000).toFixed(2);
  
  const recentTransactions = [
    {
      id: 1,
      type: 'credit',
      description: 'Salary Credit - ABC Corp',
      amount: 85000.00,
      date: '2025-09-01',
      time: '14:30',
      balance: accountBalance
    },
    {
      id: 2,
      type: 'debit',
      description: 'UPI Payment to Amazon',
      amount: 2499.00,
      date: '2025-08-31',
      time: '19:45',
      balance: (parseFloat(accountBalance) + 2499).toFixed(2)
    },
    {
      id: 3,
      type: 'debit',
      description: 'ATM Withdrawal',
      amount: 5000.00,
      date: '2025-08-31',
      time: '11:20',
      balance: (parseFloat(accountBalance) + 7499).toFixed(2)
    },
    {
      id: 4,
      type: 'credit',
      description: 'Interest Credit',
      amount: 1250.50,
      date: '2025-08-30',
      time: '00:01',
      balance: (parseFloat(accountBalance) + 6248.50).toFixed(2)
    }
  ];

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  Passkey Bank
                </h1>
                <p className="text-sm text-muted-foreground">Internet Banking Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100 capitalize">{username}</p>
              </div>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {username}!</h2>
                <p className="text-blue-100 mb-4">Welcome to your secure banking dashboard</p>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <Clock className="w-4 h-4" />
                  <span>Last login: {getCurrentDateTime()}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Biometric Secured
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-mono text-lg font-semibold">{accountNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-semibold">Savings Account</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">IFSC Code</p>
                    <p className="font-mono font-semibold">{ifscCode}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-semibold">{branchName}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Balance Section */}
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {showBalance ? formatCurrency(availableBalance) : '₹ ****.**'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total Balance: {showBalance ? formatCurrency(accountBalance) : '₹ ****.**'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Send className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Transfer</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    <span className="text-xs">Add Payee</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">Statement</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <RefreshCw className="w-5 h-5 text-orange-600" />
                    <span className="text-xs">Refresh</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 dark:bg-green-950/30' 
                            : 'bg-red-100 dark:bg-red-950/30'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.date} • {transaction.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bal: {formatCurrency(transaction.balance)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Profile Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg capitalize">{username}</h3>
                  <p className="text-sm text-muted-foreground">Premium Customer</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Customer ID</p>
                    <p className="font-mono font-semibold">{customerID}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>+91 98765 43210</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{username}@email.com</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Mumbai, Maharashtra</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Biometric Login</span>
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA Enabled</span>
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Security Check</span>
                    <span className="text-sm text-muted-foreground">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Credit Card Application
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Fixed Deposit
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Loan Services
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Investment Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingDashboard;