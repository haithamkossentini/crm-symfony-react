import axios from 'axios'

function findAll() {
  return axios
    .get('https://localhost:8000/api/customers')
    .then((response) => response.data['hydra:member'])
}
function deleteCustomer(id) {
  return axios.delete('https://localhost:8000/api/customers/' + id)
}
function find(id) {
  axios
    .get('https://localhost:8000/api/customers/' + id)
    .then((response) => response.data)
}
function update(id, customer) {
  axios.put('https://localhost:8000/api/customers/' + id, customer)
}
function create(customer) {
  axios.post('https://localhost:8000/api/customers', customer)
}
export default {
  findAll,
  delete: deleteCustomer,
  find,
  update,
  create,
}
