const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);



function socketApp(socketNumber) {

  //  const io = socketIo();

    io.on('connection', (socket) => {

      //console.log('new connection made');

      // TEST MELDUNGEN
/*       socket.on('event1', (data) => {
        console.log(data.msg);
      });
      socket.emit('event2',{
        msg: 'Server to client, do you read me? Over'
      });
      socket.on('event3', (data) => {
        console.log(data.msg);
        socket.emit('event4',{
          msg: 'Loud and clear :)'
        })
      }); */
      socket.on('bookingStatusUpdate', (data) => {
       // console.log("Received on Server ID: " + data.id );
       // console.log("Total Bookings: " + data.totalBookings );
 
        io.emit('newBookingStatus',{
           id: data.id,
           placesAvailable: data.totalBookings 
        })
      });


    })
    server.listen(socketNumber,()=>{
      console.log("socketio listen to port 8000...");
    })

    return io;
}

module.exports = socketApp;