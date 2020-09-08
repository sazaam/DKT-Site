



let main_sections_getOrdered = `query {
  sections(where:{level:1}, sort:"position:asc"){
    id
    name
    
    post{
      name
      template{
        name
        jade
      }
      vars
      bracket{
        __typename
        
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
        
        ... on ComponentModularArticle {
          name
          template{
            name
            jade
          }
        }
        
        ... on ComponentModularMedia {
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
      post{
        name
        template{
          name
          jade
        }
        vars
        bracket{
          __typename
          
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
          
          ... on ComponentModularArticle {
            name
            template{
              name
              jade
            }
          }
          
          ... on ComponentModularMedia {
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


/* 
          todo - canuse --  JSONPath on locales System selectonly one language etc... 
*/


module.exports = {
  sections:{
    query:main_sections_getOrdered,
    variables:{}
  }
}


