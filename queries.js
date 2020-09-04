const { buildSchema } = require('graphql') ;
const graphqlHTTP = require('express-graphql').graphqlHTTP ;


let sections = `query{
  sections(where:{level:1}, sort:"position:asc"){
    name
    position
  }
}`;

module.exports = {
  sections:sections
}