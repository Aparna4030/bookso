const convertToDate = (string)=>{

    const convert = string.split("/")
    const year = parseInt(convert[2])
    const month = parseInt(convert[1])
    const day = parseInt(convert[0])

    const date = new Date(year,month,day)
    return date
}

module.exports = convertToDate;