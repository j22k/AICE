var express = require('express');
var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
const { reject } = require('bcrypt/promises')
const bcrypt = require('bcrypt');
const { compare } = require('bcrypt');
const { status } = require('express/lib/response');
const async = require('hbs/lib/async');
const collections = require('../config/collections');
const genSalt  = require('bcrypt');
const { ObjectId } = require('mongodb');
const { response } = require('express');
module.exports = {

    addQpapper:(QPapperDetails,callback)=>{
        db.get().collection(collections.Q_PAPPER_DETAILS).insertOne(QPapperDetails).then((data)=>{
            callback(data.insertedId)
        })
    },
    getquestionpapper:()=>{
        return new Promise(async(resolve1,reject1)=>{
            let qpapperdetails =await db.get().collection(collection.Q_PAPPER_DETAILS).find().toArray()
            console.log(qpapperdetails);
            resolve1(qpapperdetails)
        })
    },
    deleteQuestionPapper:(QPaperId)=>{
        return new Promise((resolve1,reject)=>{
            db.get().collection(collection.Q_PAPPER_DETAILS).deleteOne({_id:ObjectId(QPaperId)}).then(()=>{
                resolve1(response)
            })
        })
    }
}