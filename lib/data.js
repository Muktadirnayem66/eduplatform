

const FormatMyDate = (date) => {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    const formattedDate = new Intl.DateTimeFormat("en-us", options).format(date)
    return formattedDate
};

export default FormatMyDate;