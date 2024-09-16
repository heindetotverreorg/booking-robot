export default (dateString: string, format: string): string => {
    let [year, month, day] = dateString.split('-')
    
    month = parseInt(month, 10).toString()
    day = parseInt(day, 10).toString()

    const formattedDate = format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)

    return formattedDate
}