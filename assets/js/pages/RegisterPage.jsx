import React, { useState } from 'react'
import Field from '../components/forms/Field'
import { Link } from 'react-router-dom'
import axios from 'axios'
import UserAPI from '../services/usersAPI'



const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    passsword: '',
    passwordConfirm: '',
  })

  //Gestion des changement des inputs dans le form
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget
    setUser({ ...user, [name]: value })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    const apiErrors = {}
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original"
      setErrors(apiErrors)
      toast.error('Des erreurs dans votre formulaire')
      return
    }
    try {
      await UserAPI.register(user)
      setErrors({})
      toast.success('Vous êtes désormais inscrit 😃')
      history.replace('/login')
    } catch ({ response }) {
      const { violations } = response.data
      if (violations) {
        violations.forEach((violation) => {
          apiErrors[violation.propertyPath] = violation.message
        })
        setErrors(apiErrors)
      }
      toast.error('Des erreurs dans votre formulaire')

    }

    console.log(user)
  }
  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name='firstName'
          label='Prénom'
          placeholder='Votre prénom'
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        ></Field>
        <Field
          name='lastName'
          label='Nom'
          placeholder='Votre nom'
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        ></Field>
        <Field
          name='email'
          label='Email'
          placeholder='Votre email'
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        ></Field>
        <Field
          name='password'
          label='Mot de passe'
          placeholder='Votre mot de passe'
          error={errors.password}
          value={user.password}
          onChange={handleChange}
          type='password'
        ></Field>
        <Field
          name='passwordConfirm'
          label='Confirmation mot de passe'
          placeholder='Confirmer votre mot de passe'
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
          type='password'
        ></Field>
        <br></br>
        <div className='form-group'>
          <button type='submit' className='btn btn-success'>
            Confirmation
          </button>
          <Link to='/login' className='btn btn-link'>
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  )
}

export default RegisterPage
