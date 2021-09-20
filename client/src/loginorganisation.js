import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"

import LoaderButton from "./containers/LoaderButton";
import { FormGroup, FormControl, FormLabel  } from "react-bootstrap";
import "./containers/Login.css";


class loginorganisation extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        organisation : null,
        email: "",
        password: "",
        isLoading: false
    }

    componentDidMount = async () => {

        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            ethereum.enable()
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts()

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())

        this.setState({
            web3,
            accounts,
            chainid
        }, await this.loadInitialContracts)
        


    }
    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
      }
    
      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
    
     
    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const organisation = await this.loadContract("dev", "Organisation")

        if (!organisation) {
            return
        }
        this.setState({
            organisation
        })
    }
 
    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const {web3} = this.state

        // Get the address of the most recent deployment from the deployment map
        let address
        try {
            address = map[chain][contractName][0]
        } catch (e) {
            console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
            return undefined
        }

        // Load the artifact with the specified address
        let contractArtifact
        try {
            contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        return new web3.eth.Contract(contractArtifact.abi, address)
    }
   
    Authentification = async (e,req) => {
        const {accounts,organisation,email,password} = this.state
        e.preventDefault()
       
        var _email = email
        var _password = password
       
        if (_email === " ") {
            alert("invalid email"+_email)
            return
        }
        if (_password === " ") {
            alert("invalid password")
            return
        }
       
        var result = await organisation.methods.LoginOrganisation(_email, _password,accounts[0]).call()
    
        if(result == "welcome"){
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('isorganisation', 'true');
            this.props.history.push("/");
        }
        else {
            alert ("invalide email ou mot de passe")
            this.setState({ isLoading: false });
        }
        
    }
  

    render() {
        const {
            web3, accounts, chainid,organisation
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!organisation) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false

        return (<div className="container">
          
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
            
            <br/>
        <div className="Login">
        
            <form onSubmit={(e) => this.Authentification(e)}>
            <h3>S'Authentifier </h3>
            <FormGroup controlId="email" bsSize="large">
                <FormLabel >Email</FormLabel >
                <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                onChange={(e) => this.setState({email: e.target.value})}
                />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
                <FormLabel >Password</FormLabel >
                <FormControl
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}
                type="password"
                />
            </FormGroup>
            <LoaderButton
                block
                bsSize="large"
                type="submit"
                isLoading={this.state.isLoading}
                text="Login"
                className ="classbtn"
                />
        </form>
                
        </div>
    </div>
  
);
    }
}

export default loginorganisation
