import React from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

export const ALL_BOOKS = gql`
{ 
  allBooks {
    title
    author
    published
  }
}
`

export const Books = (props) => {
  if (!props.show) {
    return null
  }


  return (
    <Query query={ALL_BOOKS}>
      {
        (result) => {
          if(result.loading) { 
            return <div>'Loading...'</div>
          }
        
          return (
            <div>
              <h2>books</h2>
        
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>
                      author
                    </th>
                    <th>
                      published
                    </th>
                  </tr>
                  {result.data.allBooks.map(a =>
                    <tr key={a.title}>
                      <td>{a.title}</td>
                      <td>{a.author}</td>
                      <td>{a.published}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )

        }
      }
    </Query>
  )

}

