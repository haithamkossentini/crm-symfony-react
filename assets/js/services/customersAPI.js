import axios from 'axios'
import Cache from './cache'
import { CUSTOMERS_API } from '../config'
async function findAll() {
  const cachedCustomers = await Cache.get('customers')
  if (cachedCustomers) return cachedCustomers
  return axios.get(CUSTOMERS_API).then((response) => {
    const customers = response.data['hydra:member']
    Cache.set('customers', customers)
    return customers
  })
}
function deleteCustomer(id) {
  return axios
    .delete(CUSTOMERS_API+'/' + id)
    .then(async (response) => {
      const cachedCustomers = await Cache.get('customers')

      if (cachedCustomers) {
        const updatedCustomers = cachedCustomers.filter((c) => {
          return c['@id'].split('/').pop() !== id.toString();
        })


        Cache.set('customers', updatedCustomers)
      }


      return response
    })
}




async function find(id) { 

  const cachedCustomer = await Cache.get("customers." + id);

  if (cachedCustomer) return cachedCustomer;
 
    return axios.get(CUSTOMERS_API+'/' + id).then(response => {
      const customer = response.data;
  
      Cache.set("customers." + id, customer);
  
      return customer;
    });
} 
function update(id, customer) {
  return axios
    .put(CUSTOMERS_API+'/' + id, customer)
    .then(async response => {
      const cachedCustomers = await Cache.get("customers");
      const cachedCustomer = await Cache.get("customers."+id);
      if(cachedCustomer){
        Cache.set('customers.'+id , response.data)
      }
      if (cachedCustomers) {
        const index = cachedCustomers.findIndex(c => c["@id"] === "/api/customers/" + id);
        if (index !== -1) {
          cachedCustomers[index] = response.data;
        }
      }

      return response;
    });
}


//deuxiéme solution si je modifie il y'a une modification envoyé une nouvelle requete vers la bd
/*function update(id, customer) {
  return axios
    .put('https://localhost:8000/api/customers/' + id, customer)
    .then((response) => {
      Cache.invalidate('customers')

      return response
    })
}*/

function create(customer) {
  return axios
    .post(CUSTOMERS_API, customer)
    .then(async (response) => {
      const cachedCustomers = await Cache.get('customers')

      if (cachedCustomers) {
        Cache.set('customers', [...cachedCustomers, response.data])
      }

      return response
    })
}
export default {
  findAll,
  delete: deleteCustomer,
  find,
  update,
  create,
}
