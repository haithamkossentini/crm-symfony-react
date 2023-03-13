import React, { useEffect , useState } from 'react'
import axios from "axios"
const CustomersPage = (propos) => {
    const [customers, setCustomers] = useState([]);
    useEffect(() =>{
        axios
        .get('https://localhost:8000/api/customers')
        .then(response=>response.data['hydra:member'])
        .then(data =>setCustomers(data))
        .catch(error => console.log(error.response));
    }, []);
    
    
    return (
    <>
        <h1>Liste des clients</h1>
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant Total</th>
                    <th/>
                </tr>
            </thead>
            <tbody>
                {customers.map((customer)=>(
                <tr key={customer["@id"].split("/").pop()}>
                    <td>{customer["@id"].split("/").pop()}</td>
                    <td><a href="#">{customer.firstName}{customer.lastName}</a></td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center"><span className="badge bg-primary">{customer.invoices.length}</span></td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()}€</td>
                    <td><button className="btn btn-sm btn-danger">Supprimer</button></td>
                </tr>
                ))}
       
            </tbody>
        </table>
    </>
    )
}
 
export default CustomersPage;