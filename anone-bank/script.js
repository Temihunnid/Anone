const portfolio = {
  cash: 84250,
  holdings: [
    { name: 'NVIDIA', symbol: 'NVDA', shares: 42, price: 124.8, change: 3.4 },
    { name: 'Apple', symbol: 'AAPL', shares: 80, price: 214.3, change: 1.1 },
    { name: 'Tesla', symbol: 'TSLA', shares: 55, price: 248.6, change: -0.7 },
  ],
};

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 214.3 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 428.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 176.2 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 124.8 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.6 },
];

const portfolioValueEl = document.getElementById('portfolio-value');
const bankBalanceEl = document.getElementById('bank-balance');
const investmentSummaryEl = document.getElementById('investment-summary');
const cashBalanceEl = document.getElementById('cash-balance');
const welcomeNameEl = document.getElementById('welcome-name');
const profileNameEl = document.getElementById('profile-name');
const profileEmailEl = document.getElementById('profile-email');
const holdingsListEl = document.getElementById('holdings-list');
const themeToggle = document.getElementById('theme-toggle');
const menuButton = document.getElementById('menu-button');
const mobileNav = document.getElementById('mobile-nav');
const chartEl = document.getElementById('performance-chart');
const searchInput = document.getElementById('stock-search');
const searchButton = document.getElementById('search-button');
const searchResultsEl = document.getElementById('search-results');
const searchStatusEl = document.getElementById('search-status');
const watchlistListEl = document.querySelector('.watchlist-list');
const depositForm = document.getElementById('deposit-form');
const withdrawForm = document.getElementById('withdraw-form');
const buyForm = document.getElementById('buy-form');
const transferForm = document.getElementById('transfer-form');
const cryptoDepositForm = document.getElementById('crypto-deposit-form');
const actionStatusEl = document.getElementById('action-status');
const cryptoStatusEl = document.getElementById('crypto-status');
const cryptoHistoryEl = document.getElementById('crypto-transaction-history');
const cryptoBalanceEl = document.getElementById('crypto-balance');
const copyWalletBtn = document.getElementById('copy-wallet-btn');

function loadPortfolioState() {
  try {
    const savedPortfolio = JSON.parse(localStorage.getItem('anone-portfolio') || 'null');
    if (savedPortfolio) {
      portfolio.cash = typeof savedPortfolio.cash === 'number' ? savedPortfolio.cash : portfolio.cash;
      portfolio.holdings = Array.isArray(savedPortfolio.holdings) ? savedPortfolio.holdings : portfolio.holdings;
    }
  } catch (error) {
    console.warn('Unable to load portfolio state', error);
  }
}

