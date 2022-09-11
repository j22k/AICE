var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/userHelpes')
var questionpapperhelpers = require('../helpers/questionpapperhelpers')
var session = require('express-session');
var fs = require('fs');
const { response } = require('express');
const { status } = require('express/lib/response');
var mv = require('express-fileupload')
var bodyParser = require('body-parser');
const res = require('express/lib/response');
const StudentHelpers = require('../helpers/StudentHelpers');
const eventHelpers = require('../helpers/eventHelpers');
const imageHelpers = require('../helpers/imageHelpers');
// const { read } = require('files');

/* GET home page. */
router.get('/', function (req, res, next) {
 eventHelpers.getevent().then((events)=>{
  res.render('index',{events});
 })
});


router.get('/about', function (req, res, next) {
  userHelpers.getstaffdetails().then((staffdetails)=>{
    res.render('about',{staffdetails});
  })
});

router.get('/services', function (req, res, next) {
  res.render('services');
});

router.get('/gallery', function (req, res, next) {
  eventHelpers.getevent().then((events)=>{
    imageHelpers.getGalleryImages().then((Images)=>{
      res.render('gallery',{events,Images});
    })
  })
});

router.get('/admin', function (req, res, next) {
  if(req.session.loggedIn){
    res.render('adminHome', { layout: 'adminLayout.hbs' })
  }
  else{
    res.render('sign_in_as_admin.hbs', { layout: 'sign-In-Layout.hbs',"LogErr":req.session.LogErr });
    req.session.LogErr = false
  }
});
router.get('/sign-in', function (req, res, next) {
  res.render('sign_in_as_student.hbs', { layout: 'sign-In-Layout.hbs' });
});
router.get('/staff_login', function (req, res, next) {
  res.render('sign_in_as_staff.hbs', { layout: 'sign-In-Layout.hbs' });
});

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.post('/sign_in', (req, res) => {
  console.log(req.body);
  userHelpers.dosignin(req.body).then((response) => {
    console.log(response);
    if (response.status == true) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.render('adminHome', { layout: 'adminLayout.hbs' })
    }
    else {
      req.session.LogErr = true
      res.redirect('/admin')
    }
  })
  // userHelpers.dosignup(req.body).then((status)=>{
  //     console.log(req.body);
  //     if(status==true){
  //       res.redirect('/')
  //     }
  //     else{
  //       res.redirect('')
  //     }
  // })
});
router.get('/AddStaff', function (req, res, next) {
  res.render('addnewstaf', { layout: 'adminLayout.hbs' });
});

router.post('/add_staf', (req, res) => {
  console.log(req.body);
  userHelpers.addstaff(req.body,(id) => {
    req.files.staffphoto.mv('./public/Staff Photos/' + id + '.jpg', (err, done) => {
      if (!err) {

        res.redirect('/AddStaff')
      } else {
        console.log(err);
      }
    })
  })

});

router.get('/staffdetails', function (req, res, next) {
  userHelpers.getstaffdetails().then((staffdetails)=>{
    res.render('admin_edit_staff_details.hbs', { layout: 'adminLayout.hbs',staffdetails });

  })
});

router.get('/dstaff/:id', (req, res) => {
  let sid = req.params.id
  userHelpers.deletestaff(sid).then((response) => {
    var filpath = './public/Staff Photos/'+sid+'.jpg';
    fs.unlinkSync(filpath)
    res.redirect('/staffdetails')
  })
})

router.get('/add-question-papper', function (req, res, next) {
  res.render('addQuestionpapper', { layout: 'adminLayout.hbs' });
});
router.get('/add-question-papper_staff', function (req, res, next) {
  let userstaff = req.session.user
  res.render('addQuestionpapper', { layout: 'stafflayout.hbs', userstaff });
});

router.post('/add_q', (req, res) => {
  console.log(req.body);
  console.log(req.body.Qpapper)

  questionpapperhelpers.addQpapper(req.body, (id) => {

    console.log(id);

    // if (req.files.Qpapper.length == 0) {
    //   return res.status(400).send('No files were uploaded.');
    //  }
    req.files.Qpapper.mv('./public/QuestionPappers/' + id + '.pdf', (err, done) => {
      if (!err) {

        res.redirect('/add-question-papper')
      } else {
        console.log(err);
      }
    })
  })


});

// router.post('/add_q_staff', (req, res) => {
//   console.log(req.body);
//   console.log(req.body.Qpapper)

//   questionpapperhelpers.addQpapper(req.body, (id) => {

//     console.log(id);

//     // if (req.files.Qpapper.length == 0) {
//     //   return res.status(400).send('No files were uploaded.');
//     //  }
//     req.files.Qpapper.mv('./public/QuestionPappers/' + id + '.pdf', (err, done) => {
//       if (!err) {

//         res.redirect('/add-question-papper_staff')
//       } else {
//         console.log(err);
//       }
//     })
//   })


// });

router.get('/qpapper', function (req, res, next) {
  questionpapperhelpers.getquestionpapper().then((qpapperdetails) => {
    res.render('downloadqpapper.hbs', { layout: 'downlaodqpapperlayout.hbs', qpapperdetails });
  })
});

router.get('/dqpapper', function (req, res, next) {
  questionpapperhelpers.getquestionpapper().then((qpapperdetails) => {
    res.render('deleteqpapper.hbs', { layout: 'adminLayout.hbs', qpapperdetails });
  })
});

