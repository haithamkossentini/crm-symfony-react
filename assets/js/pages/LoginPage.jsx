import React, { useContext, useState } from 'react'
import AuthAPI from '../services/authAPI'
import AuthContext from '../contexts/AuthContext'
import Field from '../components/forms/Field'
import { toast } from 'react-toastify'

const LoginPage = ({ history }) => {
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
      toast.success('Vous êtes connecté 😃')
      history.replace('/customers')
    } catch (error) {
      setError('Les informations ne correspondent pas')
      toast.error('Une erreur est survenue')
    }
  }
  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit}>
        <Field
          label='Adresse email'
          name='username'
          value={credentials.username}
          onChange={handleChange}
          placeholder='Adresse email de connexion'
          error={error}
        />
        <Field
          label='Mot de passe'
          name='password'
          value={credentials.password}
          onChange={handleChange}
          type='password'
          error={error}
        />

        <div className='form-group'>
          <button type='submit' className='btn btn-success'>
            Je me connecte
          </button>
        </div>
      </form>
    </>
  )
}

export default LoginPage
