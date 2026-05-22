import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import DonutChart from './components/DonutChart';
import { SignedIn, SignedOut, UserButton, useUser, useClerk, SignInButton, SignUpButton } from '@clerk/clerk-react';

// ==========================================
// CUSTOM PREMIUM REACT SVG ICONS (Self-contained)
// ==========================================
const DashboardIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

const TransactionsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const SavingsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m12 8-4 4h8Z" />
    <path d="m12 16-4-4h8Z" />
  </svg>
);

const CategoriesIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TrashIcon = () => (
  <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = () => (
  <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = () => (
  <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ==========================================
// CONSTANTS & HELPERS
// ==========================================
const CURRENCIES = {
  Rwf: { symbol: 'Rwf', name: 'Rwandan Franc' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' }
};

const DEFAULT_CATEGORIES = {
  Housing: { color: '#3b82f6', icon: '🏠', budget: 450000 },
  Food: { color: '#f43f5e', icon: '🍔', budget: 150000 },
  Utilities: { color: '#eab308', icon: '⚡', budget: 80000 },
  Transport: { color: '#a855f7', icon: '🚗', budget: 90000 },
  Entertainment: { color: '#f97316', icon: '🎮', budget: 50000 }
};

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const getCurrentMonthYYYYMM = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getTransactionMonth = (tx) => {
  if (!tx.timestamp) return getCurrentMonthYYYYMM();
  return tx.timestamp.slice(0, 7);
};

// ==========================================
// DYNAMIC APP CONTAINER WRAPPER
// ==========================================
function App({ isClerkConfigured }) {
  const [sandboxLoggedIn, setSandboxLoggedIn] = useState(() => {
    return localStorage.getItem('budgetify_sandbox_logged_in') === 'true';
  });
  const [sandboxUser, setSandboxUser] = useState(() => {
    return localStorage.getItem('budgetify_sandbox_user') || 'Guest Developer';
  });

  if (!isClerkConfigured) {
    if (!sandboxLoggedIn) {
      return (
        <SandboxLogin 
          onLogin={(username) => {
            localStorage.setItem('budgetify_sandbox_logged_in', 'true');
            localStorage.setItem('budgetify_sandbox_user', username);
            setSandboxUser(username);
            setSandboxLoggedIn(true);
          }} 
        />
      );
    }
    return (
      <BudgetifyMain 
        isClerk={false} 
        user={{ fullName: sandboxUser, imageUrl: null }} 
        onLogout={() => {
          localStorage.removeItem('budgetify_sandbox_logged_in');
          setSandboxLoggedIn(false);
        }}
      />
    );
  }

  // Under Clerk, wrap rendering in SignedIn / SignedOut flows
  return (
    <>
      <SignedIn>
        <ClerkMainWrapper />
      </SignedIn>
      <SignedOut>
        <ClerkLoginScreen />
      </SignedOut>
    </>
  );
}

// Helper Clerk wrapper to inject hooks correctly under context
const ClerkMainWrapper = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <BudgetifyMain 
      isClerk={true} 
      user={user || { fullName: 'Clerk User', imageUrl: null }} 
      onLogout={() => signOut()} 
    />
  );
};

// Custom Landing page for Clerk
const ClerkLoginScreen = () => {
  return (
    <div className="auth-gate-wrapper animate-fade-in">
      <div className="auth-card">
        <div className="auth-header-logo">B</div>
        <h2 className="auth-title">Budgetify Suite</h2>
        <p className="auth-subtitle">Elevate your financial control with the premium budget planning suite</p>
        
        <div className="auth-btn-group">
          <SignInButton mode="modal">
            <button className="btn-primary" style={{ width: '100%' }}>Sign In to Account</button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <button className="btn-secondary" style={{ width: '100%' }}>Create New Account</button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
};

// Custom Sandbox setup warning page
const SandboxLogin = ({ onLogin }) => {
  const [name, setName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="auth-gate-wrapper animate-fade-in">
      <div className="auth-card">
        <div className="auth-header-logo">B</div>
        <h2 className="auth-title">Budgetify Sandbox</h2>
        <p className="auth-subtitle">Elevate your financial control with the premium budget planning suite</p>
        
        <div className="auth-sandbox-badge">
          <strong>⚠️ Authentication Setup Banner</strong>
          <span>
            <code>VITE_CLERK_PUBLISHABLE_KEY</code> is not configured. Running in Sandbox. Sign-ins will simulate locally.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="auth-btn-group">
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '16px' }}>
            <label className="form-label">Developer Guest Name</label>
            <input
              type="text"
              placeholder="e.g. Guest User"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Enter Local Sandbox
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// CORE APP IMPLEMENTATION MODULE
// ==========================================
function BudgetifyMain({ isClerk, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState(() => localStorage.getItem('budgetify_currency') || 'Rwf');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('budgetify_darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // PWA Installation Trigger States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  });
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined' || !window.navigator) return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/crios/.test(userAgent);
    return isIOSDevice && isSafari;
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA Installation outcome: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setPwaModalOpen(true);
    }
  };


  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgetify_budgets');
    if (saved !== null) return JSON.parse(saved);
    const oldBudgets = localStorage.getItem('budgetPlanner_budgets');
    if (oldBudgets !== null) return JSON.parse(oldBudgets);
    const oldBudget = localStorage.getItem('budgetPlanner_budget');
    const defaultVal = oldBudget !== null ? parseFloat(oldBudget) : 800000;
    return { [getCurrentMonthYYYYMM()]: defaultVal };
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('budgetify_transactions');
    if (saved !== null) return JSON.parse(saved);
    const oldExpenses = localStorage.getItem('budgetPlanner_expenses');
    if (oldExpenses !== null) {
      const expenses = JSON.parse(oldExpenses);
      return expenses.map(exp => ({
        ...exp,
        type: 'expense',
        timestamp: exp.timestamp || new Date().toISOString()
      }));
    }
    return [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('budgetify_categories');
    return saved !== null ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('budgetify_savingsGoals');
    return saved !== null ? JSON.parse(saved) : [
      { id: '1', name: 'Emergency Fund', target: 1500000, current: 650000, deadline: '2026-12-31', color: '#10b981' },
      { id: '2', name: 'Tech Upgrade', target: 1200000, current: 300000, deadline: '2026-09-15', color: '#6366f1' }
    ];
  });

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYYYYMM());
  const [isAddingMonth, setIsAddingMonth] = useState(false);

  // Modals UI states
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txEditId, setTxEditId] = useState(null);
  const [txType, setTxType] = useState('expense');
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState(Object.keys(DEFAULT_CATEGORIES)[0]);
  const [txDatetime, setTxDatetime] = useState(getCurrentDateTimeLocal());

  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalEditId, setGoalEditId] = useState(null);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalColor, setGoalColor] = useState('#6366f1');

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#6366f1');
  const [catIcon, setCatIcon] = useState('🏷️');
  const [catBudget, setCatBudget] = useState('');

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  const [goalTxModalOpen, setGoalTxModalOpen] = useState(false);
  const [goalTxAmount, setGoalTxAmount] = useState('');
  const [goalTxType, setGoalTxType] = useState('deposit');
  const [activeGoalId, setActiveGoalId] = useState(null);

  // Log filter options
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const fileInputRef = useRef(null);

  // Sync back to local preferences
  useEffect(() => {
    localStorage.setItem('budgetify_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('budgetify_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('budgetify_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgetify_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budgetify_savingsGoals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('budgetify_darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Adjust categories default select values safely
  const activeMonthList = Object.keys(categories);
  const safeDefaultCategory = activeMonthList.length > 0 ? activeMonthList[0] : 'Food';

  // Available navigator list
  const monthsFromTxs = transactions.map(t => getTransactionMonth(t));
  const monthsFromBudgets = Object.keys(budgets);
  const availableMonths = Array.from(new Set([...monthsFromTxs, ...monthsFromBudgets, getCurrentMonthYYYYMM()]));
  availableMonths.sort().reverse();

  const filteredMonthTxs = transactions.filter(t => getTransactionMonth(t) === selectedMonth);

  const getActiveBudget = () => {
    if (budgets[selectedMonth]) return budgets[selectedMonth];
    const sorted = Object.keys(budgets).sort().reverse();
    if (sorted.length > 0) return budgets[sorted[0]];
    return 800000;
  };

  const activeBudget = getActiveBudget();

  // Metrics
  const totalIncome = filteredMonthTxs
    .filter(t => t.type === 'income')
    .reduce((acc, c) => acc + parseFloat(c.amount || 0), 0);

  const totalSpent = filteredMonthTxs
    .filter(t => t.type === 'expense')
    .reduce((acc, c) => acc + parseFloat(c.amount || 0), 0);

  const remaining = activeBudget - totalSpent;
  const netCashflow = totalIncome - totalSpent;
  const spentPercentage = activeBudget > 0 ? (totalSpent / activeBudget) * 100 : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

  const formatValue = (amount) => {
    const symbol = CURRENCIES[currency]?.symbol || currency;
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' ' + symbol;
  };

  // Finance copilot alerts
  const getInsights = () => {
    const list = [];
    if (remaining < 0) {
      list.push({
        type: 'danger',
        icon: '⚠️',
        text: `Over-budget Alert! You have exceeded your designated monthly budget by ${formatValue(Math.abs(remaining))}. Consider trimming variable expenses.`
      });
    } else if (spentPercentage >= 85) {
      list.push({
        type: 'warning',
        icon: '⚠️',
        text: `Caution: You have utilized ${spentPercentage.toFixed(0)}% of your monthly budget. Only ${formatValue(remaining)} remains.`
      });
    }

    if (netCashflow < 0) {
      list.push({
        type: 'danger',
        icon: '📉',
        text: `Negative Cashflow: Your expenses exceed your income by ${formatValue(Math.abs(netCashflow))} for this month. You may need to dip into savings.`
      });
    } else if (savingsRate >= 20) {
      list.push({
        type: 'success',
        icon: '📈',
        text: `Exceptional Savings! You have saved ${savingsRate.toFixed(0)}% of your income this month. Keep this up to hit your long-term goals faster!`
      });
    }

    const catExpenses = filteredMonthTxs
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
        return acc;
      }, {});

    Object.keys(categories).forEach(cat => {
      const budgetLimit = categories[cat].budget || 0;
      const spent = catExpenses[cat] || 0;
      if (budgetLimit > 0 && spent > budgetLimit) {
        list.push({
          type: 'warning',
          icon: categories[cat].icon || '🏷️',
          text: `Budget Breach: Spending on "${cat}" (${formatValue(spent)}) is higher than your set category target of ${formatValue(budgetLimit)}.`
        });
      }
    });

    if (list.length === 0) {
      list.push({
        type: 'success',
        icon: '🛡️',
        text: "You're in control! No budget breaches or negative cashflow detected for this month. Looking healthy!"
      });
    }
    return list;
  };

  const currentInsights = getInsights();

  // Handlers
  const handleEditBudget = () => {
    setBudgetInput(activeBudget.toString());
    setIsEditingBudget(true);
  };

  const handleSaveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val >= 0) {
      setBudgets(prev => ({ ...prev, [selectedMonth]: val }));
    }
    setIsEditingBudget(false);
  };

  const handleOpenAddTx = () => {
    setTxEditId(null);
    setTxType('expense');
    setTxDesc('');
    setTxAmount('');
    setTxCategory(safeDefaultCategory);
    setTxDatetime(getCurrentDateTimeLocal());
    setTxModalOpen(true);
  };

  const handleOpenEditTx = (tx) => {
    setTxEditId(tx.id);
    setTxType(tx.type || 'expense');
    setTxDesc(tx.description);
    setTxAmount(tx.amount.toString());
    setTxCategory(tx.category || safeDefaultCategory);
    if (tx.timestamp) {
      const d = new Date(tx.timestamp);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setTxDatetime(d.toISOString().slice(0, 16));
    } else {
      setTxDatetime(getCurrentDateTimeLocal());
    }
    setTxModalOpen(true);
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const amount = parseFloat(txAmount);
    if (!txDesc.trim() || isNaN(amount) || amount <= 0) return;

    if (txEditId) {
      setTransactions(transactions.map(t =>
        t.id === txEditId
          ? {
              ...t,
              type: txType,
              description: txDesc.trim(),
              amount: amount.toFixed(2),
              category: txType === 'income' ? 'Income' : txCategory,
              timestamp: new Date(txDatetime).toISOString()
            }
          : t
      ));
    } else {
      const newTx = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        type: txType,
        description: txDesc.trim(),
        amount: amount.toFixed(2),
        category: txType === 'income' ? 'Income' : txCategory,
        timestamp: new Date(txDatetime).toISOString()
      };
      setTransactions([newTx, ...transactions]);
    }
    setTxModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleOpenAddGoal = () => {
    setGoalEditId(null);
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDeadline('');
    setGoalColor('#6366f1');
    setGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal) => {
    setGoalEditId(goal.id);
    setGoalName(goal.name);
    setGoalTarget(goal.target.toString());
    setGoalCurrent(goal.current.toString());
    setGoalDeadline(goal.deadline || '');
    setGoalColor(goal.color || '#6366f1');
    setGoalModalOpen(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const targetVal = parseFloat(goalTarget);
    const currentVal = parseFloat(goalCurrent || 0);
    if (!goalName.trim() || isNaN(targetVal) || targetVal <= 0) return;

    if (goalEditId) {
      setSavingsGoals(savingsGoals.map(g =>
        g.id === goalEditId
          ? {
              ...g,
              name: goalName.trim(),
              target: targetVal,
              current: currentVal,
              deadline: goalDeadline,
              color: goalColor
            }
          : g
      ));
    } else {
      const newGoal = {
        id: Date.now().toString(),
        name: goalName.trim(),
        target: targetVal,
        current: currentVal,
        deadline: goalDeadline,
        color: goalColor
      };
      setSavingsGoals([...savingsGoals, newGoal]);
    }
    setGoalModalOpen(false);
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm("Delete this savings goal permanently?")) {
      setSavingsGoals(savingsGoals.filter(g => g.id !== id));
    }
  };

  const handleOpenGoalTx = (goalId, type) => {
    setActiveGoalId(goalId);
    setGoalTxType(type);
    setGoalTxAmount('');
    setGoalTxModalOpen(true);
  };

  const handleSaveGoalTx = (e) => {
    e.preventDefault();
    const amount = parseFloat(goalTxAmount);
    if (isNaN(amount) || amount <= 0 || !activeGoalId) return;

    const goal = savingsGoals.find(g => g.id === activeGoalId);
    if (!goal) return;

    let newCurrent = goal.current;
    if (goalTxType === 'deposit') {
      newCurrent += amount;
    } else {
      newCurrent = Math.max(0, newCurrent - amount);
    }

    setSavingsGoals(savingsGoals.map(g =>
      g.id === activeGoalId ? { ...g, current: newCurrent } : g
    ));

    const syncTx = {
      id: Date.now().toString(),
      type: goalTxType === 'deposit' ? 'expense' : 'income',
      description: `${goalTxType === 'deposit' ? 'Saved towards' : 'Withdrew from'} ${goal.name}`,
      amount: amount.toFixed(2),
      category: 'Savings Transfer',
      timestamp: new Date().toISOString()
    };
    setTransactions([syncTx, ...transactions]);
    setGoalTxModalOpen(false);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const targetKey = catName.trim();
    const budgetVal = parseFloat(catBudget || 0);

    setCategories(prev => ({
      ...prev,
      [targetKey]: {
        color: catColor,
        icon: catIcon,
        budget: isNaN(budgetVal) ? 0 : budgetVal
      }
    }));
    setCatModalOpen(false);
    setCatName('');
    setCatBudget('');
  };

  const handleDeleteCategory = (key) => {
    if (window.confirm(`Delete "${key}" category? Current records will stay unassigned.`)) {
      const updated = { ...categories };
      delete updated[key];
      setCategories(updated);
    }
  };

  const handleClearMonth = () => {
    if (window.confirm("Permanently delete all transactions for the active selected month?")) {
      setTransactions(transactions.filter(t => getTransactionMonth(t) !== selectedMonth));
    }
  };

  const handleExportCSV = () => {
    if (filteredMonthTxs.length === 0) return;
    const headers = ["Type", "Date", "Description", "Category", `Amount (${currency})`];
    const csvContent = [
      headers.join(","),
      ...filteredMonthTxs.map(t => {
        const desc = `"${t.description.replace(/"/g, '""')}"`;
        const date = t.timestamp ? new Date(t.timestamp).toLocaleString() : "N/A";
        return `"${t.type || 'expense'}","${date}",${desc},"${t.category || 'Other'}",${t.amount}`;
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `budgetify_export_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Backup restore
  const handleExportBackup = () => {
    const data = {
      budgets,
      transactions,
      categories,
      savingsGoals,
      currency,
      darkMode,
      backupVersion: '2.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `budgetify_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.transactions && parsed.budgets) {
          if (parsed.currency) setCurrency(parsed.currency);
          if (parsed.budgets) setBudgets(parsed.budgets);
          if (parsed.transactions) setTransactions(parsed.transactions);
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
          if (parsed.darkMode !== undefined) setDarkMode(parsed.darkMode);
          alert("Backup successfully restored!");
          setActiveTab('dashboard');
        } else {
          alert("Invalid backup JSON structure.");
        }
      } catch (err) {
        alert("Failed to parse backup: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleData = () => {
    const thisMonth = getCurrentMonthYYYYMM();
    const prevMonth = (() => {
      const [y, m] = thisMonth.split('-');
      const d = new Date(parseInt(y), parseInt(m) - 2, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })();

    const demoBudgets = {
      [thisMonth]: 800000,
      [prevMonth]: 750000
    };

    const demoCategories = {
      Housing: { color: '#3b82f6', icon: '🏠', budget: 450000 },
      Food: { color: '#f43f5e', icon: '🍔', budget: 150000 },
      Utilities: { color: '#eab308', icon: '⚡', budget: 80000 },
      Transport: { color: '#a855f7', icon: '🚗', budget: 90000 },
      Entertainment: { color: '#f97316', icon: '🎮', budget: 50000 },
      Investments: { color: '#10b981', icon: '📈', budget: 100000 }
    };

    const demoGoals = [
      { id: '1', name: 'Emergency Fund', target: 2000000, current: 1200000, deadline: '2026-12-31', color: '#10b981' },
      { id: '2', name: 'MacBook Pro 16', target: 2500000, current: 800000, deadline: '2026-09-01', color: '#6366f1' },
      { id: '3', name: 'Summer Travel', target: 1000000, current: 950000, deadline: '2026-07-15', color: '#f59e0b' }
    ];

    const demoTxs = [
      { id: 't1', type: 'income', description: 'Monthly Core Salary', amount: '1200000.00', category: 'Income', timestamp: `${thisMonth}-01T09:00:00.000Z` },
      { id: 't2', type: 'income', description: 'Freelance Design Consulting', amount: '250000.00', category: 'Income', timestamp: `${thisMonth}-10T14:30:00.000Z` },
      { id: 't3', type: 'income', description: 'Dividends & Stock Cashout', amount: '60000.00', category: 'Income', timestamp: `${thisMonth}-18T10:00:00.000Z` },
      { id: 't4', type: 'expense', description: 'Apartment Rent payment', amount: '450000.00', category: 'Housing', timestamp: `${thisMonth}-02T10:00:00.000Z` },
      { id: 't5', type: 'expense', description: 'Supermarket Grocery haul', amount: '78000.00', category: 'Food', timestamp: `${thisMonth}-05T18:15:00.000Z` },
      { id: 't6', type: 'expense', description: 'Power grid recharge & Water bill', amount: '65000.00', category: 'Utilities', timestamp: `${thisMonth}-06T11:20:00.000Z` },
      { id: 't7', type: 'expense', description: 'Car fuel refill', amount: '48000.00', category: 'Transport', timestamp: `${thisMonth}-09T17:00:00.000Z` },
      { id: 't8', type: 'expense', description: 'Premium Dine out with friends', amount: '35000.00', category: 'Food', timestamp: `${thisMonth}-12T20:30:00.000Z` },
      { id: 't9', type: 'expense', description: 'Fiber internet connection monthly', amount: '25000.00', category: 'Utilities', timestamp: `${thisMonth}-15T09:00:00.000Z` },
      { id: 'ta1', type: 'expense', description: 'PlayStation Store gaming purchase', amount: '18000.00', category: 'Entertainment', timestamp: `${thisMonth}-16T22:10:00.000Z` },
      { id: 'ta2', type: 'expense', description: 'Regular gym subscription renewal', amount: '30000.00', category: 'Entertainment', timestamp: `${thisMonth}-20T08:00:00.000Z` },
      { id: 'ta3', type: 'expense', description: 'Uber rides to downtown office', amount: '22000.00', category: 'Transport', timestamp: `${thisMonth}-21T08:45:00.000Z` },
      { id: 'ta4', type: 'expense', description: 'S&P 500 Index fund investment', amount: '80000.00', category: 'Investments', timestamp: `${thisMonth}-22T12:00:00.000Z` },
      { id: 'tp1', type: 'income', description: 'Salary', amount: '1200000.00', category: 'Income', timestamp: `${prevMonth}-01T09:00:00.000Z` },
      { id: 'tp2', type: 'expense', description: 'Rent', amount: '450000.00', category: 'Housing', timestamp: `${prevMonth}-02T10:00:00.000Z` },
      { id: 'tp3', type: 'expense', description: 'Groceries', amount: '90000.00', category: 'Food', timestamp: `${prevMonth}-08T15:00:00.000Z` },
      { id: 'tp4', type: 'expense', description: 'Gas stations Fuel', amount: '52000.00', category: 'Transport', timestamp: `${prevMonth}-12T17:30:00.000Z` }
    ];

    setBudgets(demoBudgets);
    setCategories(demoCategories);
    setSavingsGoals(demoGoals);
    setTransactions(demoTxs);
    setSelectedMonth(thisMonth);
    setActiveTab('dashboard');
    alert("Demo playground successfully loaded! Enjoy testing Budgetify.");
  };

  const handleResetAll = () => {
    if (window.confirm("WARNING: This will permanently wipe all dynamic records. Proceed?")) {
      localStorage.clear();
      setBudgets({ [getCurrentMonthYYYYMM()]: 800000 });
      setTransactions([]);
      setCategories(DEFAULT_CATEGORIES);
      setSavingsGoals([]);
      setCurrency('Rwf');
      setDarkMode(false);
      setSelectedMonth(getCurrentMonthYYYYMM());
      setActiveTab('dashboard');
      alert("App data reset completely.");
    }
  };

  // Process transaction sorting
  const getProcessedTransactions = () => {
    let list = [...transactions];
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q));
    }
    if (filterType !== 'all') {
      list = list.filter(t => t.type === filterType);
    }
    if (filterCategory !== 'all') {
      list = list.filter(t => t.category === filterCategory);
    }
    list.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0);
      const dateB = new Date(b.timestamp || 0);
      const valA = parseFloat(a.amount || 0);
      const valB = parseFloat(b.amount || 0);

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'amount-desc':
          return valB - valA;
        case 'amount-asc':
          return valA - valB;
        case 'date-desc':
        default:
          return dateB - dateA;
      }
    });
    return list;
  };

  const processedTransactions = getProcessedTransactions();

  // Tab views
  const renderDashboard = () => {
    return (
      <div className="animate-fade-in">
        <div className="metrics-grid">
          <div className="metric-card">
            <div>
              <div className="metric-title">Available Monthly Budget</div>
              <div className="metric-value budget">
                {isEditingBudget ? (
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onBlur={handleSaveBudget}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
                    autoFocus
                    style={{
                      width: '120px',
                      fontSize: '18px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)'
                    }}
                  />
                ) : (
                  <>
                    {formatValue(activeBudget)}
                    <button className="budget-edit-btn" onClick={handleEditBudget}>Edit</button>
                  </>
                )}
              </div>
            </div>
            <div className="metric-meta">
              Target for {new Date(selectedMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="metric-card">
            <div>
              <div className="metric-title">Total Cash Inflow</div>
              <div className="metric-value income">+{formatValue(totalIncome)}</div>
            </div>
            <div className="metric-meta">From all income items</div>
          </div>

          <div className="metric-card">
            <div>
              <div className="metric-title">Total Cash Outflow</div>
              <div className="metric-value expense">-{formatValue(totalSpent)}</div>
            </div>
            <div className="metric-meta">
              {spentPercentage.toFixed(0)}% of monthly budget utilized
            </div>
          </div>

          <div className="metric-card">
            <div>
              <div className="metric-title">Net Remaining Balance</div>
              <div className="metric-value net" style={{ color: remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatValue(remaining)}
              </div>
            </div>
            <div className="metric-meta">Remaining pocket balance</div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifycontent: 'space-between', marginBottom: '8px', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>MONTHLY BUDGET USAGE</span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: spentPercentage > 100 ? 'var(--danger)' : 'var(--primary)' }}>
              {spentPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(spentPercentage, 100)}%`,
                backgroundColor: spentPercentage < 60 ? 'var(--success)' : spentPercentage < 90 ? 'var(--warning)' : 'var(--danger)'
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {spentPercentage > 100 
              ? `You have exceeded your target budget limit by ${formatValue(Math.abs(remaining))}.`
              : `You have ${formatValue(remaining)} safe to spend before going over budget.`
            }
          </div>
        </div>

        <div className="dashboard-layout">
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.25px' }}>
              Category Outflow Analysis
            </h3>
            <DonutChart expenses={filteredMonthTxs.filter(t => t.type === 'expense')} categories={categories} currencySymbol={CURRENCIES[currency]?.symbol || currency} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.25px' }}>
                Finance Copilot Insights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentInsights.map((ins, index) => (
                  <div key={index} className={`insight-box ${ins.type}`}>
                    <span className="insight-icon">{ins.icon}</span>
                    <span className="insight-text">{ins.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.25px' }}>Savings Goals</h3>
                <button className="budget-edit-btn" style={{ marginLeft: 0 }} onClick={() => setActiveTab('savings')}>View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savingsGoals.slice(0, 2).map(goal => {
                  const percent = Math.min((goal.current / goal.target) * 100, 100);
                  return (
                    <div key={goal.id} style={{ background: 'var(--input-bg)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                        <span>{goal.name}</span>
                        <span style={{ color: goal.color }}>{percent.toFixed(0)}%</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '6px', marginBottom: '6px' }}>
                        <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: goal.color }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        <span>Target: {formatValue(goal.target)}</span>
                        <span>Saved: {formatValue(goal.current)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransactions = () => {
    return (
      <div className="animate-fade-in">
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search transactions..."
              className="form-input filter-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="form-select filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Inflow (Income)</option>
            <option value="expense">Outflow (Expense)</option>
          </select>

          <select className="form-select filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Income">Income Inflow</option>
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="Savings Transfer">Savings Transfers</option>
          </select>

          <select className="form-select filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>

          {filteredMonthTxs.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px' }} onClick={handleExportCSV}>
                Export Month
              </button>
              <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px' }} onClick={handleClearMonth}>
                Clear Month
              </button>
            </div>
          )}
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Active Transaction Log</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Showing {processedTransactions.length} entries
            </span>
          </div>

          {processedTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '28px', marginBottom: '8px' }}>📄</p>
              <p style={{ fontSize: '14px', fontWeight: '600' }}>No matching transactions found.</p>
              <button className="btn-primary" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '13px' }} onClick={handleOpenAddTx}>
                Add First Transaction
              </button>
            </div>
          ) : (
            <ul className="transaction-list-rich">
              {processedTransactions.map(tx => {
                const isInc = tx.type === 'income';
                const catDetails = categories[tx.category] || { color: '#64748b', icon: '🏷️' };
                const formattedDate = tx.timestamp 
                  ? new Date(tx.timestamp).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                  : "N/A";

                return (
                  <li key={tx.id} className="transaction-card">
                    <div className="transaction-card-left">
                      <div
                        className="category-icon-box"
                        style={{
                          background: isInc 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : tx.category === 'Savings Transfer'
                            ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            : `linear-gradient(135deg, ${catDetails.color} 0%, ${catDetails.color}dd 100%)`
                        }}
                      >
                        {isInc ? '💰' : tx.category === 'Savings Transfer' ? '🪙' : catDetails.icon || '🏷️'}
                      </div>
                      <div className="transaction-details">
                        <span className="transaction-desc">{tx.description}</span>
                        <div className="transaction-meta-row">
                          <span
                            className="category-chip"
                            style={{
                              background: isInc ? 'var(--success-light)' : 'var(--primary-light)',
                              color: isInc ? 'var(--success)' : 'var(--primary)'
                            }}
                          >
                            {tx.category || (isInc ? 'Income' : 'Other')}
                          </span>
                          <span>•</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="transaction-card-right">
                      <span className={`transaction-rich-amount ${tx.type}`}>
                        {isInc ? '+' : '-'}{formatValue(tx.amount)}
                      </span>
                      <button className="action-icon-btn" onClick={() => handleOpenEditTx(tx)} aria-label="Edit transaction">
                        <EditIcon />
                      </button>
                      <button className="action-icon-btn delete" onClick={() => handleDeleteTransaction(tx.id)} aria-label="Delete transaction">
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  };

  const renderSavings = () => {
    return (
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Active Savings Goals</h3>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={handleOpenAddGoal}>
            <PlusIcon /> Add Goal
          </button>
        </div>

        {savingsGoals.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>🐷</p>
            <h4 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '8px' }}>No savings goals created yet</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Define custom targets like purchasing an emergency fund pool.</p>
            <button className="btn-primary" style={{ marginTop: '16px' }} onClick={handleOpenAddGoal}>
              Create Savings Goal
            </button>
          </div>
        ) : (
          <div className="goals-grid">
            {savingsGoals.map(goal => {
              const percent = Math.min((goal.current / goal.target) * 100, 100);
              const isAchieved = goal.current >= goal.target;
              const deadlineStr = goal.deadline 
                ? new Date(goal.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                : 'No target date';

              return (
                <div key={goal.id} className="goal-card" style={{ borderTop: `4px solid ${goal.color}` }}>
                  <div>
                    <div className="goal-card-header">
                      <div>
                        <span className="goal-title">{goal.name}</span>
                        <div className="goal-date">Target Date: {deadlineStr}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="action-icon-btn" onClick={() => handleOpenEditGoal(goal)}>
                          <EditIcon />
                        </button>
                        <button className="action-icon-btn delete" onClick={() => handleDeleteGoal(goal.id)}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    <div className="goal-amount-row">
                      <span className="goal-current-amount" style={{ color: goal.color }}>
                        {formatValue(goal.current)}
                      </span>
                      <span className="goal-target-amount">
                        of {formatValue(goal.target)}
                      </span>
                    </div>

                    <div className="progress-bar-container" style={{ height: '8px', marginTop: '12px', marginBottom: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: goal.color }} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      <span>{percent.toFixed(0)}% Completed</span>
                      {isAchieved && <span style={{ color: 'var(--success)' }}>🎉 Target Met!</span>}
                    </div>
                  </div>

                  <div className="goal-actions">
                    <button className="goal-btn-action deposit" onClick={() => handleOpenGoalTx(goal.id, 'deposit')}>
                      Deposit
                    </button>
                    <button className="goal-btn-action" onClick={() => handleOpenGoalTx(goal.id, 'withdraw')}>
                      Withdraw
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderCategories = () => {
    return (
      <div className="animate-fade-in">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Dynamic Expense Categories</h3>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setCatModalOpen(true)}>
              <PlusIcon /> New Category
            </button>
          </div>

          <div className="categories-list">
            {Object.keys(categories).map(catKey => {
              const cat = categories[catKey];
              return (
                <div key={catKey} className="category-card">
                  <div className="category-desc-col">
                    <div className="category-name-title">
                      <span style={{ fontSize: '20px' }}>{cat.icon || '🏷️'}</span>
                      <span>{catKey}</span>
                      <span className="category-color-dot" style={{ backgroundColor: cat.color }} />
                    </div>
                    <div className="category-budget-amount">
                      Target Budget Cap: {cat.budget > 0 ? formatValue(cat.budget) : 'Unrestricted'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}
                      onClick={() => handleDeleteCategory(catKey)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="animate-fade-in">
        <div className="glass-card">
          <h3 className="settings-section-title">General Preferences</h3>
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label className="form-label">Preferred Currency</label>
            <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {Object.keys(CURRENCIES).map(key => (
                <option key={key} value={key}>
                  {CURRENCIES[key].name} ({CURRENCIES[key].symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="settings-section-title">App Installation (PWA)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Download and run Budgetify as a standalone desktop or mobile application. Run directly from your dock or home screen with full offline access.
          </p>
          {isStandalone ? (
            <div className="pwa-install-action-box" style={{ borderLeft: '3px solid var(--success)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--success)' }}>✓ App Installed / Standalone Active</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Budgetify is fully offline-enabled and running in standalone mode. To install on another browser, look for the install icon in your URL search bar.
                </p>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="pwa-install-action-box">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>App Install Available</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get instant shortcuts and standalone frame features.</p>
              </div>
              <button className="btn-primary btn-pwa-action" onClick={handleInstallApp}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Install Application
              </button>
            </div>
          ) : isIOS ? (
            <div className="pwa-install-action-box" style={{ borderLeft: '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>Install on iOS Safari</span>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Tap the <strong style={{ color: 'var(--primary)' }}>Share</strong> button in Safari's bottom toolbar and select <strong style={{ color: 'var(--primary)' }}>Add to Home Screen</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="pwa-install-action-box">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>Install Budgetify</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Learn how to add the application to your desktop dock or home screen.</p>
              </div>
              <button className="btn-primary btn-pwa-action" onClick={() => setPwaModalOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                View Install Guide
              </button>
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 className="settings-section-title">Data Administration</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Back up your personal cashflow transactions locally or wipe clean to start fresh.
          </p>

          <div className="settings-grid">
            <div className="settings-action-card">
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>Demo Playground</h4>
                <p className="settings-action-desc">
                  Populate this app with premium pre-filled mock records to experience dashboard visualizations instantly.
                </p>
              </div>
              <button className="btn-primary" onClick={handleLoadSampleData}>
                Load Demo Playground
              </button>
            </div>

            <div className="settings-action-card">
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>Data Backup (Export)</h4>
                <p className="settings-action-desc">
                  Export all dynamic records securely into a local JSON archive.
                </p>
              </div>
              <button className="btn-secondary" onClick={handleExportBackup}>
                Export Backup File
              </button>
            </div>

            <div className="settings-action-card">
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>Data Restore (Import)</h4>
                <p className="settings-action-desc">
                  Restore previous dynamic state configurations from your exported JSON backup file.
                </p>
              </div>
              <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImportBackup} />
              <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>
                Import JSON Backup
              </button>
            </div>

            <div className="settings-action-card" style={{ border: '1px solid var(--danger-light)' }}>
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px', color: 'var(--danger)' }}>Data Reset (Clear All)</h4>
                <p className="settings-action-desc">
                  Irreversibly delete all dynamic records, custom categories, saving goals, and preferences.
                </p>
              </div>
              <button className="btn-danger" onClick={handleResetAll}>
                Reset All Records
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', padding: '24px 20px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontWeight: '800', fontSize: '14px', marginBottom: '6px' }}>Account Status</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Logged in as: <strong>{user.fullName}</strong> {isClerk ? '(Verified via Clerk)' : '(Sandbox Mode)'}
          </p>
          <button className="btn-danger" onClick={onLogout} style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '8px' }}>
            🚪 Sign Out of Account
          </button>
        </div>
      </div>
    );
  };

  const renderPwaInstructionModal = () => {
    if (!pwaModalOpen) return null;

    // Detect browser / platform
    const ua = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
    const isIOSMobile = /iphone|ipad|ipod/.test(ua);
    const isSafariBrowser = /safari/.test(ua) && !/crios/.test(ua) && !/chrome/.test(ua);
    const isFirefoxBrowser = /firefox/.test(ua);

    return (
      <div className="modal-overlay" onClick={() => setPwaModalOpen(false)}>
        <div className="modal-content glass-card pwa-guide-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setPwaModalOpen(false)} aria-label="Close modal">&times;</button>
          <div className="modal-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Install Budgetify
            </h3>
          </div>

          <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px', textAlign: 'left' }}>
            {isIOSMobile ? (
              <div className="pwa-guide-steps">
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                  To run Budgetify as a standalone mobile app on iOS Safari:
                </p>
                <ol className="pwa-steps-list" style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Tap the <strong>Share</strong> button <span style={{ fontSize: '16px' }}>⎋</span> in Safari's bottom toolbar.
                  </li>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Scroll down the share sheet and select <strong>Add to Home Screen</strong> <span style={{ fontSize: '16px' }}>⊞</span>.
                  </li>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Tap <strong>Add</strong> in the top-right corner to complete the installation.
                  </li>
                </ol>
              </div>
            ) : isSafariBrowser ? (
              <div className="pwa-guide-steps">
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                  To install Budgetify on Safari for macOS:
                </p>
                <ol className="pwa-steps-list" style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Click the <strong>File</strong> menu in the Safari top menu bar.
                  </li>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Select <strong>Add to Dock...</strong>.
                  </li>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Confirm the app name and click <strong>Add</strong> to put it directly in your Dock.
                  </li>
                </ol>
              </div>
            ) : isFirefoxBrowser ? (
              <div className="pwa-guide-steps">
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                  Firefox does not support programmatic app installation, but you can easily use standard Chromium browsers:
                </p>
                <ol className="pwa-steps-list" style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Open Budgetify in <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, or <strong>Brave</strong>.
                  </li>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Click the <strong>Install</strong> icon in the address bar or the download FAB in the bottom right corner to install directly.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="pwa-guide-steps">
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                  Follow these simple steps to install Budgetify on your device:
                </p>
                <ol className="pwa-steps-list" style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Look at your browser's address bar (at the top-right) and locate the <strong>Install App</strong> icon (usually a computer screen with a downward arrow, or a '+' plus symbol).
                  </li>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Alternatively, click the three dots/settings icon in the browser menu and select <strong>Save and share → Install page...</strong> (or <strong>Install Budgetify...</strong>).
                  </li>
                  <li style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    Confirm the installation prompt to add Budgetify to your dock, desktop, or home screen.
                  </li>
                </ol>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={() => setPwaModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '10px' }}>
              Got It
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <div>
          <div className="brand-section">
            <div className="brand-logo">B</div>
            <div className="brand-name">Budgetify</div>
            
            {/* Desktop User Avatar */}
            <div style={{ marginLeft: 'auto' }}>
              {isClerk ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div 
                  className="category-icon-box" 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    fontSize: '14px', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  onClick={onLogout}
                  title="Click to logout of Sandbox"
                >
                  {user.fullName ? user.fullName[0].toUpperCase() : 'G'}
                </div>
              )}
            </div>
          </div>

          <nav>
            <ul className="nav-menu">
              <li>
                <button className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                  <DashboardIcon /> Dashboard
                </button>
              </li>
              <li>
                <button className={`nav-item-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
                  <TransactionsIcon /> Transactions
                </button>
              </li>
              <li>
                <button className={`nav-item-btn ${activeTab === 'savings' ? 'active' : ''}`} onClick={() => setActiveTab('savings')}>
                  <SavingsIcon /> Savings Goals
                </button>
              </li>
              <li>
                <button className={`nav-item-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
                  <CategoriesIcon /> Categories
                </button>
              </li>
              <li>
                <button className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                  <SettingsIcon /> Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>ACTIVE MONTH</span>
            {isAddingMonth ? (
              <input
                type="month"
                className="form-input"
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onChange={(e) => {
                  if (e.target.value) {
                    const newMonth = e.target.value;
                    setBudgets(prev => ({ ...prev, [newMonth]: activeBudget }));
                    setSelectedMonth(newMonth);
                  }
                  setIsAddingMonth(false);
                }}
                onBlur={() => setIsAddingMonth(false)}
                autoFocus
              />
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className="form-select"
                  style={{ padding: '6px 28px 6px 12px', fontSize: '13px', backgroundPosition: 'right 10px center' }}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {availableMonths.map(m => {
                    const [year, month] = m.split('-');
                    const date = new Date(year, parseInt(month) - 1);
                    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    return <option key={m} value={m}>{monthName}</option>;
                  })}
                </select>
                <button
                  className="btn-primary"
                  style={{ padding: '6px 10px', minWidth: '32px', borderRadius: '8px', fontSize: '14px' }}
                  onClick={() => setIsAddingMonth(true)}
                  title="Add different month"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {!isStandalone && (
            <button 
              className="btn-pwa-install" 
              onClick={handleInstallApp}
              title="Download App"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download App
            </button>
          )}

          <div className="dark-mode-card">
            <span>Dark mode Theme</span>
            <label className="theme-switch">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="slider-switch" />
            </label>
          </div>

          <button 
            className="btn-danger" 
            style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '12px', marginTop: '8px', display: 'flex', justifyContent: 'center' }}
            onClick={onLogout}
          >
            Sign Out
          </button>

          <footer style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '8px', textAlign: 'center' }}>
            Created by{' '}
            <a
              href="https://github.com/nshh123"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}
            >
              @nshh123
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </footer>
        </div>
      </aside>

      <main className="app-main">
        <div className="view-header">
          <div>
            <span className="view-subtitle">{activeTab.toUpperCase() === 'DASHBOARD' ? 'FINANCIAL SUMMARY' : 'BUDGETIFY SUITE'}</span>
            <h2 className="view-title">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'transactions' && 'Transactions log'}
              {activeTab === 'savings' && 'Savings Targets'}
              {activeTab === 'categories' && 'Categories target caps'}
              {activeTab === 'settings' && 'System configuration'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }} className="app-sidebar-hidden">
                Active month:
              </span>
              <select
                className="form-select filter-select"
                style={{ width: 'auto', padding: '6px 28px 6px 12px', fontSize: '13px', backgroundPosition: 'right 10px center' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {availableMonths.map(m => {
                  const [year, month] = m.split('-');
                  const date = new Date(year, parseInt(month) - 1);
                  const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                  return <option key={m} value={m}>{monthName}</option>;
                })}
              </select>
            </div>

            {/* Mobile Header User Profile */}
            <div className="mobile-header-profile">
              {isClerk ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div 
                  className="category-icon-box" 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    fontSize: '14px', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  onClick={onLogout}
                  title="Click to logout of Sandbox"
                >
                  {user.fullName ? user.fullName[0].toUpperCase() : 'G'}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'savings' && renderSavings()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {!isStandalone && (
        <button className="fab-download-btn" onClick={handleInstallApp} title="Download App" aria-label="Download App">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      )}

      <button className="fab-btn" onClick={handleOpenAddTx} title="Add transaction entry" aria-label="Add transaction entry">
        <PlusIcon />
      </button>

      <nav className="bottom-nav">
        <button className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <DashboardIcon /> Summary
        </button>
        <button className={`bottom-nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
          <TransactionsIcon /> Ledger
        </button>
        <button className={`bottom-nav-item ${activeTab === 'savings' ? 'active' : ''}`} onClick={() => setActiveTab('savings')}>
          <SavingsIcon /> Targets
        </button>
        <button className={`bottom-nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          <CategoriesIcon /> Labels
        </button>
        <button className={`bottom-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <SettingsIcon /> Prefs
        </button>
      </nav>

      {/* OVERLAY DIALOGS */}
      {txModalOpen && (
        <div className="modal-overlay" onClick={() => setTxModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setTxModalOpen(false)}>&times;</button>
            <h3 className="modal-title">{txEditId ? 'Edit transaction' : 'Add transaction'}</h3>
            
            <form onSubmit={handleSaveTransaction}>
              <div className="form-group">
                <label className="form-label">Flow Direction Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="goal-btn-action deposit"
                    style={{
                      flex: 1,
                      border: txType === 'income' ? '2px solid var(--success)' : '1px solid var(--border-color)',
                      background: txType === 'income' ? 'var(--success-light)' : 'transparent',
                      color: txType === 'income' ? 'var(--success)' : 'var(--text-secondary)'
                    }}
                    onClick={() => setTxType('income')}
                  >
                    📈 Income Inflow
                  </button>
                  <button
                    type="button"
                    className="goal-btn-action"
                    style={{
                      flex: 1,
                      border: txType === 'expense' ? '2px solid var(--danger)' : '1px solid var(--border-color)',
                      background: txType === 'expense' ? 'var(--danger-light)' : 'transparent',
                      color: txType === 'expense' ? 'var(--danger)' : 'var(--text-secondary)'
                    }}
                    onClick={() => setTxType('expense')}
                  >
                    📉 Expense Outflow
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction Description</label>
                <input
                  type="text"
                  placeholder="e.g. Core salary, grocery shopping"
                  className="form-input"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount Value ({CURRENCIES[currency]?.symbol || currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  min="0.01"
                  step="0.01"
                  className="form-input"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                />
              </div>

              {txType === 'expense' && (
                <div className="form-group">
                  <label className="form-label">Expense Label Category</label>
                  <select
                    className="form-select"
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                  >
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Savings Transfer">Savings Transfer</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Timestamp Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={txDatetime}
                  onChange={(e) => setTxDatetime(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {txEditId ? 'Update Log' : 'Save Entry'}
                </button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setTxModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {goalModalOpen && (
        <div className="modal-overlay" onClick={() => setGoalModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setGoalModalOpen(false)}>&times;</button>
            <h3 className="modal-title">{goalEditId ? 'Edit savings goal' : 'New savings goal'}</h3>

            <form onSubmit={handleSaveGoal}>
              <div className="form-group">
                <label className="form-label">Goal Target Label</label>
                <input
                  type="text"
                  placeholder="e.g. Emergency Fund"
                  className="form-input"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Target Amount ({CURRENCIES[currency]?.symbol || currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  min="1"
                  className="form-input"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount Saved So Far ({CURRENCIES[currency]?.symbol || currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  min="0"
                  className="form-input"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deadline Target Date</label>
                <input type="date" className="form-input" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Theme Color Accent</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#06b6d4'].map(colorVal => (
                    <button
                      key={colorVal}
                      type="button"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: colorVal,
                        border: goalColor === colorVal ? '3px solid var(--text-primary)' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setGoalColor(colorVal)}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {goalEditId ? 'Update Target' : 'Create Goal'}
                </button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setGoalModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {goalTxModalOpen && (
        <div className="modal-overlay" onClick={() => setGoalTxModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setGoalTxModalOpen(false)}>&times;</button>
            <h3 className="modal-title">
              {goalTxType === 'deposit' ? 'Contribute Savings' : 'Withdraw Savings'}
            </h3>

            <form onSubmit={handleSaveGoalTx}>
              <div className="form-group">
                <label className="form-label">Amount Value ({CURRENCIES[currency]?.symbol || currency})</label>
                <input
                  type="number"
                  placeholder="Enter transfer value"
                  min="0.01"
                  step="0.01"
                  className="form-input"
                  value={goalTxAmount}
                  onChange={(e) => setGoalTxAmount(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: '600' }}>
                💡 Note: This action will automatically record a matching ledger transaction to sync your accounts balances.
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Submit Transfer
                </button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setGoalTxModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {catModalOpen && (
        <div className="modal-overlay" onClick={() => setCatModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCatModalOpen(false)}>&times;</button>
            <h3 className="modal-title">New expense label</h3>

            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Subscriptions"
                  className="form-input"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Budget Cap ({CURRENCIES[currency]?.symbol || currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 50000 (Optional)"
                  min="0"
                  className="form-input"
                  value={catBudget}
                  onChange={(e) => setCatBudget(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Badge Icon Emoji</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['🛍️', '🛫', '🍿', '💡', '🎓', '🏥', '💊', '🍷', '🏠', '🍔', '🚗', '🎮'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: catIcon === emoji ? 'var(--primary-light)' : 'var(--input-bg)',
                        border: catIcon === emoji ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => setCatIcon(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Theme Color Accent</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#06b6d4'].map(colorVal => (
                    <button
                      key={colorVal}
                      type="button"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: colorVal,
                        border: catColor === colorVal ? '3px solid var(--text-primary)' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setCatColor(colorVal)}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Create Label
                </button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setCatModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {renderPwaInstructionModal()}
    </div>
  );
}

export default App;
