
let http = require('http') ;

let port = process.env.PORT || '3000' ;
let server ;

module.exports = {
  launchServer: app =>{

    app.set('port', port) ;
  
    server = http.createServer(app) ;
  
    server.on('listening', () => {
      console.log('Listening on ' + port) ;
    }) ;
    
    server.listen(port) ;
  },
  server:server
}