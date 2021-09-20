import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Card,Container,Row,Image,Col,Table,Button} from "react-bootstrap"



class Messollicitations extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        beneficiaire : null,
        nbprojet:0,
        listsollicitation:[], 
        nbsollicitation : 0 ,
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
        const beneficiaire = await this.loadContract("dev", "Don")
        var nb = await beneficiaire.methods.getnbSollicitation().call()
        this.setState({nbsollicitation:nb})
      
        var n = 0
        for (var j = 0; j<nb; j++){
            const account = await beneficiaire.methods.getaccount_soli(j).call()
            if(account == accounts[0]){
                const ti = await beneficiaire.methods.gettitre_soli(j).call()
                const desc = await beneficiaire.methods.getdescription_soli(j).call()
                const st = await beneficiaire.methods.getstatus_soli(j).call()
                const i1 = await beneficiaire.methods.getimage1_soli(j).call()
                const i2 = await beneficiaire.methods.getimage2_soli(j).call()
                const i3 = await beneficiaire.methods.getimage3_soli(j).call()
                const i4 = await beneficiaire.methods.getimage4_soli(j).call()
                const montantsolli = await beneficiaire.methods.getmontant_soli(j).call()
                console.log(i1)
                console.log(i2)
                console.log(i3)
                console.log(i4)
                const listc = [{
                    titre : ti,
                    description : desc,
                    status : st,
                    image1 : i1,
                    image2 : i2,
                    image3 : i3,
                    image4 : i4,
                    montantsollicitation : montantsolli
                }]
                this.setState({
                    listsollicitation:[...this.state.listsollicitation,listc] 
                })
            }
        }
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const beneficiaire = await this.loadContract("dev", "Don")

        if (!beneficiaire) {
            return
        }
        this.setState({
            beneficiaire
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

    ajouter = async event => {
        this.props.history.push("/Ajoutersollicitation");
      }
    render() {
    
        const {
            web3, accounts, chainid,beneficiaire
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!beneficiaire) {
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
        
            <Container>
            <Row>
                <Col xs={12} md={8}>
                </Col>
                <Col xs={6} md={4}>
                    <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={this.ajouter} variant="dark">Ajouter une sollicitation</Button></center>
                </Col>
            </Row>
            </Container>
            <h3 class ='h3style'>Mes Sollicitations </h3>
            <br/>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>Image_1</th>
                    <th>Image_2</th>
                    <th>Image_3</th>
                    <th>Image_4</th>
                    <th>Status</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>montant</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.listsollicitation.map((list) =>
                    <tr>
                        <td><Card.Img className="photo" src={`https://ipfs.infura.io/ipfs/${list[0].image1}`}/></td>
                        <td><Card.Img className="photo"  variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].image2}`}/></td>
                        <td><Card.Img className="photo"  variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].image3}`}/></td>
                        <td><Card.Img  className="photo" variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].image4}`}/></td>
                        <td>{list[0].status}</td>
                        <td>{list[0].titre}</td>
                        <td>{list[0].description}</td>
                        <td>{list[0].montantsollicitation}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
        </div>)
    }
}

export default Messollicitations
