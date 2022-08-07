import React, { useState } from 'react'
import { Form,Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation  } from '@apollo/client';

export default function Register() {
  const [ values, setValues ] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword:'' 
  });

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.values});
  }

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, result){
      console.log(result)
    },
    variables: values
  })

  const onSubmit = (event) => {
    event.preventDefault();
    addUser();
  }

  

  return (
    <div>
      <Form onSubmit={onSubmit} noValidate>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          value= {values.username}
          onChange = {onChange}
          />
          <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          value= {values.email}
          onChange = {onChange}
          />
          <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value= {values.password}
          onChange = {onChange}
          />
          <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          value= {values.confirmPassword}
          onChange = {onChange}
          />
          <Button type="submit" primary>
            Register
          </Button>
      </Form>
    </div>
  )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ){
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $usernconfirmPasswordame
      }
    ) {
      id email username createdAt token
    }
  }
`