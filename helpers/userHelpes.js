var express = require('express');
var db = require('../config/connection')
var collection = require('../config/collections')
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

dosignup: (userData) => {

    return new Promise(async (resolve, reject) => {
        console.log(userData);
        console.log(userData.password);
        const salt = await bcrypt.genSalt(10)
        const hashpass = await bcrypt.hash(userData.password,salt)
        userData.password = hashpass

              
            console.log(userData.password);
                db.get().collection(collection.ADMIN).insertOne(userData).then((response) => {
                    console.log('Your Accout has been created succefully');
                    console.log(userData);
                    var status = true
                    resolve(status)
                    
                })
  
        
      
        })




},
dosignin: (userData,callback) => {
    return new Promise(async (resolve, reject) => {
        let response = {}
        console.log(userData);
        // let user1 =await db.get().collection(collections.STAF).findOne({ email: userData.email })
        let user = await db.get().collection(collections.ADMIN).findOne({ username: userData.username })
            console.log(user);
            if (user) {
                console.log(user.passwrod);
                console.log(userData.password);
                bcrypt.compare(userData.password,user.password,(err,res)=>{
                    console.log(user.passwrod);
                    console.log(user.username);
                    console.log(err);
                    if (res) {
                        response.status = true
                        console.log("log in successfull")
                        console.log(response);
                        response.user = user
                        resolve(response)
                    }
                    else{
                        console.log("Log in faild")
                        response.status = false
                        resolve(response)

                    }  
                })
            }
        else {

            console.log("Log in faild")
            response.status = false
            resolve(response)
        }
      })
},
addstaff:(StaffDetails,callback)=>{
    db.get().collection(collections.STAF).insertOne(StaffDetails).then((data)=>{
        callback(data.insertedId)
    })
},

// addstaff:(userData) => {

//     return new Promise(async (resolve, reject) => {
//         console.log(userData);
//         console.log(userData.password);
//         const salt = await bcrypt.genSalt(10)
//         const hashpass = await bcrypt.hash(userData.password,salt)
//         userData.passwrod = hashpass

//         if(userData.inlineRadioOptions == 'option1'){
//             userData.inlineRadioOptions = 'female'
//         }
//         else if(userData.inlineRadioOptions == 'option2'){
//             userData.inlineRadioOptions = 'male'
//         }
//         else{
//             userData.inlineRadioOptions = 'other'
//         }

              
//             console.log(userData.password);
//                 db.get().collection(collection.STAF).insertOne(userData).then((data) => {
//                     console.log('Your Accout has been created succefully');
//                     console.log(userData);
//                     var status = true
//                     resolve(data.insertedId)
                    
//                 })
  
        
      
//         })




// },
getstaffdetails:()=>{
    return new Promise(async(resolve1,reject1)=>{
        let staffdetails =await db.get().collection(collection.STAF).find().toArray()
        console.log(staffdetails);
        resolve1(staffdetails)
    })
},

deletestaff:(SId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.STAF).deleteOne({_id:ObjectId(SId)}).then(()=>{
            resolve(response)
        })
    })
},
dosigninasstaff: (userData,callback) => {
    return new Promise(async (relvsoe, reject) => {
        let response = {}
        console.log(userData);
        let user = await db.get().collection(collections.STAF).findOne({ username: userData.username })
            console.log(user);
            if (user) {
                console.log(user.passwrod);
                console.log(userData.password);
                bcrypt.compare(userData.password,user.passwrod,(err,res)=>{
                    console.log(user.passwrod);
                    console.log(user.username);
                    if (!err) {
                        console.log("log in successfull")
                        response.user = user
                        response.status = true
                        response.ack = false
                        relvsoe(response)
                    }
                    else{
                        console.log("Log in faild")
                        response.status = false
                        resolve({response:status})

                    }
                    
                })
                  
                    
                
               

            }
            else {

                console.log("Log in faild")
                resolve({ status: false })
            }
      
        
       
    })
},

}