function savePortfolioState() {
  localStorage.setItem('anone-portfolio', JSON.stringify({
    cash: portfolio.cash,
    holdings: portfolio.holdings,
  }));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function renderChart() {
  if (!chartEl) {
    return;
  }

  const points = [18, 34, 28, 56, 73, 92];
  const coordinates = points.map((value, index) => {
    const x = 20 + index * 56;
    const y = 140 - value;
    return `${x},${y}`;
  });

  chartEl.innerHTML = `
    <line x1="20" y1="140" x2="300" y2="140" stroke="rgba(143,164,199,0.3)" />
    <line x1="20" y1="90" x2="300" y2="90" stroke="rgba(143,164,199,0.2)" />
    <line x1="20" y1="40" x2="300" y2="40" stroke="rgba(143,164,199,0.2)" />
    <polyline points="${coordinates.join(' ')}" />
    ${coordinates.map((point, index) => `<circle cx="${point.split(',')[0]}" cy="${point.split(',')[1]}" r="4"></circle>`).join('')}
  `;
}

function getPortfolioValue() {
  const holdingsValue = portfolio.holdings.reduce((sum, item) => sum + item.shares * item.price, 0);
  return portfolio.cash + holdingsValue;
}

function render() {
  const currentUser = JSON.parse(localStorage.getItem('anone-current-user') || 'null');

  if (welcomeNameEl) {
    const name = currentUser?.fullName?.trim() || 'there';
    welcomeNameEl.textContent = `Welcome back, ${name}`;
  }

  if (profileNameEl) {
    profileNameEl.textContent = currentUser?.fullName?.trim() || 'User';
  }

  if (profileEmailEl) {
    profileEmailEl.textContent = currentUser?.email || 'No email available';
  }

  if (portfolioValueEl) {
    portfolioValueEl.textContent = formatCurrency(getPortfolioValue());
  }

  if (cashBalanceEl) {
    cashBalanceEl.textContent = formatCurrency(portfolio.cash);
  }

  if (bankBalanceEl) {
    bankBalanceEl.textContent = formatCurrency(portfolio.cash);
  }

  if (investmentSummaryEl) {
    investmentSummaryEl.textContent = formatCurrency(getPortfolioValue() - portfolio.cash);
  }

  if (holdingsListEl) {
    holdingsListEl.innerHTML = '';
    portfolio.holdings.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <div>${item.shares} shares · ${formatCurrency(item.price)}</div>
        </div>
        <div class="${item.change >= 0 ? 'positive' : 'negative'}">
          ${item.change >= 0 ? '+' : ''}${item.change}%
        </div>
      `;
      holdingsListEl.appendChild(li);
    });
  }

  renderChart();
  renderCryptoHistory();
  renderCryptoBalance();
}

function applyTheme(theme) {
  document.body.classList.toggle('light-theme', theme === 'light');
  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? '🌙 Dark' : '☀️ Light';
  }
  localStorage.setItem('anone-theme', theme);
}

function renderSearchResults(query) {
  if (!searchResultsEl) {
    return;
  }

  const term = query.trim().toLowerCase();
  if (!term) {
    searchResultsEl.innerHTML = '';
    if (searchStatusEl) {
      searchStatusEl.textContent = 'Search a ticker to add it to your watchlist.';
    }
    return;
  }

  const matches = stocks.filter((stock) => {
    return stock.symbol.toLowerCase().includes(term) || stock.name.toLowerCase().includes(term);
  }).slice(0, 5);

  if (!matches.length) {
    searchResultsEl.innerHTML = '<li>No matches found.</li>';
    return;
  }

  searchResultsEl.innerHTML = matches.map((stock) => `
    <li class="search-result-item" data-symbol="${stock.symbol}">
      <span><strong>${stock.symbol}</strong> ${stock.name}</span>
      <strong>$${stock.price.toFixed(2)}</strong>
    </li>
  `).join('');

  searchResultsEl.querySelectorAll('.search-result-item').forEach((item) => {
    item.addEventListener('click', () => {
      const symbol = item.dataset.symbol;
      if (watchlistListEl) {
        const exists = Array.from(watchlistListEl.children).some((child) => child.dataset.symbol === symbol);
        if (!exists) {
          const stock = stocks.find((entry) => entry.symbol === symbol);
          const newItem = document.createElement('li');
          newItem.dataset.symbol = stock.symbol;
          newItem.innerHTML = `<span>${stock.symbol}</span><strong>+$${stock.price.toFixed(2)}</strong>`;
          watchlistListEl.appendChild(newItem);
        }
      }
      if (searchStatusEl) {
        searchStatusEl.textContent = `${symbol} added to your watchlist.`;
      }
    });
  });
}

function setStatus(message) {
  if (actionStatusEl) {
    actionStatusEl.textContent = message;
  }
}

function setCryptoStatus(message) {
  if (cryptoStatusEl) {
    cryptoStatusEl.textContent = message;
  }
}

function getCryptoTransactions() {
  try {
    return JSON.parse(localStorage.getItem('anone-crypto-transactions') || '[]');
  } catch (error) {
    return [];
  }
}

function saveCryptoTransactions(transactions) {
  localStorage.setItem('anone-crypto-transactions', JSON.stringify(transactions));
}

function renderCryptoHistory() {
  if (!cryptoHistoryEl) {
    return;
  }

  const transactions = getCryptoTransactions();
  if (!transactions.length) {
    cryptoHistoryEl.innerHTML = '<li class="empty-history">No crypto activity yet.</li>';
    return;
  }

  cryptoHistoryEl.innerHTML = transactions.slice(0, 5).map((item) => `
    <li class="history-item">
      <div>
        <strong>${item.type}: ${item.amount} ${item.asset}</strong>
        <div>${item.wallet || item.address}</div>
      </div>
      <div class="history-meta">
        <span class="status-pill ${item.usdValue ? 'positive' : 'neutral'}">${item.usdValue ? 'Confirmed' : 'Queued'}</span>
        <span>${item.usdValue ? formatCurrency(item.usdValue) : 'Pending'}</span>
      </div>
    </li>
  `).join('');
}

function renderCryptoBalance() {
  if (!cryptoBalanceEl) {
    return;
  }

  const transactions = getCryptoTransactions();
  const btcAmount = transactions.reduce((sum, item) => {
    if (item.asset === 'BTC') {
      return sum + (item.type === 'Deposit' ? item.amount : -item.amount * 0.5);
    }
    return sum;
  }, 0.0);

  cryptoBalanceEl.textContent = `${btcAmount.toFixed(2)} BTC`;
}

if (depositForm) {
  depositForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (!amount || amount <= 0) {
      setStatus('Please enter a valid amount to deposit.');
      return;
    }
    portfolio.cash += amount;
    savePortfolioState();
    depositForm.reset();
    setStatus(`Added ${formatCurrency(amount)} to your account.`);
    render();
  });
}

if (withdrawForm) {
  withdrawForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (!amount || amount <= 0) {
      setStatus('Please enter a valid withdrawal amount.');
      return;
    }
    if (amount > portfolio.cash) {
      setStatus('You do not have enough cash to withdraw that amount.');
      return;
    }
    portfolio.cash -= amount;
    savePortfolioState();
    withdrawForm.reset();
    setStatus(`Withdrew ${formatCurrency(amount)} from your account.`);
    render();
  });
}

if (buyForm) {
  buyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const symbol = document.getElementById('buy-symbol').value.trim().toUpperCase();
    const amount = parseFloat(document.getElementById('buy-amount').value);
    if (!symbol || !amount || amount <= 0) {
      setStatus('Enter a valid ticker and amount.');
      return;
    }
    if (amount > portfolio.cash) {
      setStatus('You do not have enough cash to buy that amount of stock.');
      return;
    }

    const stock = stocks.find((entry) => entry.symbol === symbol);
    if (!stock) {
      setStatus('That ticker is not available in the demo market.');
      return;
    }

    const shares = amount / stock.price;
    portfolio.cash -= amount;
    savePortfolioState();
    const existing = portfolio.holdings.find((item) => item.symbol === symbol);
    if (existing) {
      existing.shares += shares;
    } else {
      portfolio.holdings.push({ name: stock.name, symbol: stock.symbol, shares, price: stock.price, change: 1.8 });
    }

    buyForm.reset();
    setStatus(`Bought ${shares.toFixed(2)} shares of ${symbol}.`);
    render();
  });
}

if (cryptoDepositForm) {
  cryptoDepositForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const asset = document.getElementById('crypto-asset').value;
    const amount = parseFloat(document.getElementById('crypto-amount').value);
    const wallet = document.getElementById('crypto-wallet').value.trim();
    const rates = {
      BTC: 60000,
      ETH: 3000,
      USDT: 1,
      USDC: 1,
    };

    if (!amount || amount <= 0) {
      setCryptoStatus('Please enter a valid crypto amount.');
      return;
    }

    const usdValue = amount * rates[asset];
    portfolio.cash += usdValue;
    savePortfolioState();

    const transactions = getCryptoTransactions();
    transactions.unshift({
      type: 'Deposit',
      asset,
      amount,
      wallet: wallet || 'bc1q92k4lf66q4fm7wkr9kc9y4k9yea2xd2y9htpkf',
      usdValue,
      timestamp: new Date().toISOString(),
    });
    saveCryptoTransactions(transactions);

    cryptoDepositForm.reset();
    document.getElementById('crypto-wallet').value = 'bc1q92k4lf66q4fm7wkr9kc9y4k9yea2xd2y9htpkf';
    setCryptoStatus(`Deposited ${amount} ${asset} and converted it to ${formatCurrency(usdValue)} for your account.`);
    setStatus(`Crypto deposit received: ${formatCurrency(usdValue)} added to your balance.`);
    render();
  });
}

if (copyWalletBtn) {
  copyWalletBtn.addEventListener('click', async () => {
    const walletInput = document.getElementById('crypto-wallet');
    if (!walletInput) {
      return;
    }
    try {
      await navigator.clipboard.writeText(walletInput.value);
      copyWalletBtn.textContent = 'Copied';
      setTimeout(() => {
        copyWalletBtn.textContent = 'Copy';
      }, 1200);
    } catch (error) {
      copyWalletBtn.textContent = 'Copy';
    }
  });
}

if (transferForm) {
  transferForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const asset = document.getElementById('transfer-asset').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    const address = document.getElementById('transfer-address').value.trim();

    if (!amount || amount <= 0) {
      setStatus('Please enter a valid crypto transfer amount.');
      return;
    }

    const transactions = getCryptoTransactions();
    transactions.unshift({
      type: 'Transfer',
      asset,
      amount,
      address: address || 'bc1q92k4lf66q4fm7wkr9kc9y4k9yea2xd2y9htpkf',
      usdValue: null,
      timestamp: new Date().toISOString(),
    });
    saveCryptoTransactions(transactions);

    transferForm.reset();
    document.getElementById('transfer-address').value = 'bc1q92k4lf66q4fm7wkr9kc9y4k9yea2xd2y9htpkf';
    setStatus(`Transfer request queued for ${amount} ${asset}.`);
    render();
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(nextTheme);
  });
}

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}

if (searchButton) {
  searchButton.addEventListener('click', () => renderSearchResults(searchInput?.value || ''));
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => renderSearchResults(event.target.value));
}

loadPortfolioState();
const savedTheme = localStorage.getItem('anone-theme') || 'dark';
applyTheme(savedTheme);
render();
