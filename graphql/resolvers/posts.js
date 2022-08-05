const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

module.exports = {
    Query:{
        async getPosts(){
            try{
                const Posts = await Post.find();
                return Posts
            }
            catch(e){
                throw new Error(e)
            }
        },

        async getPost(_, { postId }){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else{
                    throw new Error("Post not found");
                }
            }
            catch(err){
                throw new Error(err)
            }
        },
        
    },

    Mutation: {
        async createPost(_, { body }, context){
            const user = checkAuth(context);
            if(body.trim() === '')
                throw new Error('Body Post must not be empty');
                
            const newPost = new Post({
                body,
                user : user.id,
                username:user.username,
                createdAt: new Date().toISOString
            });

            const post = await newPost.save();
            context.pubsub.publish('NEW POST', {
                newPost: post
            });
            return post;
        },

        async deletePost(_, { postId }, context){
            const user = checkAuth(context);           
            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully';
                } 
                else {
                    throw new AuthenticationError('Action not allowed');
                }
            }
            catch(e){
                throw new Error(e);
            }    
        },

        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context);
            if(body.trim() === ""){
                throw new UserInputError("Empty Comment", {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }
            const post = await Post.findById(postId);
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString
                })
                await post.save();
                return post
            } else {
                throw new UserInputError('Post not found');
            }
        },

        deleteComment: async(_, { postId, commentId }, context) => {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                if(post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex,1);
                    await post.save();
                } else {
                    throw new AuthenticationError("Action not Allowed");
                }
            } else {
                throw new UserInputError("Post not found")
            } 
        },

        likePost: async(_, { postId }, context) => {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    // Post already liked, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                } else{
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString
                    });
                }
                await post.save()
                return post;
            } else throw new UserInputError('Post not found')
        },        
    },

    Subscription: {
        newPost: {
            subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
        }
    }
}