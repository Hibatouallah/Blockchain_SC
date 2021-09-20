import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Card,Container,Row,Button,Col,Table} from "react-bootstrap"
import { makeStyles } from '@material-ui/core/styles';


class Listesollicitations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            accounts: null,
            chainid: null,
            donateur : null,
            nbprojet:0,
            listsollicitations:[]
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
        const organisation = await this.loadContract("dev", "Don")
        var nb = await organisation.methods.getnbSollicitation().call()      
        for (var j = 0; j<nb; j++){
            const ci = await organisation.methods.getcin_soli(j).call()
            const acc = await organisation.methods.getaccount_soli(j).call()
            const ti = await organisation.methods.gettitre_soli(j).call()
            const desc = await organisation.methods.getdescription_soli(j).call()
            const st = await organisation.methods.getstatus_soli(j).call()
            const i1 = await organisation.methods.getimage1_soli(j).call()
            const i2 = await organisation.methods.getimage2_soli(j).call()
            const i3 = await organisation.methods.getimage3_soli(j).call()
            const i4 = await organisation.methods.getimage4_soli(j).call()
            const montantsolli = await organisation.methods.getmontant_soli(j).call()
            const s = await organisation.methods.getsomme_don(j).call()
            const listc = [{
                cin : ci,
                account: acc,
                titre : ti,
                description : desc,
                status : st,
                image1 : i1,
                image2: i2,
                image3 : i3,
                image4 : i4,
                montantsollicitation : montantsolli,
                somme : s
            }]
            this.setState({
                listsollicitations:[...this.state.listsollicitations,listc] 
            })
            
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

    activer = async (titresollic) => {
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
        const beneficiaire1 = await this.loadContract("dev", "Organisation")
        var nb = await beneficiaire.methods.getnbSollicitation().call()
        for (var j = 0; j<nb; j++){
            const titre = await beneficiaire.methods.gettitre_soli(j).call()
            if(titre == titresollic){
                var account = await beneficiaire.methods.getaccount_soli(j).call()
                var result = await beneficiaire.methods.ActiverSollicitation(j).send({from: accounts[0]})
                var _message = "Félicitation , votre sollicitation avec le titre "+titre+" est activé "
                var result1 = await beneficiaire1.methods.ajouternotification_Beneficiaire(account,_message).send({from: accounts[0]})      
                alert("Sollicitation activée")
                this.props.history.push("/Listesollicitations");
            }
        }
    }
    desactiver = async (titresollic) => {
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
        var n = 0
        for (var j = 0; j<nb; j++){
            const titre = await beneficiaire.methods.gettitre_soli(j).call()
            if(titre == titresollic){
                var result = await beneficiaire.methods.DesactiverSollicitation(j).send({from: accounts[0]})
                alert("Sollicitation desactivé")
                this.props.history.push("/Listesollicitations");
            }
        }
    }
    ajouter = async event => {
        this.props.history.push("/Ajoutersollicitation_organisation");
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
            <Container>
            <Row>
                <Col xs={12} md={8}>
                </Col>
                <Col xs={6} md={4}>
                    <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="dark" onClick={this.ajouter}>Ajouter une sollicitation</Button></center>
                </Col>
            </Row>
            </Container>
            <h3 class ='h3style'>Les Sollicitations </h3>
            <br/>
            <Table responsive >
   
                <thead class="thead-dark">
                    <tr>
                    <th>somme</th>
                    <th>Action</th>
                    <th>Cin</th>
                    <th>Account</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Image_1</th>
                    <th>Image_2</th>
                    <th>Image_3</th>
                    <th>Image_4</th>
                    <th>Status</th>
                    <th>montant</th>
                    
                    </tr>
                </thead>
                <tbody>
                {this.state.listsollicitations.map((list) =>
                    <tr>
                        <td>{list[0].somme}</td>
                        <td>
                        {list[0].status === 'Desactiver' &&
                             <Button variant="outlined" onClick={() => this.activer(list[0].titre)} color="primary">
                             Activer
                           </Button>
                       }
                          {list[0].status === 'Activer' &&
                             <Button variant="outlined" onClick={(e) => this.desactiver(list[0].titre)} color="primary">
                             Desactiver
                           </Button>
                       }
                        </td>
                        <td>{list[0].cin}</td>
                        <td>{list[0].account}</td>
                        <td>{list[0].titre}</td>
                        <td>{list[0].description}</td>
                        <td><Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].image1}`}/></td>
                        <td><Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].image2}`}/></td>
                        <td><Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].image3}`}/></td>
                        <td><Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].image4}`}/></td>
                        <td>{list[0].status}</td>
                        <td>{list[0].montantsollicitation}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            <br/><br/><br/><br/>
        </div>)
    }
}

export default Listesollicitations
