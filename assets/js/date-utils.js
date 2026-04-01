/**
 * Shared Date Utilities
 */

function formatHumanDate(dateStr) {
    if (!dateStr) return '';
    
    // Handle YYYY-MM-DD
    const parts = dateStr.split('-');
    let date;
    if (parts.length === 3) {
        // Create date using local time parts to avoid timezone shifts
        date = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
        date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${getOrdinal(day)} ${month} ${year}`;
}
