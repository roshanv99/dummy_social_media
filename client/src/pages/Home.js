import React from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Grid } from 'semantic-ui-react'
import Postcard from '../components/Postcard'

const FETCH_POSTS_QUERY = gql`
{
    getPosts{
      id 
      body 
      username 
      createdAt
      likes {
        username
      }
      comments{
        id username createdAt body
      }
    }
  }
`

export default function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  console.log("==>", data);
  const posts = data ? data.getPosts : {};
  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          posts && posts.map((post) => (
            <Grid.Column key={post.id}>
              <Postcard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  )
}