import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Card,Container,Row,Image,Col,Table} from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
class Listedonateurs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            accounts: null,
            chainid: null,
            donateur : null,
            nbprojet:0,
            listenregistrements:[], 
            nbenregistrement : 0 ,
        };
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
        const organisation = await this.loadContract("dev", "Organisation")
        var nb = await organisation.methods.getnbDonateur().call()      
        var n = 0
        for (var j = 0; j<nb; j++){
            const ph = await organisation.methods.getphoto_donateur(j).call()
            const ci = await organisation.methods.getcin_donateur(j).call()
            const nm = await organisation.methods.getnom_donateur(j).call()
            const date = await organisation.methods.getdt_donateur(j).call()
            const acc = await organisation.methods.getaccount_donateur(j).call()
            const pr = await organisation.methods.getprenom_donateur(j).call()
            const em = await organisation.methods.getemail_donateur(j).call()
            const te = await organisation.methods.gettel_donateur(j).call()
            const add = await organisation.methods.getaddresse_donateur(j).call()
            const st = await organisation.methods.getstatus_donateur(j).call()
            const listc = [{
                photo : ph,
                cin: ci,
                nom : nm,
                dt : date,
                account : acc,
                prenom : pr,
                email: em,
                tel : te,
                addresse : add,
                status : st
            }]
            this.setState({
                listenregistrements:[...this.state.listenregistrements,listc] 
            })
            
        }
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const donateur = await this.loadContract("dev", "Organisation")

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

    handleChange = async (titre)=>{
        localStorage.setItem("titre",titre)
        this.props.history.push("/Fairedon")
    }
    activer = async (accountdonateur) => {
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
        const donateur = await this.loadContract("dev", "Organisation")
        var nb = await donateur.methods.getnbDonateur().call()
        var n = 0
        for (var j = 0; j<nb; j++){
            const account = await donateur.methods.getaccount_donateur(j).call()
            if(account == accountdonateur){
                var result = await donateur.methods.Activerdonateur(j).send({from: accounts[0]})
                var _message = "Félicitation , votre compte est activé "
                var result1 = await donateur.methods.ajouternotification_Donateur(account,_message).send({from: accounts[0]})      
                alert("donateur sactivé")
                this.props.history.push("/Listedonateurs");
            }
        }
    }
    desactiver = async (accountdonateur) => {
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
         const donateur = await this.loadContract("dev", "Organisation")
        var nb = await donateur.methods.getnbDonateur().call()
        var n = 0
        for (var j = 0; j<nb; j++){
            const account = await donateur.methods.getaccountdonateur_don(j).call()
            if(account == accountdonateur){
                var result = await donateur.methods.Desactiverdonateur(j).send({from: accounts[0]})
                var _message = "Votre compte est desactivé "
                var result1 = await donateur.methods.ajouternotification_Donateur(account,_message).send({from: accounts[0]})      
                alert("donateur desactivé")
                this.props.history.push("/Listedonateurs");
            }
        }
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
     
        return (<div className="container">
           {localStorage.getItem('isorganisation') != 'true' &&
             this.props.history.push("/loginorganisation")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
        
            <h3 class ='h3style'>Les Donateurs </h3>
            <br/>
            <Table responsive >
   
                <thead class="thead-dark">
                    <tr>
                    <th>Action</th>
                    <th>Photo</th>
                    <th>Cin</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Date_naissance</th>
                    <th>Email</th>
                    <th>Account</th>
                    <th>Tel</th>
                    <th>Addresse</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.listenregistrements.map((list) =>
                    <tr>
                        <td>
                        {list[0].status === 'Desactiver' &&
                             <Button variant="outlined" onClick={() => this.activer(list[0].account)} color="primary">
                             Activer
                           </Button>
                       }
                          {list[0].status === 'Activer' &&
                             <Button variant="outlined" onClick={(e) => this.desactiver(list[0].account)} color="primary">
                             Desactiver
                           </Button>
                       }
                        </td>
                        <td><Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].photo}`}/></td>
                        <td>{list[0].cin}</td>
                        <td>{list[0].nom}</td>
                        <td>{list[0].prenom}</td>
                        <td>{list[0].dt}</td>
                        <td>{list[0].email}</td>
                        <td>{list[0].account}</td>
                        <td>{list[0].tel}</td>
                        <td>{list[0].addresse}</td>
                        <td>{list[0].status}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            <br/><br/><br/><br/>
        </div>)
    }
}

export default Listedonateurs
