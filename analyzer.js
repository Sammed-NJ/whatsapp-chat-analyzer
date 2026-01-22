class WhatsAppAnalyzer {
    constructor() {
        this.initializeEventListeners();
        this.initializeTheme();
        this.chart = null;
    }

    initializeTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle .material-icons');
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }

    initializeEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadButton = document.querySelector('.upload-button');
        
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        uploadButton.addEventListener('click', () => fileInput.click());
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.showLoading(true);
        this.hideError();

        try {
            const text = await this.readFile(file);
            const analysis = this.analyzeChat(text);
            this.displayResults(analysis);
        } catch (error) {
            this.showError(`Error analyzing file: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    analyzeChat(text) {
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        
        // Enhanced regex to handle various WhatsApp formats
        const messageRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(.+)$/;
        const joinRegex = /joined using this group's invite link|added/i;
        const systemMessageRegex = /Messages and calls are end-to-end encrypted|created group|changed|left|removed/i;

        const dailyStats = new Map();
        const userActivity = new Map();
        const allUsers = new Set();
        let totalMessages = 0;
        let totalJoins = 0;

        // Determine date range - last 7 days from the most recent message
        let latestDate = null;
        const validDates = [];

        // First pass: find all valid dates
        lines.forEach(line => {
            const match = line.match(messageRegex);
            if (match) {
                const dateStr = match[1];
                const date = this.parseDate(dateStr);
                if (date) {
                    validDates.push(date);
                }
            }
        });

        if (validDates.length === 0) {
            throw new Error('No valid WhatsApp messages found in the file');
        }

        // Find the latest date and calculate 7-day window
        latestDate = new Date(Math.max(...validDates));
        const startDate = new Date(latestDate);
        startDate.setDate(startDate.getDate() - 6); // 7 days including end date

        // Second pass: analyze messages within the date range
        lines.forEach(line => {
            const match = line.match(messageRegex);
            if (!match) return;

            const [, dateStr, timeStr, content] = match;
            const messageDate = this.parseDate(dateStr);
            
            if (!messageDate || messageDate < startDate || messageDate > latestDate) {
                return;
            }

            const dateKey = this.formatDate(messageDate);
            
            // Initialize daily stats
            if (!dailyStats.has(dateKey)) {
                dailyStats.set(dateKey, {
                    date: messageDate,
                    activeUsers: new Set(),
                    newUsers: 0,
                    messages: 0
                });
            }

            const dayStats = dailyStats.get(dateKey);

            // Check if it's a join message
            if (joinRegex.test(content)) {
                dayStats.newUsers++;
                totalJoins++;
                return;
            }

            // Check if it's a system message
            if (systemMessageRegex.test(content)) {
                return;
            }

            // Parse user message
            const colonIndex = content.indexOf(':');
            if (colonIndex > 0) {
                const username = content.substring(0, colonIndex).trim();
                const message = content.substring(colonIndex + 1).trim();
                
                if (username && message) {
                    dayStats.activeUsers.add(username);
                    dayStats.messages++;
                    totalMessages++;
                    allUsers.add(username);

                    // Track user activity for consistency analysis
                    if (!userActivity.has(username)) {
                        userActivity.set(username, new Set());
                    }
                    userActivity.get(username).add(dateKey);
                }
            }
        });

        // Generate complete 7-day range
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(latestDate);
            date.setDate(date.getDate() - i);
            const dateKey = this.formatDate(date);
            
            const stats = dailyStats.get(dateKey) || {
                date,
                activeUsers: new Set(),
                newUsers: 0,
                messages: 0
            };

            last7Days.push({
                date: dateKey,
                dateObj: date,
                activeUsers: stats.activeUsers.size,
                newUsers: stats.newUsers,
                messages: stats.messages
            });
        }

        // Find consistent users (active 4+ days)
        const consistentUsers = Array.from(userActivity.entries())
            .filter(([user, activeDays]) => activeDays.size >= 4)
            .map(([user, activeDays]) => ({
                name: user,
                activeDays: activeDays.size,
                daysActive: Array.from(activeDays).sort()
            }))
            .sort((a, b) => b.activeDays - a.activeDays);

        return {
            last7Days,
            consistentUsers,
            totalUsers: allUsers.size,
            totalMessages,
            totalJoins,
            dateRange: {
                start: this.formatDate(startDate),
                end: this.formatDate(latestDate)
            }
        };
    }

    parseDate(dateStr) {
        try {
            const [month, day, year] = dateStr.split('/');
            const fullYear = year.length === 2 ? `20${year}` : year;
            return new Date(fullYear, month - 1, day);
        } catch (error) {
            return null;
        }
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    displayResults(analysis) {
        // Hide instructions and show results
        document.querySelector('.instructions-grid').style.display = 'none';
        const resultsSection = document.getElementById('results');
        resultsSection.style.display = 'block';
        
        // Create results HTML
        resultsSection.innerHTML = `
            <div class="results-container">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon"><span class="material-icons">people</span></div>
                        <div class="stat-number">${analysis.totalUsers}</div>
                        <div class="stat-label">Total Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><span class="material-icons">person_add</span></div>
                        <div class="stat-number">${analysis.last7Days.reduce((sum, d) => sum + d.newUsers, 0)}</div>
                        <div class="stat-label">New Joins (7 days)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><span class="material-icons">trending_up</span></div>
                        <div class="stat-number">${Math.max(...analysis.last7Days.map(d => d.activeUsers))}</div>
                        <div class="stat-label">Peak Daily Active</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><span class="material-icons">message</span></div>
                        <div class="stat-number">${Math.round(analysis.totalMessages / 7)}</div>
                        <div class="stat-label">Avg Daily Messages</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">
                        <span class="material-icons">bar_chart</span>
                        Daily Activity - Last 7 Days
                    </h3>
                    <div class="chart-wrapper">
                        <canvas id="activityChart"></canvas>
                    </div>
                </div>

                <div class="users-container">
                    <h3 class="users-title">
                        <span class="material-icons">emoji_events</span>
                        Most Consistent Users (Active 4+ days)
                    </h3>
                    <div class="users-list" id="consistentUsers"></div>
                </div>
            </div>
        `;
        
        // Add results styles
        const style = document.createElement('style');
        style.textContent = `
            .results-container {
                display: grid;
                gap: 24px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
            }
            
            .stat-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-left: 4px solid #25D366;
            }
            
            .stat-icon {
                color: #25D366;
                margin-bottom: 8px;
            }
            
            .stat-number {
                font-size: 1.8rem;
                font-weight: 700;
                color: #25D366;
                margin-bottom: 4px;
            }
            
            .stat-label {
                color: #666;
                font-size: 0.9rem;
            }
            
            .chart-container {
                background: white;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-left: 4px solid #25D366;
            }
            
            .chart-title {
                font-size: 1.2rem;
                color: #25D366;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .chart-wrapper {
                position: relative;
                height: 300px;
            }
            
            .users-container {
                background: white;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-left: 4px solid #25D366;
            }
            
            .users-title {
                font-size: 1.2rem;
                color: #25D366;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .users-list {
                max-height: 200px;
                overflow-y: auto;
            }
            
            .user-item {
                background: #f5f5f5;
                padding: 12px;
                margin: 8px 0;
                border-radius: 6px;
                border-left: 3px solid #25D366;
            }
            
            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
        
        this.displayConsistentUsers(analysis.consistentUsers);
        
        // Create chart after DOM is ready
        setTimeout(() => {
            this.createChart(analysis.last7Days);
        }, 100);
    }



    createChart(data) {
        const ctx = document.getElementById('activityChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.date),
                datasets: [
                    {
                        label: 'Active Users',
                        data: data.map(d => d.activeUsers),
                        backgroundColor: '#25D366',
                        borderColor: '#128C7E',
                        borderWidth: 1
                    },
                    {
                        label: 'New Joins',
                        data: data.map(d => d.newUsers),
                        backgroundColor: '#ff9800',
                        borderColor: '#f57c00',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });
    }

    displayConsistentUsers(users) {
        const container = document.getElementById('consistentUsers');
        
        if (users.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No users were active for 4+ days in the analyzed period.</p>';
            return;
        }

        container.innerHTML = users.map((user, index) => `
            <div class="user-item">
                <strong>${user.name}</strong>
                <div style="margin-top: 8px; color: #666;">
                    Active ${user.activeDays} out of 7 days
                    <div style="font-size: 0.9em; margin-top: 4px;">
                        Days: ${user.daysActive.join(', ')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }
}

// Initialize the analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppAnalyzer();
});