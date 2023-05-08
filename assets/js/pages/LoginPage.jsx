import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthAPI from '../services/authAPI'
const LoginPage = ({ onLogin, history }) => {
  console.log(history)
  const { setIsAuthenticated } = useContext(AuthContext)
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const value = event.currentTarget.value
    const name = event.currentTarget.name

    setCredentials({ ...credentials, [name]: value })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await AuthAPI.authenticate(credentials)
      setError('')
      setIsAuthenticated(true)
      history.replace('/customers')
    } catch (error) {
      setError('Les informations ne correspondent pas')
    }
  }
  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>Adresse Email</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type='email'
            id='username'
            name='username'
            placeholder='Email'
            className={'form-control' + (error && ' is-invalid')}
          />
          {error && <p className='invalid-feedback'>{error}</p>}
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Mot de passe</label>
          <input
            onChange={handleChange}
            value={credentials.password}
            type='password'
            placeholder='Mot de passe'
            className='form-control'
            id='password'
            name='password'
          />
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-success'>
            je me connecte
          </button>
        </div>
      </form>
    </>
  )
}

export default LoginPage
