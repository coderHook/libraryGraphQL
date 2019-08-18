import React, { useState } from 'react'
import {Authors, ALL_AUTHORS} from './components/Authors'
import {Books, ALL_BOOKS } from './components/Books'
import NewBook from './components/NewBook'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }


  const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }

`

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      {
        errorMessage &&
        <div style={{color: 'red'}}>
          {errorMessage}
        </div>
      }

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />
      <Mutation 
        mutation={CREATE_BOOK}
        refetchQueries={[{query: ALL_AUTHORS}, {query: ALL_BOOKS}]}
        onError={handleError}
        >
        {
          (addBook) =>         
            <NewBook
              show={page === 'add'}
              addBook = {addBook}
            />
        }

      </Mutation>


    </div>
  )
}

export default App