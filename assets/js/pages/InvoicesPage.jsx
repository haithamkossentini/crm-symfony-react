import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Pagination from '../components/Pagination'
import invoicesAPI from '../services/invoicesAPI'
import { Link } from 'react-router-dom'

const STATUS_CLASSES = {
  PAID: 'success',
  SENT: 'info',
  CANCELLED: 'danger',
}
const STATUS_LABELS = {
  PAID: 'Payée',
  SENT: 'Envoyée',
  CANCELLED: 'Annulée',
}
const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const itemsPerPage = 8

  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll()
      setInvoices(data)
    } catch (error) {
      console.log(error.response)
    }
  }
  useEffect(() => {
    fetchInvoices()
  }, [])

  //Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page)
  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value)
    setCurrentPage(1)
  }

  //Gesion de la suppression d'un customer
  const handleDelete = async (id) => {
    const originalInvoices = [...invoices]
    //approche optimiste
    setInvoices(
      invoices.filter((invoice) => invoice['@id'].split('/').pop() !== id)
    )
    try {
      await invoicesAPI.delete(id)
    } catch (error) {
      setInvoices(originalInvoices)
    }
  }
  //Gestion Format date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY')

  // Filtrage des invoices en fonction de la recherche
  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  )

  // Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  )
  return (
    <>
      <div className='mb-3 d-flex justify-content-between align-items-center'>
        <h1>Liste des factures</h1>
        <Link to='/invoices/new' className='btn btn-primary'>
          Créer une facture
        </Link>
      </div>
      <div className='form-group'>
        <input
          type='text'
          onChange={handleSearch}
          value={search}
          className='form-control'
          placehoder='Rechercher ...'
        />
      </div>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className='text-center'>Date d'envoi</th>
            <th className='text-center'>Statut</th>
            <th className='text-center'>Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice['@id'].split('/').pop()}>
              <td>{invoice.chrono}</td>
              <td>
                <a href='#'>
                  {invoice.customer.firstName}
                  {invoice.customer.lastName}
                </a>
              </td>
              <td className='text-center'>{formatDate(invoice.sentAt)}</td>
              <td className='text-center'>
                <span
                  className={'btn btn-sm btn-' + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className='text-center'>{invoice.amount.toLocaleString()}</td>
              <td>
                <Link
                  to={'/invoices/' + invoice['@id'].split('/').pop()}
                  className='btn btn-sm btn-primary mr-1'
                >
                  Editer
                </Link>
                <button
                  className='btn btn-sm btn-danger'
                  onClick={() => handleDelete(invoice['@id'].split('/').pop())}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChanged={handlePageChange}
        length={filteredInvoices.length}
      />
    </>
  )
}

export default InvoicesPage
