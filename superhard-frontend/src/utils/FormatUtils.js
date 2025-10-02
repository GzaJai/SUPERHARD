export const toInt = (string) => {
    return Number(string.replace(/[^0-9.-]+/g,""));
}