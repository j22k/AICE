var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// router.post('/sign_up',(req,res)=>{
//   console.log(req.body);
//   userHelpers.dosignup(req.body).then((status)=>{
//       console.log(req.body);
//       if(status==true){
//         res.redirect('/')
//       }
//       else{
//         res.redirect('')
//       }
//   })
// })
module.exports = router;
