import axios from 'axios'
import CustomersAPI from './customersAPI'
import InvoicesAPI from './invoicesAPI'
import jwtDecode from 'jwt-decode'
import { LOGIN_API } from '../config'

/**
 *  Déconnexion (suppression du token du localstorage et sur Axios)
 */

function logout() {
  window.localStorage.removeItem('authToken')
  delete axios.defaults.headers['Authorization']
  // CustomersAPI.findAll().then((data) => console.log(data))
}
/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {*} credentials
 * @returns
 */
function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      //je stockes le token dans mon localStorage
      window.localStorage.setItem('authToken', token)
      //On prévient Axios qu'on a maintenant un headerpar défaut sur toutes nos futures requetes HTTP
      setAxiosToken(token)
      //CustomersAPI.findAll().then((data) => console.log(data))
    })
}
/**
 * Positionne le token JWT sur Axios
 * @param {*} token Le token JWT
 */
function setAxiosToken(token) {
  axios.defaults.headers['Authorization'] = 'Bearer ' + token
}
/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  //1 voir si on a un token ?
  const token = window.localStorage.getItem('authToken')

  //2 si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token)
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token)
    }
  }
}
/**
 * Permet de savoir si on est authentifié u pas
 * @returns boolean
 */
function isAuthenticated() {
  //1 voir si on a un token ?
  const token = window.localStorage.getItem('authToken')

  //2 si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token)
    if (expiration * 1000 > new Date().getTime()) {
      return true
    }
    return false
  }
  return false
}
export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
}
