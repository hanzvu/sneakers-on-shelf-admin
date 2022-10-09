
const formatDate = date => (new Intl.DateTimeFormat(['ban', 'id'], { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date))

const formatDatetime = date => (new Intl.DateTimeFormat(['ban', 'id'], {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit',
    minute: '2-digit',
    hour12: true
}).format(date))

export { formatDate, formatDatetime }