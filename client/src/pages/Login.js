import React, { useState, useContext } from 'react'
import { Form,Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation  } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

export default function Login(props) {
  const context = useContext(AuthContext);
  const history = useNavigate()
  const [ errors, setErrors ] = useState({});

  //UseForm is a custom hook
  const { onChange, onSubmit, values } = useForm(loginCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, result){
      console.log("Add User Result: ",result, props);
      context.login(result.data.login)
      history('/')
    },
    onError(err){
      console.log("Form Error",err);
      if(err)
        setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  })

  function loginCallback(){
    loginUser();
  }

  return (
    <div>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading':''}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          error={errors.username ? true: false}
          value= {values.username}
          onChange = {onChange}
          />
          <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          error={errors.password ? true: false}
          value= {values.password}
          onChange = {onChange}
          />
          <Button type="submit" primary>
            Login
          </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
      </div>

      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ){
    login(
        username: $username
        password: $password
    ) {
      id email username createdAt token
    }
  }
`