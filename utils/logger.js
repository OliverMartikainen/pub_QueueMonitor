const dateNow = () => {
    let date = new Date()
    const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString()
    const [isoDate, isoTime] = isoString.slice(0,23).replace('-', '.').replace('-', '.').split('T')
    return `${isoDate} ${isoTime}`
}

let defaultLog = console.log
const consoleLogOverride = function () {
    const localDateIsoString = `[${dateNow()}]`
    const newArgs = [localDateIsoString, ...arguments]

    defaultLog.apply(console, newArgs)
}

let defaultError = console.error
const consoleErrorOverride = function () {
    const localDateIsoString = `[${dateNow()}]`
    const newArgs = [localDateIsoString, ...arguments]

    defaultError.apply(console, newArgs)
}

module.exports = {
    consoleLogOverride,
    consoleErrorOverride
}