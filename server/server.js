const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const CONN = 'mongodb://localhost:27017/library'
const PORT = 4000
const Author = require('./models/Author.model')
const Book = require('./models/Book.model')

async function startServer(){
    const app = express()

    const typeDefs = gql`
    type Query
        { 
            hello: String
            getAllAuthors: [Author]
            getAllBooks: [Book]
            getBooksByAuthor(authorId: String): AuthorCatalog
        }
    type Author
        {
            id: ID
            name: String
            bio: String
        }
    type Book
        {
            id: ID
            title: String
            description: String
            authorId: ID
        }
    type AuthorCatalog
        {
            author: Author
            books: [Book]
        }
    type Mutation
        {
            addAuthor(name: String, bio: String): Author
            addBook(title: String, description: String, authorId: String): Book
        }
    `
    
    const resolvers = {
        Query: { 
            hello: () =>{ return "Hello Apollo"},
            getAllAuthors: async () => {
                return await Author.find()
            },
            getAllBooks: async () =>{
                return await Book.find()
            },
            getBooksByAuthor: async (parent, args) =>{
                const { authorId } = args
                const author = await Author.findById(authorId)
                const books = await Book.find({authorId : authorId})
                return {author, books}
            }
        },
        Mutation: {
            addAuthor: async (parent, args) =>{
                const author = new Author({name: args.name, bio: args.bio})
                await author.save()
                return author
            },
            addBook: async(parent, args)=> {
                const book = new Book ({title: args.title, description: args.description, authorId: args.authorId})
                await book.save()
                return book
            }
        }
    }

    const apolloServer = new ApolloServer({typeDefs, resolvers})
    await apolloServer.start()
    apolloServer.applyMiddleware({app})

    await mongoose.connect(CONN,{
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    
    // default route
    app.use((req, res) => { res.send("Hello from apollo server.")})

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

startServer()