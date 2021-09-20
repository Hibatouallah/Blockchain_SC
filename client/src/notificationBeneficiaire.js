import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table,Image,Button} from "react-bootstrap"
import deletenotifi from './img/deletenotifi.png'

class notificationBeneficiaire extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        organisation : null,
        nbnotification:0,
        listenotification:[] ,
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
        var nb =  await organisation.methods.getnbnotification_beneficiaire().call()
        this.setState({nbnotification:nb})
       
        for (var i=0; i < nb; i++) {
            const account = await organisation.methods.getaccountnotification_beneficiaire(i).call()
            if(account == accounts[0]){
                const stat = await organisation.methods.getstatusnotification_beneficiaire(i).call()
                if(stat == "Disponible"){
                    const msg = await organisation.methods.getmessage_beneficiaire(i).call()
                    const list =[{
                        message: msg,
                        numnotification : i,
                        status : stat
                    }]
                    this.setState({
                        listenotification:[...this.state.listenotification,list] 
                     })
                    console.log(this.state.listenotification)
                }
            }
        }
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
      handlesupp = async(numnotification) =>{
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
        console.log(numnotification)
        var result = await organisation.methods.modifiernotification_Organisation(numnotification).send({from: accounts[0]})
        this.props.history.push("/notificationOrganisation");
           
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
           {localStorage.getItem('isbeneficiaire') != 'true' &&
             this.props.history.push("/Loginbeneficiaire")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
            
           <h3 class ='h3style'>Mes notifications </h3>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>Message</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.listenotification.map((list) =>
                    <tr>
                            <td>{list[0].message}</td>
                            <td><Image onClick={() => this.handlesupp(list[0].numnotification)} src={deletenotifi} roundedCircle /></td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            <br/><br/><br/><br/> 
        </div>)
    }
}

export default notificationBeneficiaire
