export default (dateString: string, replaceValue: string): string => {
    let [year, month, day] = dateString.split('-')
    
    month = parseInt(month, 10).toString()
    day = parseInt(day, 10).toString()

    const formattedDate = replaceValue
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)

    return formattedDate
}