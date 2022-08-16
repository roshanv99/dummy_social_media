import React from 'react'
import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useMutation  } from '@apollo/client';

const PostForm = () => {
    const  { values, onChange, onSubmit } = useForm(cretePostCallback, {
        body:''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION,{
        variables:values,
        update(_, result){
            console.log(result);
            values.body = '';
        }
    })

    function cretePostCallback(){
        createPost()
    }

    return (
    <Form onSubmit={onSubmit}>
        <h2>Create a Post: </h2>
        <Form.Field>
            <Form.Input
            placeholdr="Hi World"
            name="body"
            onChange={onChange}
            value={values.body}
            />
            <Button type='submit' color="teal">Submit</Button>
        </Form.Field>
    </Form>
  )
}

const CREATE_POST_MUTATION = gql`
mutation createPost($body:String!){
    createPost(body: $body){
        id
        body
        createdAt
        username
        likes {
            id username createdAt
        }
        comments {
            id body username createdAt
        }
    }
}
`

export default PostForm