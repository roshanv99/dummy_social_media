const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const { MONGODB } = require('./config.js')
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs') 


// const pubsub = new PubSub();
//A PubSub instance enables your server code to both publish events to a particular label and listen for events associated with a particular label.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        path: '/subscriptions' 
      },
    context: ({req}) => ({ req }) ,
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then( () => {
        console.log(`MongoDB connected`);
        return server.listen({ port:5000 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })