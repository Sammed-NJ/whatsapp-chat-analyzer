# 📱 WhatsApp Chat Analyzer

![WhatsApp Chat Analyzer](whatsapp-chat-analyzer.png)

A modern web-based tool to analyze WhatsApp group chat activity and engagement patterns. Built with vanilla JavaScript, Chart.js, and Node.js featuring a beautiful Material Design interface with dark mode support.

## ✨ Features

### 📊 **Analytics & Insights**
- **Daily Activity Analysis**: Track active users and new joins over the last 7 days
- **Interactive Charts**: Beautiful bar charts with WhatsApp-themed colors
- **Consistent User Detection**: Identify users active for 4+ days in the analyzed period
- **Statistical Cards**: Total users, new joins, peak activity, and average messages
- **User Engagement Metrics**: Detailed breakdown of user participation patterns

### 🎨 **Modern UI/UX**
- **Material Design Interface**: Clean, professional dashboard-style layout
- **Dark Mode Support**: Toggle between light and dark themes with persistent preference
- **WhatsApp Branding**: Authentic WhatsApp colors and official logo
- **Chat-Themed Background**: Beautiful SVG patterns representing messaging
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Glass-morphism Effects**: Modern backdrop blur and transparency effects

### 🔒 **Privacy & Performance**
- **Client-side Processing**: All analysis happens in your browser - no data uploads
- **Real-time Analysis**: Instant results with loading animations
- **Error Handling**: Robust parsing with helpful error messages
- **File Format Support**: Multiple WhatsApp export formats supported

## 🚀 Quick Start

### Prerequisites
- Node.js (version 12 or higher)
- A WhatsApp chat export file (.txt format)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-chat-analyzer
   ```

2. **Start the server**
   ```bash
   npm start
   ```
   Or directly with Node:
   ```bash
   node server.js
   ```

3. **Open your browser**
   Go to `http://localhost:3000`

4. **Upload your WhatsApp chat file**
   - Click "Choose Chat File" button
   - Select your exported .txt file
   - View the analysis results instantly!

## 📊 How to Export WhatsApp Chat

1. Open WhatsApp and go to your group chat
2. Tap on the group name at the top
3. Scroll down and tap "Export Chat"
4. Choose "Without Media" (recommended for faster processing)
5. Save the .txt file to your device
6. Upload it to the analyzer

## 🎯 What You'll Get

### 📈 **Visual Analytics**
- **Daily Activity Chart**: Bar chart showing active users and new joins per day
- **Statistics Dashboard**: Key metrics in beautiful card layout
- **User Consistency Report**: List of most engaged users
- **Trend Analysis**: 7-day activity patterns and growth insights

### 📋 **Detailed Metrics**
- Total unique users in the chat
- New joins in the last 7 days  
- Peak daily active users
- Average daily messages
- User activity consistency scores

## 🏗️ Architecture

### Frontend (`index.html`)
- **Material Design UI** with CSS custom properties for theming
- **Responsive Grid Layout** (35% left panel, 65% right content)
- **Chart.js Integration** for interactive data visualization
- **File Upload** with drag-and-drop styling
- **Theme System** with light/dark mode toggle
- **Loading States** and comprehensive error handling

### Analyzer (`analyzer.js`)
- **Client-side JavaScript Class** for chat parsing and analysis
- **Robust Regex Patterns** supporting various WhatsApp formats
- **Date Range Calculation** with automatic 7-day window
- **User Activity Tracking** and statistical analysis
- **Theme Management** with localStorage persistence
- **Dynamic Results Display** with Material Design cards

### Server (`server.js`)
- **Lightweight Node.js HTTP Server** for static file serving
- **MIME Type Handling** for proper file delivery
- **Development-friendly Setup** with minimal configuration

## 🎨 Design System

### Color Palette
- **Primary**: WhatsApp Green (#25D366, #128C7E)
- **Secondary**: Blue (#34B7F1)
- **Accent**: Orange (#FF6B35)
- **Backgrounds**: Adaptive light/dark themes
- **Text**: High contrast for accessibility

### Typography
- **Font Family**: Roboto (Google Fonts)
- **Weights**: 300, 400, 500, 700
- **Hierarchy**: Clear visual hierarchy with proper spacing

### Components
- **Cards**: Elevated surfaces with subtle shadows
- **Buttons**: Glass-morphism effects with hover animations
- **Icons**: Google Material Icons throughout
- **Charts**: WhatsApp-themed color scheme

## 🔧 Technical Details

### Supported WhatsApp Formats
- Standard format: `M/D/YY, H:MM AM/PM - Username: Message`
- System messages: Join notifications, group changes, etc.
- Various date formats (2-digit and 4-digit years)
- Different time formats and spacing variations

### Data Processing Pipeline
1. **File Upload**: Client-side FileReader API
2. **Message Parsing**: Regex-based extraction and categorization
3. **Date Filtering**: Automatic 7-day window calculation
4. **Statistical Analysis**: User activity tracking and calculations
5. **Visualization**: Chart.js rendering with responsive design
6. **Results Display**: Dynamic Material Design card generation

### Performance Optimizations
- **Client-side Processing**: No server uploads required
- **Efficient Data Structures**: Set/Map for optimal performance
- **Minimal DOM Manipulation**: Batch updates and lazy rendering
- **Responsive Charts**: Automatic resizing and aspect ratio maintenance

## 🛠️ Customization

### Modify Analysis Period
```javascript
// Change from 7 days to 14 days in analyzer.js
startDate.setDate(startDate.getDate() - 13);
```

### Adjust Consistency Threshold
```javascript
// Change from 4+ days to 3+ days
.filter(([user, activeDays]) => activeDays.size >= 3)
```

### Customize Theme Colors
```css
/* Update CSS custom properties in index.html */
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### Add New Chart Types
```javascript
// Extend createChart method in analyzer.js
this.chart = new Chart(ctx, {
    type: 'line', // or 'pie', 'doughnut', etc.
    // ... configuration
});
```

## 🐛 Troubleshooting

### Common Issues

**"Choose Chat File" button not working**
- Ensure JavaScript is enabled in your browser
- Check browser console for any errors
- Try refreshing the page

**"No valid WhatsApp messages found"**
- Verify the file is a proper WhatsApp export (.txt format)
- Check that the file contains actual chat messages
- Ensure the date format matches expected patterns

**Chart not displaying**
- Check browser console for JavaScript errors
- Verify Chart.js is loading properly
- Ensure canvas element exists in DOM

**Dark mode not persisting**
- Check if localStorage is enabled in your browser
- Clear browser cache and try again

### File Format Issues
The analyzer supports various WhatsApp export formats. If you encounter parsing issues:
1. Check the first few lines of your export file
2. Compare with the sample `data.txt` format
3. Adjust regex patterns in `analyzer.js` if needed

## 🚀 Future Enhancements

- **Advanced Analytics**: Sentiment analysis, word clouds, peak hours
- **Export Functionality**: PDF reports, CSV data export
- **Multi-language Support**: Internationalization for global users
- **Media Analysis**: Support for analyzing media sharing patterns
- **Comparison Tools**: Compare multiple time periods
- **Advanced Visualizations**: Heatmaps, network graphs, timeline views

## 📝 License

MIT License - feel free to use and modify for your projects!

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional chart types and visualizations
- Enhanced user statistics and metrics
- Performance optimizations
- Accessibility improvements
- Mobile app version
- API integration capabilities

---

**Built with ❤️ for better chat insights**

*Featuring Material Design, Dark Mode, and WhatsApp-authentic styling*