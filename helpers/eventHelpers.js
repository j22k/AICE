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

    addEvent:(EventDetails,callback)=>{
        db.get().collection(collections.EVENTS).insertOne(EventDetails).then((data)=>{
            callback(data.insertedId)
        })
    },
    getevent:()=>{
        return new Promise(async(resolve1,reject1)=>{
            let events =await db.get().collection(collection.EVENTS).aggregate([
            {
                $project:{
                    event_name:"$event_name",
                    event_time:"$event_time",
                    event_venue:"$event_venue",
                    event_description:"$event_description",
                    // year:{$year:"$month"},
                    // month:{$month:"$month"},
                    // day:{$dayOfMonth:"$month"}
                }
            }
            ]).toArray()
            console.log(events);
            resolve1(events)
        })
    },
    deleteevents:(EventId)=>{
        return new Promise((resolve1,reject)=>{
            db.get().collection(collection.EVENTS).deleteOne({_id:ObjectId(EventId)}).then(()=>{
                resolve1(response)
            })
        })
    }
    
   
}