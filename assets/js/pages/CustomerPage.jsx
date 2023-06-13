import React, { useEffect, useState } from 'react'
import Field from './../components/forms/Field'
import { Link } from 'react-router-dom'
import customersAPI from '../services/customersAPI'
import { toast } from 'react-toastify'
import FormContentLoader from '../components/loaders/FormContentLoader'
const CustomerPage = ({ match, history }) => {
  const { id = 'new' } = match.params

  
  const [customer, setCustomer] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: '',
  })
  const [errors, setErrors] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: '',
  })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  //Recuperation  du customer en fonction de l'id
  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } = await customersAPI.find(
        id
      )
      setCustomer({ firstName, lastName, email, company })
      setLoading(false)
    } catch (error) {
      toast.error("Le client n'a pas pu être chargé")
      history.replace('/customers')
    }
  }
  //Chargement du customer si besoin du chargement du composant ou au changement de l'id
  useEffect(() => {
    if (id !== 'new') {
      setLoading(true)
      setEditing(true)
      fetchCustomer(id)
    }
  }, [id])

  //Gestion des changement des inputs dans le form
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget
    setCustomer({ ...customer, [name]: value })
  }

  //Gestion de la soumission
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (editing) {
        await customersAPI.update(id, customer)
        toast.success('Le client a bien été modifié')
      } else {
        await customersAPI.create(customer)

        toast.success('Le client a bien été créé')
        history.replace('/customers')
      }
      setErrors({})
    } catch ({ response }) {
      const { violations } = response.data
      if (violations) {
        const apiErrors = {}
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message
        })
        setErrors(apiErrors)
        toast.error('Des erreur dans votre formulaire !')
      }
    }
  }
  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      {loading &&<FormContentLoader /> }
     {!loading && (<form onSubmit={handleSubmit}>
        <Field
          name='lastName'
          label='Nom de famille'
          placeholder='Nom de famille du client'
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name='firstName'
          label='Prénom de famille'
          placeholder='Prénom du client'
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name='email'
          label='Email'
          placeholder='Adresse email du client'
          type='email'
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name='company'
          label='Entreprise'
          placeholder='Entreprise du client'
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <br></br>
        <div className='mb-3  form-group'>
          <button type='submit' className='btn btn-success'>
            Enregistrer
          </button>
          <Link to='/customers' className='btn btn-link'>
            Retour à la liste
          </Link>
        </div>
      </form>)}
    </>
  )
}

export default CustomerPage
