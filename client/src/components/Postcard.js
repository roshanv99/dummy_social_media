import React,{ useContext } from 'react'
import { Card, Icon, Label, Image,Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton  from './LikeButton';
import DeleteButton from './DeleteButton';

const Postcard = ({post : { body, createdAt, id, username, likes, comments }}) => {
    const { user } = useContext(AuthContext);
    function likePost(){

    }
    
    function commentOnPost(){

    }

    return (
        <Card fluid >
            <Card.Content>
            <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
            <Card.Header>{username}</Card.Header>
            <Card.Meta as ={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
            <Card.Description>
               {body}
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
            <LikeButton user ={user} post={{ id,likes }}/>
            <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                <Button color='blue' basic>
                    <Icon name='comments' />
                </Button>
                <Label as='a' basic color='blue' pointing='left'>
                    {comments.length}
                </Label>
            </Button>
                {user && user.username === username && <DeleteButton postId={id}/> }
            </Card.Content>
        </Card>
 )

}

export default Postcard