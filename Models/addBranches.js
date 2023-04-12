const mongoose = require("mongoose")
const addBranchesSchema = mongoose.Schema({
    branch:{
        type:String,
    },
    created_at:{
        type: Date,
        default:Date.now()
    }
})

const branchesModal = mongoose.model("branches",addBranchesSchema)
module.exports = branchesModal