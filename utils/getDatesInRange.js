
function getDatesInRange(startDate, endDate) {
    console.log('start', startDate)
    console.log('start', startDate.getDate())
    console.log('end', endDate)
    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
        dates.push(new Date(date).getFullYear() + '-' + String(new Date(date).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(date).getDate()).padStart(2, '0'));
        date.setDate(date.getDate() + 1);
    }

    return dates;
}

export default getDatesInRange;