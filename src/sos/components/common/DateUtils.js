export const getDaysInMonth = (source) => {
    const day = source.getDate();

    const date = new Date(source.getFullYear(), source.getMonth(), 1);

    const days = [];
    while (date.getDate() <= day) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

export const getAllDaysInRange = ({ fromDate, toDate }) => {
    const date = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const days = [];
    while (date <= toDate) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

export const getFirstDayInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}