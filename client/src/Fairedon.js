import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  FormLabel,
  Col,
  Form
} from "react-bootstrap";
import LoaderButton from "./containers/LoaderButton";
import "./containers/Signup.css";
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"

const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class Fairedon extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        donateur : null,
        montant:0.0
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

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const donateur = await this.loadContract("dev", "Don")

        if (!donateur) {
            return
        }
        this.setState({
            donateur
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

    fairedon = async (e) => {
        const {web3,accounts,montant,donateur} = this.state
        e.preventDefault()
        const donateur1 = await this.loadContract("dev", "Organisation")
         // transformer le montant en dollar 1 MAD ---> 0,11 dollar
        var montantdollar = montant * 0.11
        console.log(montantdollar)
        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
        var montantether = (montantdollar * 0.00031).toString()
        
        var _titresollicitation = localStorage.getItem("titre")
        var _accountdonateur = accounts[0]
        var nb =  await donateur.methods.getnbSollicitation().call()
        var _accountbeneficiare = ""
        var somme = ""
        for (var i=0 ; i < nb ; i++) {
            const titre = await donateur.methods.gettitre_soli(i).call()
            if(titre == localStorage.getItem('titre'))
            {
                _accountbeneficiare = await donateur.methods.getaccount_soli(i).call()
                somme = await donateur.methods.getsomme_don(i).call()
                
            }
        }
        var sommemontant = ''
        if(somme == ''){
            sommemontant =  montant
        }
        else{
            sommemontant = parseFloat(somme) + montant
        }
        var sommem = sommemontant.toString()
        console.log(sommem)
        
        var today = new Date(),
         _datetransaction = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var _montantdon = montant
        web3.eth.sendTransaction({from:accounts[0] ,to:_accountbeneficiare, value:web3.utils.toWei(montantether,'ether')});
        var result = await donateur.methods.ajouterDon(_titresollicitation,_accountdonateur,_accountbeneficiare,_datetransaction,_montantdon).send({from: accounts[0]})
        
        var _message = "Un don a été vercé avec un montant de "+_montantdon +" suite à votre sollicitation dans le titre est "+_titresollicitation
        var result1 = await donateur1.methods.ajouternotification_Beneficiaire(_accountbeneficiare,_message).send({from: accounts[0]})
        
        for (var j=0; j< nb; j++) {
            const titre = await donateur.methods.gettitre_soli(j).call()
            console.log(titre)
            if(titre == localStorage.getItem('titre'))
            {
                var result2 = await donateur.methods.ModifierSomme(j,sommem).send({from: accounts[0]})
                var montantsoll = await donateur.methods.getmontant_soli(j).call()
                console.log(montantsoll)
                var sommedon = await donateur.methods.getsomme_don(j).call()
                console.log(sommedon)
                if(montantsoll == sommedon || montantsoll < sommedon){
                    var result3 = await donateur.methods.DesactiverSollicitation(j).send({from: accounts[0]})
                    var _message = "La somme total  de la sollicitation : "+titre+" est reçu par le bénéficiaire "
                    var result1 = await donateur1.methods.ajouternotification_Organisation(_message).send({from: accounts[0]})      
                }
            }
        }
        
        alert("don ajouté")
        this.props.history.push("/Mesdons");
        
    }
    
   
    render() {
      const {
        web3, accounts, chainid,donateur
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }
        if (!donateur) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
      return (
        <div className="container">
        {localStorage.getItem('isdonateur') != 'true' &&
         this.props.history.push("/Logindonateur")
         }
        {
            !isAccountsUnlocked ?
                <p><strong>Connect with Metamask and refresh the page to
                    be able to edit the storage fields.</strong>
                </p>
                : null
        }
       
      <div className="Login">
        <form enctype ="multipart/form-data" onSubmit={(e) => this.fairedon(e)}>
        <h3>Faire un don:</h3>
        
        <FormGroup controlId="montant" bsSize="large">
          <FormLabel>Montant</FormLabel>
          <FormControl
            autoFocus
            type="text"
            onChange={(e) => this.setState({montant: e.target.value})}
          />
        </FormGroup>

          <LoaderButton
          block
          bsSize="large"
          type="submit"
          isLoading={this.state.isLoading}
          text="Envoyer"
          className ="classbtn"
          />
          <br/>
          </form>
      </div>
    </div>);
    }
}

export default Fairedon
