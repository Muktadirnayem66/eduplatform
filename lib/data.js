

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


export async function formatDuration (duration) {   
    if(!duration) return null

    let hour = Math.floor(duration/3600)
    let min = Math.floor(duration % 3600 /60)
    let sec = Math.floor(duration % 3600 % 60)
    const durationString = `${hour}:${min}:${sec}`;

    return durationString
    
}