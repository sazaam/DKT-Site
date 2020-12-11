
module.exports = {
  ENV:"development",
  PATH:{
    jade:'/public/jade/',
    db: process.env.STRAPI_PATH,
    db_auth: process.env.STRAPI_AUTH,
    db_graphql: process.env.STRAPI_GRAPHQL,
    cdn: process.env.CDN
  },
  SITE:{
    title:'> Dynamic Korea Technology'
  },
  fixtures:
  {
    datas:'./json/fixtures/db_sections.json',
    navdatas:'./json/fixtures/topsections.json',
  },
  users:{
    dkt:{
      identifier: process.env.API_USERNAME,
      password: process.env.API_SECRET
    }
  }
}