import React,{ useState } from 'react'
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Icon,Confirm } from 'semantic-ui-react';

const DeleteButton = ({postId}) => {
    const [confirmOpen, setConfirmOpen ] = useState(false);
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(_,){
            setConfirmOpen(false);
            // To do : Remove post from cache 
        },
        variables: {
            postId
        }
    })
    return (
    <>
        <Button as='div' color='red' floated='right' onClick={ ()=> console.log("Delete Post")}>
            <Icon name="trash" style={{margin:0}}/>
        </Button>
        <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePost} />
    </>
  )
}

const DELETE_POST_MUTATION = gql `
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

export default DeleteButton