let Data = []

module.exports.setAllData = function (data) {
    Data = data
}

module.exports.setData = function (data) {
    data.forEach(dataItem => {
        const idx = Data.findIndex(item => item.id === dataItem.id);
        if (idx !== -1)
            Data[idx] = dataItem
    })
}

module.exports.getAllData = function () {
    return Data
}

