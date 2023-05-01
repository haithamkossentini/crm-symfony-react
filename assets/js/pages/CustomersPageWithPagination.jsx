import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Pagination from '../components/Pagination'
const CustomersPageWithPagination = (propos) => {
  const [customers, setCustomers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8

  useEffect(() => {
    axios
      .get(
        `https://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then((response) => {
        setCustomers(response.data['hydra:member'])
        setTotalItems(response.data['hydra:totalItems'])
        setLoading(false)
      })
      .catch((error) => console.log(error.response))
  }, [currentPage])

  const handleDelete = (id) => {
    const originalCustomers = [...customers]
    //approche optimiste
    setCustomers(
      customers.filter((customer) => customer['@id'].split('/').pop() !== id)
    )
    axios
      .delete('https://localhost:8000/api/customers/' + id)
      .then((response) => console.log('ok'))
      .catch((error) => {
        setCustomers(originalCustomers)
        console.log(error.response)
      })
  }

  const handlePageChange = (page) => {
    setLoading(true)
    setCurrentPage(page)
  }

  const paginatedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemsPerPage
  )
  return (
    <>
      <h1>Liste des clients pagination</h1>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className='text-center'>Factures</th>
            <th className='text-center'>Montant Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
            {loading   && (
                <tr>
                    <td>Chargement ...</td>
                </tr>
            )}
          {! loading && 
          customers.map((customer) => (
            <tr key={customer['@id'].split('/').pop()}>
              <td>{customer['@id'].split('/').pop()}</td>
              <td>
                <a href='#'>
                  {customer.firstName}
                  {customer.lastName}
                </a>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td className='text-center'>
                <span className='badge bg-primary'>
                  {customer.invoices.length}
                </span>
              </td>
              <td className='text-center'>
                {customer.totalAmount.toLocaleString()}€
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer['@id'].split('/').pop())}
                  disabled={customer.invoices.length > 0}
                  className='btn btn-sm btn-danger'
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
        length={totalItems}
        onPageChanged={handlePageChange}
      ></Pagination>
    </>
  )
}

export default CustomersPageWithPagination
