import React, { useEffect, useState } from 'react'
import Field from '../components/forms/Field'
import Select from '../components/forms/Select'
import { Link } from 'react-router-dom'
import customersAPI from '../services/customersAPI'
import InvoicesAPI from '../services/invoicesAPI'

import axios from 'axios'
const InvoicePage = ({ history, match }) => {
  const { id = 'new' } = match.params

  const [invoice, setInvoice] = useState({
    amount: '',
    customer: '',
    status: 'SENT',
  })

  const [customers, setCustomers] = useState([])
  const [editing, setEditing] = useState(false)

  const [errors, setErrors] = useState({
    amount: '',
    customer: '',
    status: '',
  })
  // Récupération des clients

  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll()
      setCustomers(data)
      console.log(data[0]['@id'].split('/').pop())
      if (!invoice.customer)
        setInvoice({ ...invoice, customer: data[0]['@id'].split('/').pop() })
    } catch (error) {
      console.log(error.response)
      //TODO : Flash notification erreur
      history.replace('/invoices')
    }
  }
  /* const fetchInvoice = async () => {
    try {
      const data = await axios
      .get('https://localhost:8000/api/invoices/' + id)
      .then(response => response.data)
      const {amount, status , customer} = data;
      console.log(customer);
      console.log(customer['@id'].split('/').pop());

     setInvoice({amount,status,customer: customer['@id'].split('/').pop()})
    } catch (error) {
      console.log(error.response)
    }
  }*/
  const fetchInvoice = async () => {
    console.log(id)

    try {
      const { amount, status, customer } = await InvoicesAPI.find(id)
      setInvoice({ amount, status, customer: customer['@id'].split('/').pop() })
    } catch (error) {
      console.log(error.response)
      //TODO : Flash notification erreur
      history.replace('/invoices')
    }
  }

  //Recuperation de la liste des clients a chaque
  useEffect(() => {
    fetchCustomers()
  }, [])
  // Récupération de la bonne facture quand l'identiifant de l'url  change
  useEffect(() => {
    if (id !== 'new') {
      setEditing(true)
      fetchInvoice(id)
    }
  }, [id])

  //Gestion des changement des inputs dans le form
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget
    setInvoice({ ...invoice, [name]: value })
  }

  //Gestion de la soumisssion du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (editing) {
        await InvoicesAPI.update2(id,invoice)
        //Notif
      } else {
       await InvoicesAPI.create2(invoice)
        // TODO ; Flash notification succes
        history.replace('/invoices')
        console.log(response)
      }
    } catch ({ response }) {
      const { violations } = response.data
      if (violations) {
        const apiErrors = {}
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message
        })
        setErrors(apiErrors)
      }
    }
  }
  /*
  const handleSubmit = event =>{
    event.preventDefault()
    console.log(invoice)
  }
*/
  return (
    <>
      {(editing && <h1>Modification d'une</h1>) || (
        <h1>Création d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name='amount'
          type='number'
          placeholder='Montant de la facture'
          label='Montant'
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name='customer'
          label='Client'
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option
              key={customer['@id'].split('/').pop()}
              value={customer['@id'].split('/').pop()}
            >
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name='status'
          label='Statut'
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value='SENT'>Envoyée</option>
          <option value='PAID'>Payée</option>
          <option value='CANCELLED'>Annulée</option>
        </Select>
        <div className='form-group'>
          <button type='submit' className='btn btn-success'>
            Enregistrer
          </button>
          <Link to='/invoices' className='btn btn-link'>
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  )
}

export default InvoicePage
