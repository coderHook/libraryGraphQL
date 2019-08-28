import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'

export const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const EDIT_YEAR = gql`
  mutation editAuthor($name: String!, $born: Int){
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      bookCount
    }
  }
`

export const Authors = (props) => {

  if (!props.show) {
    return null
  }

  let authors = []

  return <Query query={ALL_AUTHORS}>
    {(result) => {
      if(result.loading) {
        return <div>Loading...</div>
      }

      console.log(result)

      authors = result.data.allAuthors

      return (
        <div>
          <h2>authors</h2>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>
                  born
                </th>
                <th>
                  books
                </th>
              </tr>
              {authors.map(a =>
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <h3>Set Birthyear</h3>

          <Mutation 
            mutation={EDIT_YEAR}
            refetchQueries={[{ query: ALL_AUTHORS }]}
          >
            {
              (editAuthor) => 
                <AuthorForm
                  authors={authors}
                  editAuthor={editAuthor}
                />
            }

          </Mutation>


        </div>
      )
    }}
  </Query>

}

const AuthorForm = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    console.log('Updating Author...', name, born)

    await props.editAuthor({
      variables: {name, born}
    })

    setName('')
    setBorn('')
  }

  return (
    <form action="">
      <select name="Select a name" id="" value={name} onChange={({target}) => setName(target.value)}
      >
        <option value="">Select a Name: </option>
        {
          props.authors.map(a => {
            return <option value={a.name}>{a.name}</option>
          })
        }
      </select>
      {/* <p>Name: <input type="text" value={name} onChange={({ target }) => setName(target.value)} /> </p> */}
      <p>Born: <input type="text" value={born} onChange={({ target }) => setBorn(Number(target.value))} /> </p>
      <button onClick={submit}>update author</button>
  </form>
  )
}
