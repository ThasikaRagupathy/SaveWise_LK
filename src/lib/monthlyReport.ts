import type { CategorySummary, Transaction } from "@/types";
import type { MonthlyTotals } from "@/lib/calculations";

interface MonthlyReportInput {
  month: string;
  monthLabel: string;
  totals: MonthlyTotals;
  categories: CategorySummary[];
  transactions: Transaction[];
}

const HEADER_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: "FF166534" },
};

const HEADER_FONT = {
  bold: true,
  color: { argb: "FFFFFFFF" },
};

export async function downloadMonthlyReport({
  month,
  monthLabel,
  totals,
  categories,
  transactions,
}: MonthlyReportInput): Promise<void> {
  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();
  workbook.creator = "SaveWise LK";
  workbook.created = new Date();

  const summary = workbook.addWorksheet("Summary");
  summary.columns = [{ width: 30 }, { width: 24 }];
  summary.mergeCells("A1:B1");
  summary.getCell("A1").value = "SaveWise LK Monthly Financial Report";
  summary.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  summary.getCell("A1").fill = HEADER_FILL;
  summary.getCell("A2").value = "Report month";
  summary.getCell("B2").value = monthLabel;
  summary.getCell("A3").value = "Generated on";
  summary.getCell("B3").value = new Date().toLocaleDateString();
  summary.addRow([]);
  summary.addRow(["Metric", "Value"]);
  summary.getRow(5).font = HEADER_FONT;
  summary.getRow(5).fill = HEADER_FILL;
  summary.addRows([
    ["Total income (LKR)", totals.totalIncome],
    ["Total expenses (LKR)", totals.totalExpenses],
    ["Net savings (LKR)", totals.net],
    ["Savings rate", totals.savingsRate / 100],
    ["Transaction count", transactions.length],
  ]);
  for (const cell of ["B6", "B7", "B8"]) {
    summary.getCell(cell).numFmt = '#,##0.00;[Red](#,##0.00)';
  }
  summary.getCell("B9").numFmt = "0%";

  const categorySheet = workbook.addWorksheet("Categories");
  categorySheet.columns = [
    { header: "Category", key: "category", width: 30 },
    { header: "Expenses (LKR)", key: "amount", width: 20, style: { numFmt: "#,##0.00" } },
    { header: "Share of expenses", key: "share", width: 22, style: { numFmt: "0%" } },
  ];
  categories.forEach((category) => {
    categorySheet.addRow({
      category: category.category,
      amount: category.amount,
      share: category.percentage / 100,
    });
  });
  categorySheet.getRow(1).font = HEADER_FONT;
  categorySheet.getRow(1).fill = HEADER_FILL;
  categorySheet.views = [{ state: "frozen", ySplit: 1 }];

  const transactionSheet = workbook.addWorksheet("Transactions");
  transactionSheet.columns = [
    { header: "Date", key: "date", width: 16 },
    { header: "Type", key: "type", width: 14 },
    { header: "Description", key: "title", width: 32 },
    { header: "Category", key: "category", width: 24 },
    { header: "Amount (LKR)", key: "amount", width: 20, style: { numFmt: "#,##0.00" } },
    { header: "Notes", key: "note", width: 40 },
  ];
  [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))
    .forEach((transaction) => {
      transactionSheet.addRow({
        date: transaction.date,
        type: transaction.type === "income" ? "Income" : "Expense",
        title: transaction.title,
        category: transaction.category,
        amount: transaction.amount,
        note: transaction.note || "",
      });
    });
  transactionSheet.getRow(1).font = HEADER_FONT;
  transactionSheet.getRow(1).fill = HEADER_FILL;
  transactionSheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `savewise-lk-monthly-report-${month}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
