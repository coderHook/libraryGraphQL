const { ApolloServer, gql, UserInputError } = require('apollo-server')
const uuid = require('uuid/v1')
const mongoose = require('mongoose')

// Models
const Authors = require('./models/author.model.js')
const Books = require('./models/book.model.js')

// Pre-DB
// let { authors, books } = require('./data')

mongoose.set('useFindAndModify', false)

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack@cluster0-ostce.mongodb.net/library?retryWrites=true'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Query {
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book],
    allAuthors: [Author!]!
  }

  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]
    id: ID!
  }

  type Author {
    id: ID!
    name: String
    born: Int
    bookCount: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Books.collection.countDocuments(),
    authorCount: () => Authors.collection.countDocuments(),
    allBooks: (root, args) => {
      let result = books;
      if(args.author) result = books.filter( book => book.author === args.author )
      if(args.genre) return result.filter(b => b.genres.includes(args.genre))

      return books
    },

    allAuthors: async () => {

    const authors = await Authors.find({})
    const books = await Books.find({})

    return authors.map(a => ({
      name: a.name, 
      born: a.born, 
      bookCount: books.filter(b => b.name === a.name).length
    }))
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      console.log('Im mutating!!!!!')
      // Check if the book was already added
      if(await Books.find({title: args.title}).length > 0) {
        console.log(await Books.find({title: args.title}))
        throw new UserInputError('This book already exists!', {
          invalidArgs: args.title
        })
      }

      const authorExists = await Authors.find({name: args.author}).length > 0
      console.log('exists!!!', authorExists)

      if(!authorExists) {
        // create new author
        const author2add = new Authors({name: args.author})

        // save in DB new Author
        try {
          console.log('saving author!!!!')
          await author2add.save()
        } catch (error) {
            throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    }

    // Create new book
    const book = new Books({...args})

    // Save new book
    try {
      await book.save()
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args
      })
    }

      return book
    },

    editAuthor: (root, args) => {
      let authorToEdit = authors.find(a => a.name === args.name)

      if(authorToEdit) {
        authorToEdit.born = args.setBornTo
        return authorToEdit
      }

      return null
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`)
})