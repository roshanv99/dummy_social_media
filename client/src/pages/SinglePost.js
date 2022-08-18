import React,{useContext} from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Button, Card, Grid, Icon,Image,Label } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton'
import moment from 'moment';



const SinglePost = (props) => {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const { data : { getPost }} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });
    let postMarkup;
    if(!getPost){
        postMarkup = <p>Loading Post...</p>
    } else {
        const { id, body, createdAt, username, likes, comments } = getPost;
        let likeCount = likes.length;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image size='small' float='right' src='https://react.semantic-ui.com/images/avatar/large/molly.png'/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount , likes}}/>
                                <Button as="div" labelPosition='right' onClick={ ()=> console.log("Comment Clicked" )}>
                                    <Button basic color='blue'>
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {comments.count}
                                    </Label>
                                </Button>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

  return (
    postMarkup
  )
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createAt username
            likes{
                username
            }
            comments{
                id username createAt body
            }
        }
    }
`

export default SinglePost;
