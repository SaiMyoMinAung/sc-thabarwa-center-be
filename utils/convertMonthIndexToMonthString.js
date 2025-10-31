
const EN_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const convertMonthIndexToMonthString = (monthIdx) => {
    return EN_MONTHS[monthIdx];
}