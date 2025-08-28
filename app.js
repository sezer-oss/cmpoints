class GizaPointsDashboard {
    constructor() {
        this.data = [];
        this.processedData = new Map();
        this.isAdminAuthenticated = false;
        this.adminPassword = 'GizaAdmin2025!';
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
        
        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
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

        // Admin panel
        const adminToggle = document.getElementById('adminToggle');
        const adminClose = document.getElementById('adminClose');
        const adminPanel = document.getElementById('adminPanel');

        if (adminToggle) {
            adminToggle.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAdminAuthenticated) {
                    if (adminPanel) {
                        adminPanel.style.display = 'flex';
                    }
                } else {
                    this.showPasswordDialog();
                }
            });
        }

        if (adminClose) {
            adminClose.addEventListener('click', (e) => {
                e.preventDefault();
                if (adminPanel) {
                    adminPanel.style.display = 'none';
                }
            });
        }

        // Password dialog
        const passwordDialog = document.getElementById('passwordDialog');
        const passwordSubmit = document.getElementById('passwordSubmit');
        const passwordCancel = document.getElementById('passwordCancel');
        const passwordInput = document.getElementById('passwordInput');

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

        // Admin functions
        const csvUpload = document.getElementById('csvUpload');
        const fetchDataButton = document.getElementById('fetchDataButton');

        if (csvUpload) {
            csvUpload.addEventListener('change', (e) => this.handleCSVUpload(e));
        }

        if (fetchDataButton) {
            fetchDataButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleJSONFetch();
            });
        }

        // Close panels on outside click
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

    showPasswordDialog() {
        const passwordDialog = document.getElementById('passwordDialog');
        const passwordInput = document.getElementById('passwordInput');
        const passwordError = document.getElementById('passwordError');
        
        if (passwordDialog && passwordInput && passwordError) {
            passwordInput.value = '';
            passwordError.style.display = 'none';
            passwordDialog.style.display = 'flex';
            
            // Focus on password input after a short delay
            setTimeout(() => {
                passwordInput.focus();
            }, 150);
        }
    }

    hidePasswordDialog() {
        const passwordDialog = document.getElementById('passwordDialog');
        if (passwordDialog) {
            passwordDialog.style.display = 'none';
        }
    }

    handlePasswordSubmit() {
        const passwordInput = document.getElementById('passwordInput');
        const passwordError = document.getElementById('passwordError');
        const adminPanel = document.getElementById('adminPanel');
        
        if (!passwordInput) return;
        
        const password = passwordInput.value.trim();

        if (password === this.adminPassword) {
            this.isAdminAuthenticated = true;
            this.hidePasswordDialog();
            if (adminPanel) {
                adminPanel.style.display = 'flex';
            }
        } else {
            if (passwordError) {
                passwordError.style.display = 'block';
            }
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    async loadInitialData() {
        this.showLoading();
        try {
            // Use embedded data directly
            this.processData(this.getEmbeddedData());
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Failed to load initial data');
        }
        this.hideLoading();
    }

    getEmbeddedData() {
        return [
            {"Discord ID": "myth8445", "Wallet Address": "0xc2b5f67dA9F6A57469441F76c2f47982c6684c00", "TAG": "Oracle Month #1", "Giza Points": 1000},
            {"Discord ID": "myth8445", "Wallet Address": "0xc2b5f67dA9F6A57469441F76c2f47982c6684c00", "TAG": "Pharaoh Month #1", "Giza Points": 400},
            {"Discord ID": "myth8445", "Wallet Address": "0xc2b5f67dA9F6A57469441F76c2f47982c6684c00", "TAG": "Monthly Rewards (XP)", "Giza Points": 50},
            {"Discord ID": "uniloc.", "Wallet Address": "0x6b829179CE2d8Cf88a6DF95137e5599330E89E21", "TAG": "Oracle Month #1", "Giza Points": 1000},
            {"Discord ID": "uniloc.", "Wallet Address": "0x6b829179CE2d8Cf88a6DF95137e5599330E89E21", "TAG": "Pharaoh Month #1", "Giza Points": 400},
            {"Discord ID": "uniloc.", "Wallet Address": "0x6b829179CE2d8Cf88a6DF95137e5599330E89E21", "TAG": "Special Contribution", "Giza Points": 200},
            {"Discord ID": "dadou13", "Wallet Address": "0x8f834b0c0f8828be9de100354e8600b4ec1d72a8", "TAG": "Oracle Month #1", "Giza Points": 1000},
            {"Discord ID": "dadou13", "Wallet Address": "0x8f834b0c0f8828be9de100354e8600b4ec1d72a8", "TAG": "Pharaoh Month #1", "Giza Points": 400},
            {"Discord ID": "dadou13", "Wallet Address": "0x8f834b0c0f8828be9de100354e8600b4ec1d72a8", "TAG": "Content Sprint", "Giza Points": 60},
            {"Discord ID": "1417alex", "Wallet Address": "0xad157400965e7DbF837d6F0416839C6ef7033965", "TAG": "Poker", "Giza Points": 50},
            {"Discord ID": "ivan_crypton", "Wallet Address": "0xbE3E933A363c715E18c2457B6A6D3E1eb1D8F385", "TAG": "Poker", "Giza Points": 50},
            {"Discord ID": "walterwhite_81", "Wallet Address": "0x5bdAAf40Db107825f63F9980F1d8953429e9Ea98", "TAG": "Poker", "Giza Points": 100},
            {"Discord ID": "caiobarassa", "Wallet Address": "0xB49D3E5982012181D786E41D328Da427C6A1A915", "TAG": "Poker", "Giza Points": 50},
            {"Discord ID": "kurogawa_ashaf", "Wallet Address": "0xebf1fCdE2624827D9d60A9bBdBA91B557c2c6707", "TAG": "Poker", "Giza Points": 50},
            {"Discord ID": "maxong2003", "Wallet Address": "0xb991175200A225f124C7BB820751411144D03552", "TAG": "Arma Workshop", "Giza Points": 10},
            {"Discord ID": "nfcm", "Wallet Address": "0x5f1b654Bec9f996B3B0EebF8D22FD77751b99210", "TAG": "Arma Workshop", "Giza Points": 10},
            {"Discord ID": "arttechcomo", "Wallet Address": "0x20AED9A7F81DAd2B05daC70Fe9f1F83d205FeB5E", "TAG": "Arma Workshop", "Giza Points": 10},
            {"Discord ID": "3Aces", "Wallet Address": "0x4F32689ea73E087c5Ab494306AC36a24B3f220DC", "TAG": "Arma Workshop", "Giza Points": 20},
            {"Discord ID": "3Aces", "Wallet Address": "0x4F32689ea73E087c5Ab494306AC36a24B3f220DC", "TAG": "Special Contribution", "Giza Points": 100},
            {"Discord ID": "imnomade_73542", "Wallet Address": "0x05b5bbc2a62d4c08c842b7112820bdec352c4f31", "TAG": "Special Contribution", "Giza Points": 100},
            {"Discord ID": "rifkiwillam333", "Wallet Address": "0x7C817F5E30aa68DB39B6130E7cA247C5C4746084", "TAG": "Special Contribution", "Giza Points": 100},
            {"Discord ID": "matbred.", "Wallet Address": "0xd7EfA77F8353B0d61cb61FBB5B4436Da5D76B61f", "TAG": "Meme Master", "Giza Points": 20},
            {"Discord ID": "lamarinade", "Wallet Address": "0x9BAb459DAf6dde623CCDFf1ed9Bd72Bff030AE34", "TAG": "Meme Master", "Giza Points": 20},
            {"Discord ID": "willihataway22", "Wallet Address": "0x9d8fCFE97Ff0D25545C43115e8F39927Dc7936C6", "TAG": "Special Contribution", "Giza Points": 100},
            {"Discord ID": "shosan.class", "Wallet Address": "0x27980Aef888e098F67145F567f449d5b19823C07", "TAG": "Oasis Gathering", "Giza Points": 20},
            {"Discord ID": "@Flax_man", "Wallet Address": "0xe9046C3ce344f442caEf7B3c3d6e9D4b0F666E51", "TAG": "Oasis Gathering", "Giza Points": 20},
            {"Discord ID": "@Mythage", "Wallet Address": "0xc2b5f67dA9F6A57469441F76c2f47982c6684c00", "TAG": "Oasis Gathering", "Giza Points": 20},
            {"Discord ID": "cybertradr", "Wallet Address": "0x93Ee59B236fD1Af89619B3B420E4F96718EFE1fa", "TAG": "Oasis Gathering", "Giza Points": 20},
            {"Discord ID": "@arpeking", "Wallet Address": "0x8494d7675e474c2FDBDc3EdAdC39A26109284894", "TAG": "Oasis Gathering", "Giza Points": 20}
        ];
    }

    processData(rawData) {
        this.data = rawData;
        this.processedData.clear();

        // Group data by wallet address
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
        if (!searchInput) {
            console.error('Search input not found');
            return;
        }
        
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.showError('Please enter a wallet address');
            return;
        }

        const results = [];
        for (const [walletAddress, userData] of this.processedData) {
            if (walletAddress.includes(query) || userData.discordId.toLowerCase().includes(query)) {
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
                        No community points found for this address
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
                    <h3>${user.discordId}</h3>
                    <div class="total-points">${user.totalPoints} Total Points</div>
                </div>
                <div class="wallet-info">
                    <div class="wallet-address">${user.walletAddress}</div>
                </div>
                <div class="categories">
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
                <div class="user-info">
                    <div class="discord-id">${user.discordId}</div>
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
        if (!urlInput) return;
        
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
            
            this.showSuccess('Data updated successfully!');
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
                
                this.showSuccess('CSV file uploaded successfully!');
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
            throw new Error('CSV file must contain at least a header row and one data row');
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
        if (loading) loading.style.display = 'flex';
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            const p = errorElement.querySelector('p');
            if (p) p.textContent = message;
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