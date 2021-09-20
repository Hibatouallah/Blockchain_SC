import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Card,Container,Row,Image,Col,Table,Button} from "react-bootstrap"


class Mesdons extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        donateur : null,
        nbprojet:0,
        listdons:[], 
        nbdon : 0 ,
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
        const donateur = await this.loadContract("dev", "Don")
        const donateur1 = await this.loadContract("dev", "Organisation")
        var nb = await donateur1.methods.getnbDonateur().call()
        this.setState({nbdon:nb})
      
        var n = 0
        for (var j = 0; j<nb; j++){
            const account = await donateur.methods.getaccountdonateur_don(j).call()
            if(account == accounts[0]){
                const accountbenf = await donateur.methods.getaccountbeneficiare_don(j).call()
                const datetransa = await donateur.methods.getdatetransaction(j).call()
                const titresollicitatio = await donateur.methods.gettitresollicitation_don(j).call()
                const montantdo = await donateur.methods.getmontantdon(j).call()
                const listc = [{
                    accountbenf : accountbenf,
                    date : datetransa,
                    titresollicitation :titresollicitatio,
                    montantdon : montantdo
                }]
                this.setState({
                    listdons:[...this.state.listdons,listc] 
                })
            }
        }
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

    handleChange = async ()=>{
        this.props.history.push("/Fairedon")
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
        
            <h3 class ='h3style'>Mes Dons </h3>
            <br/>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>Titre</th>
                    <th>Account_beneficiaire</th>
                    <th>Date_transaction</th>
                    <th>Montant _transaction</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.listdons.map((list) =>
                    <tr>
                        <td>{list[0].titresollicitation}</td>
                        <td>{list[0].accountbenf}</td>
                        <td>{list[0].date}</td>
                        <td>{list[0].montantdon} DH</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            <br/><br/><br/><br/>
        </div>)
    }
}

export default Mesdons
