
module.exports = {

  ENV:"development",
  PATH:{
    jade:'/public/jade/',
    db:'http://localhost:1337/',
    db_auth:'auth/local',
    db_graphql:'graphql',
    cdn:'http://localhost:1337'
  },
  SITE:{
    title:'> Dynamic Korea Technology'
  },
  fixtures:'./json/fixtures/fixtures.json',
  users:{
    dkt:{
      identifier: 'dkt',
      password: 'GB85J2embgKk7jz'
    }
  }

}