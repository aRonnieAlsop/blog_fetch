const { ApolloServer, gql } = require('apollo-server');
const db = require('./db'); //imports the sqlite db

//defines the GraphQL schema:
const typeDefs = gql`
    type Post {
        id: ID!
        title: String!
        content: String!
        author: String!
        }

    type Query {
        posts: [Post!] 
        post(id: ID!): Post 
        }

     type Mutation {
        createPost(title: String!, content: String!, author: String!): Post 
        }
        `
//defines resolvers: 
const resolvers = {
    Query: {
        posts: () => {
            return new Promise((resolve, reject) => {
                db.all("SELECT * FROM posts", [], (err, rows) => {
                    if (err) reject(err);
                    resolve(rows); // return all posts
                });
            });
        },
        post: (_, { id }) => {
            return new Promise((resolve, reject) => {
                db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
                    if (err) reject(err);
                    resolve(row); //return a single post by ID
                });
            });
        },
    },
    Mutation: {
        createPost: (_, { title, content, author }) => {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)");
                 stmt.run(title, content, author, function (err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID, title, content, author }); //return the new post
                });
            });
        },
    },
};

//initialize apollo server:
const server = new ApolloServer({
    typeDefs,
    resolvers
});

//start the server
server.listen().then(({ url }) => {
    console.log(`Server is running at ${url}`);
});