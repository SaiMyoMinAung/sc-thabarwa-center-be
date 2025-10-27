const applyThisMonthQuery = (year, month) => {

    if (
        year === undefined ||
        month === undefined ||
        year === null ||
        month === null ||
        Number.isInteger(month)) {
        return null;
    }

    year = parseInt(year);

    // convert month to zero-based index
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 1);

    return { $gte: start, $lt: end };
}

export default applyThisMonthQuery