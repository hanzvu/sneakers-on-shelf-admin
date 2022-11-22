export default function getDaysInMonth(source) {
    const day = source.getDate();

    const date = new Date(source.getFullYear(), source.getMonth(), 1);

    const days = [];
    while (date.getDate() <= day) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}
