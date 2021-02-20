



let datas = `query {
  sections(where:{level:1, position_lt:10}, sort:"position:asc"){
    id
    name
    path
    
    post{
      name
      template{
        name
        jade
      }
      vars
      bracket{
        __typename
        
        ... on ComponentJadeJadePage {

          name
          jade
          path

        }
        
        ... on ComponentModularMedia {
          name
          
          media{
            name
            url
          }
          
          template{
            name
            jade
          }
        }

        ... on ComponentModularArticle {
          
          name
          
          page{
            name
            jade
            path
          }
          
          template{
            name
            jade
          }
          
          media{
            name
            url
          }

        }
        
        

        ... on ComponentSingleBlocsSlideshow {
          name
          sections{
            name
          }
          template{
            name
            jade
          }
        }
        
        ... on ComponentSingleBlocsPatchwork {
          name
          sections{
            name
          }
          template{
            name
            jade
          }
        }
        
        ... on ComponentSingleBlocsCredits {
          name
          template{
            name
            jade
          }
        }
        
        
      }
    }

    children(sort:"position:asc"){
      id
      name
      path
      
      category{
        name
      }

      post{
        name
        template{
          name
          jade
        }
        vars
        bracket{
          __typename
          
          ... on ComponentJadeJadePage {
            name
            jade
            path
          }
          
          ... on ComponentModularArticle {
            
            name
            
            page{
              name
              jade
              path
            }

            template{
              name
              jade
            }
            
            media{
              name
              url
            }
          }
          
          ... on ComponentModularMedia {
            name
            
            media{
              name
              url
            }
            template{
              name
              jade
            }
          }

          ... on ComponentSingleBlocsSlideshow {
            name
            sections{
              name
            }
            template{
              name
              jade
            }
          }
          
          ... on ComponentSingleBlocsPatchwork {
            name
            sections{
              name
            }
            template{
              name
              jade
            }
          }
          
          ... on ComponentSingleBlocsCredits {
            name
            template{
              name
              jade
            }
          }
          

        }
      }


      
      position
      level
    }
    position
    level
  }
}
`;


let navdatas = `query {
  sections(where:{level:1, position_lt:10}, sort:"position:asc"){
    id
    name
    path
    post{
      name
    }
    children(sort:"position:asc"){
      id
      name
      path
      category{
        name
      }
      post{
        name
      }
      position
      level
    }

    position
    level
  }
}
`;


/* 
          todo - canuse --  JSONPath on locales System selectonly one language etc... 
*/


module.exports = {
  sections:{
    datas:datas,
    navdatas:navdatas,
    variables:{}
  }
}


