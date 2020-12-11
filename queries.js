



let datas = `query {
  sections(where:{level:1}, sort:"position:asc"){
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

    children{
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
  sections(where:{level:1}, sort:"position:asc"){
    id
    name
    path
    
    children{
      id
      name
      path
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


