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

    StudentRegistrstion:(Studentdata)=>{
        return new Promise(async(resolve1,reject1)=>{
            console.log(Studentdata);
            console.log(Studentdata.password);
            const salt = await bcrypt.genSalt(10)
            const hashpass = await bcrypt.hash(Studentdata.password,salt)
            Studentdata.passwrod = hashpass

            db.get().collection(collection.STUDENT).insertOne(Studentdata).then((response) => {
                console.log('Student Added Succesfully');
                console.log(Studentdata);
                var status = true
                resolve1(status)
                
            })
        })
    },
    GetStudentDetailsForAttendance:(Batch)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(Batch.year_of_batch);
            var sorting = {roll_no:1}
            let BatchDetails =await db.get().collection(collection.STUDENT).find({year_of_joinig:Batch.year_of_batch}).sort(sorting).toArray()
            console.log(BatchDetails);
            resolve(BatchDetails)
        })
    }
    
}