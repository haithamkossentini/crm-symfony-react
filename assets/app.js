/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom'
import './styles/app.css'
//start the Stimulus application
import './bootstrap'
import Navbar from './js/components/Navbar'
import PrivateRoute from './js/components/PrivateRoute'
import AuthContext from './js/contexts/AuthContext'
import CustomerPage from './js/pages/CustomerPage'
import CustomersPage from './js/pages/CustomersPage'
import HomePage from './js/pages/HomePage'
import InvoicePage from './js/pages/InvoicePage'
import InvoicesPage from './js/pages/InvoicesPage'
import LoginPage from './js/pages/LoginPage'
import AuthAPI from './js/services/authAPI'
import RegisterPage from './js/pages/RegisterPage'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
AuthAPI.setup()

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  )
  const NavbarWithRouter = withRouter(Navbar)
  console.log(isAuthenticated)

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <HashRouter>
        <NavbarWithRouter />
        <main className='container pt-5'>
          <Switch>
            <Route path='/login' component={LoginPage} />
            <Route path='/register' component={RegisterPage} />
            <PrivateRoute path='/invoices/:id' component={InvoicePage} />
            <PrivateRoute path='/invoices' component={InvoicesPage} />
            <PrivateRoute path='/customers/:id' component={CustomerPage} />
            <PrivateRoute path='/customers' component={CustomersPage} />
            <Route path='/' component={HomePage}></Route>
          </Switch>
        </main>
      </HashRouter>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT}></ToastContainer>
    </AuthContext.Provider>
  )
}
const rootElement = document.querySelector('#app')
ReactDOM.render(<App />, rootElement)
