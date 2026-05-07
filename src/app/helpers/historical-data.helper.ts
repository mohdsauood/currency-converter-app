const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Dynamically generates the last 12 complete months (ending with the month
 * prior to the current month), returning short month labels and ISO end-of-month dates.
 *
 * Example (called in May 2026): May 2025 → Apr 2026
 */
export function getLastTwelveMonthsData(): { months: string[]; dates: string[] } {
    const now = new Date();
    const months: string[] = [];
    const dates: string[] = [];

    for (let i = 11; i >= 0; i--) {
        // Offset back from the last completed month (now.getMonth() - 1)
        const d = new Date(now.getFullYear(), now.getMonth() - 1 - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth(); // 0-based

        // Last day of this month
        const lastDay = new Date(year, month + 1, 0).getDate();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        months.push(SHORT_MONTHS[month]);
        dates.push(dateStr);
    }

    return { months, dates };
}