router.get('/dqpapper_staff', function (req, res, next) {
  questionpapperhelpers.getquestionpapper().then((qpapperdetails) => {
    let userstaff = req.session.user
    res.render('deleteqpapper.hbs', { layout: 'stafflayout.hbs', qpapperdetails, userstaff });
  })
});

router.get('/addevent', function (req, res, next) {
    res.render('add_events.hbs', { layout: 'adminLayout.hbs' });
  
});

router.post('/add-events', (req, res) => {
  console.log(req.body);
  eventHelpers.addEvent(req.body, (id)=>{
    req.files.event_photo1.mv('./public/event images/' + id + 'photo1.jpg', (err, done) => {
      if (!err) {
        req.files.event_photo2.mv('./public/event images/' + id + 'photo2.jpg', (err, done) => {
          if (!err) {
              res.redirect('/addevent')
          } else {
            console.log(err);
          }
        })
      } else {
        console.log(err);
      }
    })
  })


});

router.get('/devents', function (req, res, next) {
  eventHelpers.getevent().then((events)=>{
    res.render('Delete events', { layout: 'adminLayout.hbs',events });

  })
});

router.get('/devents/:id', (req, res) => {
  let eid = req.params.id
  eventHelpers.deleteevents(eid).then((response) => {
    var filpath1 = './public/event images/'+eid+'photo1.jpg';
    var filpath2 = './public/event images/'+eid+'photo2.jpg';
    fs.unlinkSync(filpath1)
    fs.unlinkSync(filpath2)
    res.redirect('/devents')
  })
})

router.get('/addimages', function (req, res, next) {
  res.render('add Gallery Images.hbs', { layout: 'adminLayout.hbs' });

});

router.post('/add-Image', (req, res) => {
console.log(req.body);
imageHelpers.addImage(req.body, (id)=>{
  req.files.Image.mv('./public/Gallery Images/' + id + '.jpg', (err, done) => {
    if (!err) {
      res.redirect('/addimages')
    } else {
      console.log(err);
    }
  })
})
});

router.get('/dimages', function (req, res, next) {
imageHelpers.getGalleryImages().then((Images)=>{
  res.render('Delete Gallery Images.hbs', { layout: 'adminLayout.hbs',Images });

})
});

router.get('/dImage/:id', (req, res) => {
  let Iid = req.params.id
  imageHelpers.deleteGalleryImages(Iid).then((response) => {
    var filpath = './public/event images/'+Iid+'.jpg';
    fs.unlinkSync(filpath)
    res.redirect('/dimages')
  })
})


const folderPath = 'E:/main project/AICE Web application/public/QuestionPappers/';
router.get('/download/:id', (req, res) => {
  let qid = req.params.id
  res.download(folderPath + '/' + qid + '.pdf', function (err) {
    if (err) {
      console.log(err);
    }
  })
});

router.get('/dpapper/:id', (req, res) => {
  let qid = req.params.id
  questionpapperhelpers.deleteQuestionPapper(qid).then((response) => {
    var filpath = './public/QuestionPappers/'+qid+'.jpg';
    fs.unlinkSync(filpath)
    res.redirect('/dqpapper')
  })
})

// router.get('/edit-teacher', function (req, res, next) {
//   userHelpers.getstaffdetails().then((staffdetails) => {
//     res.render('admin_edit_staff_details.hbs', { layout: 'adminLayout.hbs', staffdetails });
//   })

// });

// router.post('/sign_in_staff', (req, res) => {
//   console.log(req.body);
//   userHelpers.dosigninasstaff(req.body).then((response) => {
//     if (response.status == true) {
//       req.session.loggedIn = true
//       req.session.user = response.user
//       let userstaff = req.session.user
//       res.render('addQuestionpapper', { layout: 'stafflayout.hbs', userstaff })
//     }
//     else {
//       res.redirect('/sign_in')
//     }
//   })
// });

// router.get('/StdRegistration', (req, res) => {
//   res.render('studentRegistration.hbs', { layout: 'stafflayout.hbs' })
// });

// router.post('/stdregistration', (req, res) => {
//   console.log(req.body);
//   StudentHelpers.StudentRegistrstion(req.body).then((status) => {
//     if (status) {
//       res.redirect('/StdRegistration')
//     }
//     else {
//       alert("Somthing Went Wrong")
//     }
//   })
// });

// router.get('/MarkAtttendance', (req, res) => {
//   res.render('SelectBatchforattendance.hbs', { layout: 'stafflayout.hbs' })
// })
// router.post('/get_batch_for_attendance', (req, res) => {
//   console.log(req.body);
//   console.log(req.body.year_of_batch);
//   var year_joined = req.body.year_of_batch
//   StudentHelpers.GetStudentDetailsForAttendance(req.body).then((BatchDetails) => {
//     res.render('SubmitAttendance.hbs', { layout: 'stafflayout.hbs', BatchDetails, year_joined })
//   })
// })
// router.post('/Attendances', (req, res) => {

//   console.log(req.body);
  
//   var date_ob = new Date();
//   var day = ("0" + date_ob.getDate()).slice(-2);
//   var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//   var year = date_ob.getFullYear();
//   var date = year + "-" + month + "-" + day;
//   console.log(date);
//   let precent ={}
//   let abcent = {}

//   let Attendance_and_Date = {
//     Batch: req.body.year_of_batch,
//     Date: date,
//     Subject: req.body.subject,
//     Hour: req.body.Hour,
//     Precent :precent,
//     Abcent :abcent
//   }
//   console.log(Attendance_and_Date);

// })
module.exports = router;
