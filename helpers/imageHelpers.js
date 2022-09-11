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

    addImage:(ImageDetails,callback)=>{
        db.get().collection(collections.GALLERY).insertOne(ImageDetails).then((data)=>{
            callback(data.insertedId)
        })
    },
    getGalleryImages:()=>{
        return new Promise(async(resolve1,reject1)=>{
            let Images =await db.get().collection(collection.GALLERY).find().toArray()
            console.log(Images);
            resolve1(Images)
        })
    },
    deleteGalleryImages:(ImageId)=>{
        return new Promise((resolve1,reject)=>{
            db.get().collection(collection.GALLERY).deleteOne({_id:ObjectId(ImageId)}).then(()=>{
                resolve1(response)
            })
        })
    }
    
   
}