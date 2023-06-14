import axios from 'axios'
import { INVOICES_API } from '../config'
function findAll() {
  return axios
    .get(INVOICES_API)
    .then((response) => response.data['hydra:member'])
}
function deleteInvoice(id) {
  return axios.delete(INVOICES_API+'/' + id)
}
function find(id) {
  return axios
    .get(INVOICES_API+'/' + id)
    .then((response) => response.data)
}
function update(id, invoice) {
  axios.put(INVOICES_API+'/' + id, invoice)
}
function create(invoice) {
  axios.post(INVOICES_API, invoice)
}
function update2(id, invoice) {
  return axios.put(INVOICES_API+'/' + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  })
}
function create2(invoice) {
  return axios.post(INVOICES_API, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  })
}
export default {
  findAll,
  delete: deleteInvoice,
  find,
  create,
  update,
  update2,
  create2,
}
