export default async (time: number) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}