var mongoose = require('mongoose');var userSchema = new mongoose.Schema({        did:{            type: mongoose.Schema.Types.ObjectId,            ref:'Doctor'        },        pid:{            type:String        },        prescription:[{            findings:{},            notes:{                type:String            },            medicine:{},            createdAt:{                type:Date            },            updatedAt:{                type:Date            }        }]    },    {        timestamps: true    });module.exports = mongoose.model('Prescription', userSchema);