// const mongoose = require('mongoose')
// const Slope = require('../models/slope')
// const Tree = require('../models/tree')

// module.exports ={
//     isSlopeExists: async (SlopeNo) =>{
//         return await Slope.findOne({SlopeID: SlopeNo}).exec()
//     },
//     findTreeBySlope: async(SlopeNo)=>{
//         tree_list = await Tree.find({SlopeID: SlopeNo}).exec()
//         id_list = []
//         for (i in tree_list){
//             id_list.push(tree_list[i]._id)
//         }
//         return id_list
//     }
// }