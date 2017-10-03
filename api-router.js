const express = require('express');
const app = express();
/* const socketIo = require('socket.io');
const serv = require('http').createServer(app)
 */
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
const checkJwt = require('express-jwt');


function apiRouter(database) {
  
  /* 
  const io = socketIo.listen(serv);
  serv.listen(1000);
 */
  

  const router = express.Router();
  
  // avoides Crossdomain Problems
  router.use((req,res,next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization" );
      next();
  });


/*   router.use(
      checkJwt({ secret: process.env.JWT_SECRET }).unless({ path: '/api/authenticate'})
  ); 

  router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({ error: err.message });
    }
  }); */

  router.get('/showyogaclasses', (req, res) => {



    const yogaClassCollection = database.collection('yogaclasses');

      yogaClassCollection.find({}).toArray((err, docs) => {

      //docs.totalRegistered = docs.signedIn.length();
      //console.log(docs);
      for(var i = 0; i < docs.length; i++){
        docs[i].totalBookings = (12 - docs[i].signedIn.length);
      }
    
      return res.json(docs);
    });
  });

  // UNREGISTER FOR CLASS
  /* {
    "_id": 1,
    "user": "paulop"
   } */
  router.post('/unregister', (req, res) => { 

    id = req.body._id;
    user = req.body.user;
    var placesOpen = 12;
    // console.log("ID: "+ id);

    const yogaClassCollection = database.collection('yogaclasses');
    yogaClassCollection.findOne({_id:id},(err, result) => {
      
      placesOpen = placesOpen - result.signedIn.length;
      for(var i=0; i < result.signedIn.length; i++) {
        if(result.signedIn[i] == user){
          yogaClassCollection.update( 
            {_id:id}, 
            { $pull: { signedIn: { $in: [ user ] }}}
          );
  
          return res.status(201).json({id:id, signedOut:"signedOut", bookingStatus: placesOpen+1});
        }
      }
      return res.status(200).json({error:"User not registered for this class"});
    });

  /*   io.on('connection', (socket) => {
      socket.emit('hello', {
        greeting: 'Hallo Alberto 2'
      })
    }) */
  });


  // REGISTER FOR CLASS
  /* {
    "date" : "Mittwoch, 27. September 2017",
    "username": "tonia",
    "time": "17.45 - 18.45 Uhr"
  } */
  router.post('/bookclass', (req, res) => {

   

    const date = req.body.date;
    const user = req.body.username;
    const time = req.body.time;
   // console.log('user: '+user);
    
    const yogaClassCollection = database.collection('yogaclasses');
    var id;
    var placesOpen;

    yogaClassCollection.findOne( {date: date , time:time}, (err,date) => {
      
      id = date._id;
     // console.log(id);
      placesOpen = 12 - parseInt(date.signedIn.length);

          for(var i = 0; i < date.signedIn.length; i++) {
             // console.log(date.signedIn[i]);
              if(date.signedIn[i] == user) {
             //   console.log("already registered");
                return res.status(200).json({id:id, signedIn: "areadySignedIn", bookingStatus: placesOpen});
              }
          } 
        
          yogaClassCollection.update({_id:id},{$addToSet:{signedIn:user}}, (err, result) => {
            
            if (err) {
              return res.status(500).json({ error: 'Error inserting new record.' });
            }
           // console.log('result : ' + result)
            //req.app.io.emit('booked',{id:id, signedIn:"signedIn", bookingStatus: placesOpen-1});
            return res.status(201).json({id:id, signedIn:"signedIn", bookingStatus: placesOpen-1});
          })
    });
  });

  router.post('/authenticate', (req, res) => {
  
      const username = req.body.username.toLowerCase().replace(/\s/g,'');

      //const username = "lauram";


      const usersCollection = database.collection('users');
      
      
          usersCollection
            .findOne({ username: username }, (err, result) => {
              if (!result) {
                return res.status(404).json({ error: 'user not found' })
              }

              const payload = {
                username: username
              };
      
              const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });
      

              return res.json({
                message: 'successfuly authenticated',
                token: token
              });
              
       

  });
  }); 

  return router;
}

module.exports = apiRouter;
