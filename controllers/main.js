const errorHandler = require('../utils/errorHandler')
const {getAllData} = require('../data/data')

module.exports.getAll = async function (req, res) {
    try {
        const data = getAllData()
        if (data.length === 20) {
            res.status(200).json({data})
        } else {
            return res.status(404).json({
                message: 'no data'
            })
        }
    } catch (e) {
        errorHandler(res, e)
    }
}

