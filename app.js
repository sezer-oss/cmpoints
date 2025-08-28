class GizaPointsDashboard {
    constructor() {
        this.data = [];
        this.processedData = new Map();
        this.adminPassword = "GizaAdmin2025!";
        this.isAdminAuthenticated = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadInitialData();
        this.renderLeaderboard();
    }

    setupEventListeners() {
        // Search functionality
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });

            // Clear search when input is empty
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.trim() === '') {
                    this.clearSearchResults();
                }
            });
        }

        // Admin panel authentication
        const adminToggle = document.getElementById('adminToggle');
        const passwordDialog = document.getElementById('passwordDialog');
        const passwordSubmit = document.getElementById('passwordSubmit');
        const passwordCancel = document.getElementById('passwordCancel');
        const passwordInput = document.getElementById('passwordInput');

        if (adminToggle) {
            adminToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.isAdminAuthenticated) {
                    document.getElementById('adminPanel').style.display = 'flex';
                } else {
                    passwordDialog.style.display = 'flex';
                    setTimeout(() => passwordInput.focus(), 100);
                }
            });
        }

        if (passwordSubmit) {
            passwordSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePasswordSubmit();
            });
        }

        if (passwordCancel) {
            passwordCancel.addEventListener('click', (e) => {
                e.preventDefault();
                this.hidePasswordDialog();
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handlePasswordSubmit();
                }
            });
        }

        // Admin panel
        const adminClose = document.getElementById('adminClose');
        const adminPanel = document.getElementById('adminPanel');

        if (adminClose) {
            adminClose.addEventListener('click', () => {
                adminPanel.style.display = 'none';
            });
        }

        // Admin functions
        const csvUpload = document.getElementById('csvUpload');
        const fetchDataButton = document.getElementById('fetchDataButton');

        if (csvUpload) {
            csvUpload.addEventListener('change', (e) => this.handleCSVUpload(e));
        }

        if (fetchDataButton) {
            fetchDataButton.addEventListener('click', () => this.handleJSONFetch());
        }

        // Close dialogs on outside click
        if (adminPanel) {
            adminPanel.addEventListener('click', (e) => {
                if (e.target === adminPanel) {
                    adminPanel.style.display = 'none';
                }
            });
        }

        if (passwordDialog) {
            passwordDialog.addEventListener('click', (e) => {
                if (e.target === passwordDialog) {
                    this.hidePasswordDialog();
                }
            });
        }
    }

    handlePasswordSubmit() {
        const passwordInput = document.getElementById('passwordInput');
        const passwordError = document.getElementById('passwordError');
        const password = passwordInput.value;

        if (password === this.adminPassword) {
            this.isAdminAuthenticated = true;
            this.hidePasswordDialog();
            document.getElementById('adminPanel').style.display = 'flex';
            passwordInput.value = '';
            passwordError.style.display = 'none';
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
            setTimeout(() => passwordInput.focus(), 100);
        }
    }

    hidePasswordDialog() {
        const passwordDialog = document.getElementById('passwordDialog');
        const passwordInput = document.getElementById('passwordInput');
        const passwordError = document.getElementById('passwordError');
        
        passwordDialog.style.display = 'none';
        passwordInput.value = '';
        passwordError.style.display = 'none';
    }

    async loadInitialData() {
        this.showLoading();
        try {
            // Use the embedded data directly
            this.processData(this.getEmbeddedData());
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Error loading data: ' + error.message);
        }
        this.hideLoading();
    }

    getEmbeddedData() {
        return [
            {"Discord ID": "myth8445", "Wallet Address": "0xc2b5f67dA9F6A57469441F76c2f47982c6684c00", "TAG": "Oracle Month #1", "Giza Points": 1000},
            {"Discord ID": "@myth8445", "Wallet Address": "0xc2b5f67dA9F6A57469441F76c2f47982c6684c00", "TAG": "Pharaoh Month #1", "Giza Points": 400},
            {"Discord ID": "myth8445", "Wallet Address": "0xc2b5f67dA9F6A57469441F76c2f47982c6684c00", "TAG": "Monthly Rewards (XP)", "Giza Points": 50},
            {"Discord ID": "uniloc.", "Wallet Address": "0x6b829179CE2d8Cf88a6DF95137e5599330E89E21", "TAG": "Oracle Month #1", "Giza Points": 1000},
            {"Discord ID": "uniloc.", "Wallet Address": "0x6b829179CE2d8Cf88a6DF95137e5599330E89E21", "TAG": "Pharaoh Month #1", "Giza Points": 400},
            {"Discord ID": "@uniloc.", "Wallet Address": "0x6b829179CE2d8Cf88a6DF95137e5599330E89E21", "TAG": "Special Contribution", "Giza Points": 200},
            {"Discord ID": "dadou13", "Wallet Address": "0x8f834b0c0f8828be9de100354e8600b4ec1d72a8", "TAG": "Oracle Month #1", "Giza Points": 1000},
            {"Discord ID": "dadou13", "Wallet Address": "0x8f834b0c0f8828be9de100354e8600b4ec1d72a8", "TAG": "Pharaoh Month #1", "Giza Points": 400},
            {"Discord ID": "dadou13", "Wallet Address": "0x8f834b0c0f8828be9de100354e8600b4ec1d72a8", "TAG": "Content Sprint", "Giza Points": 60},
            {"Discord ID": "1417alex", "Wallet Address": "0xad157400965e7DbF837d6F0416839C6ef7033965", "TAG": "Poker", "Giza Points": 50}
        ];
    }

    processData(rawData) {
        this.data = rawData;
        this.processedData.clear();

        // Group data by wallet address (case-insensitive)
        rawData.forEach(entry => {
            const walletAddress = entry['Wallet Address'].toLowerCase();
            const discordId = entry['Discord ID'];
            const tag = entry['TAG'];
            const points = parseInt(entry['Giza Points']) || 0;

            if (!this.processedData.has(walletAddress)) {
                this.processedData.set(walletAddress, {
                    discordId: discordId,
                    walletAddress: entry['Wallet Address'], // Keep original case
                    totalPoints: 0,
                    categories: new Map()
                });
            }

            const userData = this.processedData.get(walletAddress);
            userData.totalPoints += points;

            if (userData.categories.has(tag)) {
                userData.categories.set(tag, userData.categories.get(tag) + points);
            } else {
                userData.categories.set(tag, points);
            }
        });
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.showError('Please enter a wallet address');
            return;
        }

        const results = [];
        for (const [walletAddress, userData] of this.processedData) {
            if (walletAddress.includes(query)) {
                results.push(userData);
            }
        }

        this.displaySearchResults(results, query);
    }

    clearSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        const resultsContainer = document.getElementById('resultsContainer');

        if (!searchResults || !resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <p style="text-align: center; color: #666; font-size: 16px;">
                        No community points found for "${query}"
                    </p>
                    <div style="text-align: center; margin-top: 16px;">
                        <button class="btn btn-outline" onclick="dashboard.clearSearchAndFocus()">
                            Clear Search
                        </button>
                    </div>
                </div>
            `;
        } else {
            const clearButton = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <button class="btn btn-outline" onclick="dashboard.clearSearchAndFocus()">
                        ← Back to Dashboard
                    </button>
                </div>
            `;
            resultsContainer.innerHTML = clearButton + results.map(user => this.createResultCard(user)).join('');
        }

        searchResults.style.display = 'block';
        searchResults.scrollIntoView({ behavior: 'smooth' });
    }

    clearSearchAndFocus() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            this.clearSearchResults();
            searchInput.focus();
        }
    }

    createResultCard(user) {
        const categoriesHtml = Array.from(user.categories.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([category, points]) => `
                <div class="category">
                    <span class="category-name">${category}</span>
                    <span class="category-points">${points} points</span>
                </div>
            `).join('');

        return `
            <div class="result-card">
                <div class="result-header">
                    <h3>Wallet Details</h3>
                    <div class="total-points">${user.totalPoints} Total Points</div>
                </div>
                <div class="wallet-info">
                    <div class="wallet-address">${user.walletAddress}</div>
                </div>
                <div class="categories">
                    <h4 style="color: var(--giza-white); margin-bottom: 12px; font-size: 16px;">Point Categories:</h4>
                    ${categoriesHtml}
                </div>
            </div>
        `;
    }

    renderLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        if (!leaderboard) return;
        
        // Sort users by total points and get top 10
        const sortedUsers = Array.from(this.processedData.values())
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, 10);

        const leaderboardHtml = sortedUsers.map((user, index) => `
            <div class="leaderboard-item">
                <div class="rank">#${index + 1}</div>
                <div class="wallet-info-leaderboard">
                    <div class="masked-wallet">${this.maskWalletAddress(user.walletAddress)}</div>
                </div>
                <div class="points">${user.totalPoints} points</div>
            </div>
        `).join('');

        leaderboard.innerHTML = leaderboardHtml;
    }

    maskWalletAddress(address) {
        if (address.length <= 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    async handleJSONFetch() {
        const urlInput = document.getElementById('jsonUrlInput');
        const url = urlInput.value.trim();

        if (!url) {
            this.showError('Please enter a valid URL');
            return;
        }

        this.showLoading();
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.processData(data);
            this.renderLeaderboard();
            
            // Clear search results and reset search input
            const searchResults = document.getElementById('searchResults');
            const searchInput = document.getElementById('searchInput');
            if (searchResults) searchResults.style.display = 'none';
            if (searchInput) searchInput.value = '';
            
            // Close admin panel
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) adminPanel.style.display = 'none';
            
            this.showSuccess('Data successfully updated!');
        } catch (error) {
            console.error('Error fetching JSON:', error);
            this.showError('Error loading JSON data: ' + error.message);
        }
        this.hideLoading();
    }

    handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            this.showError('Please select a valid CSV file');
            return;
        }

        this.showLoading();
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const data = this.parseCSV(csv);
                this.processData(data);
                this.renderLeaderboard();
                
                // Clear search results and reset search input
                const searchResults = document.getElementById('searchResults');
                const searchInput = document.getElementById('searchInput');
                if (searchResults) searchResults.style.display = 'none';
                if (searchInput) searchInput.value = '';
                
                // Close admin panel
                const adminPanel = document.getElementById('adminPanel');
                if (adminPanel) adminPanel.style.display = 'none';
                
                this.showSuccess('CSV file successfully uploaded!');
            } catch (error) {
                console.error('Error parsing CSV:', error);
                this.showError('Error processing CSV file: ' + error.message);
            }
            this.hideLoading();
        };
        reader.readAsText(file);
    }

    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file must contain at least a header and one data row');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }

        return data;
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            const paragraph = errorElement.querySelector('p');
            if (paragraph) {
                paragraph.textContent = message;
            }
            errorElement.style.display = 'flex';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    showSuccess(message) {
        // Create a temporary success message
        const successElement = document.createElement('div');
        successElement.className = 'error-message';
        successElement.style.backgroundColor = '#16a34a';
        successElement.innerHTML = `
            <p>${message}</p>
            <button class="btn btn-outline" onclick="this.parentElement.remove()">Close</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(successElement, container.firstChild);
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                if (successElement.parentElement) {
                    successElement.remove();
                }
            }, 3000);
        }
    }
}

// Initialize the dashboard when the page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new GizaPointsDashboard();
});