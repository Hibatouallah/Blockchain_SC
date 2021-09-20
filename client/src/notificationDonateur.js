import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table,Image,Button} from "react-bootstrap"
import deletenotifi from './img/deletenotifi.png'

class notificationDonateur extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        donateur : null,
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
        const donateur = await this.loadContract("dev", "Organisation")
        var nb =  await donateur.methods.getnbnotification().call()
        this.setState({nbnotification:nb})
       
        for (var i=0; i < nb; i++) {
            const stat = await donateur.methods.getstatusnotfication(i).call()
            if(stat == "Disponible"){
                const msg = await donateur.methods.getmessage(i).call()
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
        const donateur = await this.loadContract("dev", "Organisation")
        console.log(numnotification)
        var result = await donateur.methods.modifiernotification_Donateur(numnotification).send({from: accounts[0]})
        this.props.history.push("/notificationDonateur");
           
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
            <Container>
            <Row>
                <Col xs={12} md={8}>
                </Col>
                <Col xs={6} md={4}>
                   </Col>
            </Row>
            </Container>
         
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
            
        </div>)
    }
}

export default notificationDonateur
