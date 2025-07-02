import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Platform } from 'react-native';
import { format } from 'date-fns';
import { Expense, Category } from '@/types/expense';

class ExportService {
  async exportToPDF(
    expenses: Expense[], 
    categories: Category[], 
    currency: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<string | null> {
    try {
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const categoryTotals = this.getCategoryTotals(expenses, categories);
      
      const html = this.generatePDFHTML(expenses, categories, currency, totalAmount, categoryTotals, dateRange);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (Platform.OS === 'web') {
        // For web, we'll download the file
        const link = document.createElement('a');
        link.href = uri;
        link.download = `expense-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        link.click();
        return uri;
      } else {
        // For mobile, share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
        return uri;
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      return null;
    }
  }

  async exportToCSV(
    expenses: Expense[], 
    categories: Category[], 
    currency: string
  ): Promise<string | null> {
    try {
      const csvContent = this.generateCSVContent(expenses, categories, currency);
      const fileName = `expense-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        return url;
      } else {
        // For mobile, save to file system and share
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, csvContent);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
        return fileUri;
      }
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return null;
    }
  }

  private generatePDFHTML(
    expenses: Expense[], 
    categories: Category[], 
    currency: string,
    totalAmount: number,
    categoryTotals: { [key: string]: number },
    dateRange?: { start: Date; end: Date }
  ): string {
    const dateRangeText = dateRange 
      ? `${format(dateRange.start, 'MMM dd, yyyy')} - ${format(dateRange.end, 'MMM dd, yyyy')}`
      : 'All Time';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Expense Report</title>
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #6366F1;
              padding-bottom: 20px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #6366F1;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
            }
            .summary {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .summary-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .summary-total {
              font-weight: bold;
              font-size: 20px;
              color: #6366F1;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              margin: 30px 0 15px 0;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #6366F1;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .amount {
              font-weight: bold;
              color: #6366F1;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Expense Report</div>
            <div class="subtitle">${dateRangeText}</div>
            <div class="subtitle">Generated on ${format(new Date(), 'MMM dd, yyyy')}</div>
          </div>

          <div class="summary">
            <div class="summary-item">
              <span>Total Expenses:</span>
              <span class="amount">${currency}${totalAmount.toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span>Number of Transactions:</span>
              <span>${expenses.length}</span>
            </div>
            <div class="summary-item summary-total">
              <span>Average per Transaction:</span>
              <span>${currency}${(totalAmount / expenses.length || 0).toFixed(2)}</span>
            </div>
          </div>

          <div class="section-title">Category Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(categoryTotals).map(([categoryId, amount]) => {
                const category = categories.find(c => c.id === categoryId);
                const percentage = ((amount / totalAmount) * 100).toFixed(1);
                return `
                  <tr>
                    <td>${category?.name || 'Unknown'}</td>
                    <td class="amount">${currency}${amount.toFixed(2)}</td>
                    <td>${percentage}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="section-title">Transaction Details</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(expense => {
                const category = categories.find(c => c.id === expense.category);
                return `
                  <tr>
                    <td>${format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                    <td>${category?.name || 'Unknown'}</td>
                    <td>${expense.note || '-'}</td>
                    <td class="amount">${currency}${expense.amount.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Generated by Expense Tracker App</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateCSVContent(expenses: Expense[], categories: Category[], currency: string): string {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Tags'];
    const rows = expenses.map(expense => {
      const category = categories.find(c => c.id === expense.category);
      return [
        format(new Date(expense.date), 'yyyy-MM-dd'),
        category?.name || 'Unknown',
        expense.note || '',
        expense.amount.toString(),
        expense.tags.join('; ')
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  private getCategoryTotals(expenses: Expense[], categories: Category[]): { [key: string]: number } {
    const totals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (totals[expense.category]) {
        totals[expense.category] += expense.amount;
      } else {
        totals[expense.category] = expense.amount;
      }
    });

    return totals;
  }
}

export const exportService = new ExportService();