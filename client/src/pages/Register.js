import React, { useState,useContext } from 'react'
import { Form,Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation  } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

export default function Register(props) {
  const context = useContext(AuthContext);
  const history = useNavigate()
  const [ errors, setErrors ] = useState({});

  //UseForm is a custom hook
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword:'' 
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, {data : { register:userData } }){
      context.login(userData);
      history('/');
    },
    onError(err){
      console.log("Form Error",err);
      if(err)
        setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  })

  function registerUser(){
    addUser();
  }

  return (
    <div>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading':''}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          error={errors.email ? true: false}
          value= {values.email}
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
          <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          error={errors.confirmPassword ? true: false}
          value= {values.confirmPassword}
          onChange = {onChange}
          />
          <Button type="submit" primary>
            Register
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
        confirmPassword: $confirmPassword
      }
    ) {
      id email username createdAt token
    }
  }
`