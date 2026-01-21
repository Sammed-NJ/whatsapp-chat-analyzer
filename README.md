# 📱 WhatsApp Chat Analyzer

![WhatsApp Chat Analyzer](whatsapp-chat-analyzer.png)

A modern web-based tool to analyze WhatsApp group chat activity and engagement patterns. Built with vanilla JavaScript, Chart.js, and Node.js.

## ✨ Features

- **Daily Activity Analysis**: Track active users and new joins over the last 7 days
- **Interactive Charts**: Beautiful bar charts showing daily engagement patterns
- **Consistent User Detection**: Identify users active for 4+ days in the analyzed period
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Processing**: Client-side analysis for privacy and speed
- **Error Handling**: Robust parsing with helpful error messages

## 🚀 Quick Start

### Prerequisites
- Node.js (version 12 or higher)
- A WhatsApp chat export file (.txt format)

### Installation & Setup

1. **Clone or download the project files**
2. **Navigate to the project directory**
   ```bash
   cd whatsapp-chat-analyzer
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   Or directly with Node:
   ```bash
   node server.js
   ```

4. **Open your browser**
   Go to `http://localhost:3000`

5. **Upload your WhatsApp chat file**
   - Click "Choose Chat File"
   - Select your exported .txt file
   - View the analysis results instantly!

## 📊 How to Export WhatsApp Chat

1. Open WhatsApp and go to your group chat
2. Tap on the group name at the top
3. Scroll down and tap "Export Chat"
4. Choose "Without Media" (recommended for faster processing)
5. Save the .txt file to your device
6. Upload it to the analyzer

## 🧪 Testing

Test the analyzer with the included sample data by uploading the `data.txt` file through the web interface at `http://localhost:3000`.

## 📈 What You'll Get

### Daily Activity Chart
- **Blue bars**: Number of users who sent messages each day
- **Orange bars**: Number of users who joined each day
- **X-axis**: Last 7 days from the most recent message
- **Y-axis**: User count

### Statistics Cards
- Total unique users in the chat
- New joins in the last 7 days
- Peak daily active users
- Average daily messages

### Consistent Users List
- Users who were active for 4+ days out of the last 7 days
- Sorted by activity level
- Shows exact days when each user was active

## 🏗️ Architecture

### Frontend (`index.html`)
- Modern, responsive design with CSS Grid and Flexbox
- Chart.js integration for data visualization
- File upload with drag-and-drop support
- Loading states and error handling

### Analyzer (`analyzer.js`)
- Client-side JavaScript class for chat parsing
- Robust regex patterns for various WhatsApp formats
- Date range calculation and filtering
- User activity tracking and analysis

### Server (`server.js`)
- Lightweight Node.js HTTP server
- Static file serving
- MIME type handling
- Development-friendly setup

## 🔧 Technical Details

### Supported WhatsApp Formats
- Standard format: `M/D/YY, H:MM AM/PM - Username: Message`
- System messages: Join notifications, group changes, etc.
- Various date formats (2-digit and 4-digit years)
- Different time formats and spacing variations

### Data Processing
1. **File Upload**: Client-side file reading with FileReader API
2. **Parsing**: Regex-based message extraction and categorization
3. **Date Filtering**: Automatic 7-day window calculation
4. **Analysis**: User activity tracking and statistical calculations
5. **Visualization**: Chart.js rendering with responsive design

### Performance Optimizations
- Client-side processing (no server uploads)
- Efficient Set/Map data structures
- Minimal DOM manipulation
- Lazy chart rendering

## 🛠️ Customization

### Modify Analysis Period
Change the analysis window in `analyzer.js`:
```javascript
// Change from 7 days to 14 days
startDate.setDate(startDate.getDate() - 13); // 14 days including end date
```

### Adjust Consistency Threshold
Modify the "active days" requirement:
```javascript
// Change from 4+ days to 3+ days
.filter(([user, activeDays]) => activeDays.size >= 3)
```

### Customize Chart Colors
Update the chart colors in the `createChart` method:
```javascript
backgroundColor: 'rgba(37, 211, 102, 0.8)', // WhatsApp green
borderColor: 'rgba(37, 211, 102, 1)',
```

## 🐛 Troubleshooting

### Common Issues

**"No valid WhatsApp messages found"**
- Ensure the file is a proper WhatsApp export (.txt format)
- Check that the file contains actual chat messages
- Verify the date format matches expected patterns

**Chart not displaying**
- Check browser console for JavaScript errors
- Ensure Chart.js is loading properly
- Verify canvas element exists in DOM

**Server won't start**
- Check if port 3000 is already in use
- Ensure Node.js is installed and updated
- Try running with `node server.js` directly

### File Format Issues
The analyzer supports various WhatsApp export formats, but if you encounter parsing issues:
1. Check the first few lines of your export file
2. Compare with the sample `data.txt` format
3. Adjust the regex patterns in `analyzer.js` if needed

## 📝 License

MIT License - feel free to use and modify for your projects!

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional chart types (line charts, pie charts)
- More detailed user statistics
- Export functionality for results
- Support for media analysis
- Multi-language support

---

**Built with ❤️ for better chat insights**