export default (name: string) => {
    const regex = /\b( de | van | 't | te )\b/i
    if (regex.test(name as string)) {
        console.log('Found keyword in action value')
        name = name.toString().replace(regex, ' ')

        return name
    } 

    return name
}