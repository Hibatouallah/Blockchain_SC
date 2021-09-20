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

class Ajoutersollicitation extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        beneficiaire : null,
        cin : "",
        titre : "",
        description : "",
        bufferimage1 : null,
        bufferimage2 : null,
        bufferimage3 : null,
        bufferimage4 : null,
        image1 : null,
        image2 : null,
        image3 : null,
        image4 : null
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
        const beneficiaire = await this.loadContract("dev", "Organisation")

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

    ajoutersollicitation = async (e) => {
        const {accounts,beneficiaire,titre,description,montant} = this.state
        e.preventDefault()
        /* Image 1 */
        if (this.state.bufferimage1){
          const file = await ipfs.add(this.state.bufferimage1)
          this.state.image1 = file[0]["hash"]
          console.log(this.state.image1)
        }
        /* Image 2 */
        if (this.state.bufferimage2){
            const file = await ipfs.add(this.state.bufferimage2)
            this.state.image2 = file[0]["hash"]
            console.log(this.state.image2)
        }
        /* Image 3 */
        if (this.state.bufferimage3){
            const file = await ipfs.add(this.state.bufferimage3)
            this.state.image3 = file[0]["hash"]
            console.log(this.state.image3)
        }
        /* Image 4 */
        if (this.state.bufferimage4){
            const file = await ipfs.add(this.state.bufferimage4)
            this.state.image4 = file[0]["hash"]
            console.log(this.state.image4)
        }
        var nb =  await beneficiaire.methods.getnbBeneficiaireinfos().call()
        console.log(nb)
        for (var i=0; i < nb; i++) {
          const wallet = await beneficiaire.methods.getaccount(i).call()
          console.log(wallet)
          if(wallet == accounts[0])
          {
            const ci = await beneficiaire.methods.getcin(i).call()
            console.log("ok")
            this.setState({
                cin : ci
            })
          }
        }
        var _cin = this.state.cin
        var _titre = titre
        var _description = description
        var _montant = montant
        var _image1 = this.state.image1
        var _image2 = this.state.image2
        var _image3 = this.state.image3
        var _image4 = this.state.image4
        console.log(_cin)
        console.log(_titre)
        console.log(_description)
        console.log(accounts[0])
        console.log(_image1)
        console.log(_image2)
        console.log(_image3)
        console.log(_image4)

        const beneficiaire1 = await this.loadContract("dev", "Don")
        var result = await beneficiaire1.methods.ajouterSollicitation('desactiver',_montant,_cin,accounts[0],_titre,_description,_image1,_image2,_image3,_image4).send({from: accounts[0]})
        var _message = "Veuillez confirmer la sollicitation du benficiaire avec le cin "+_cin
        var result1 = await beneficiaire.methods.ajouternotification_Organisation(_message).send({from: accounts[0]})
        alert("Attendez la confirmation Sollicitation ajouté")
        this.props.history.push("/Messollicitations");
        
    }
    
    onChangeHandlerimage1=event=>{
        event.preventDefault()
        //Process file for IPFS ....
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({bufferimage1: Buffer.from(reader.result)})
        } 
    }

    onChangeHandlerimage2=event=>{
        event.preventDefault()
        //Process file for IPFS ....
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({bufferimage2: Buffer.from(reader.result)})
        } 
    }

    onChangeHandlerimage3=event=>{
        event.preventDefault()
        //Process file for IPFS ....
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({bufferimage3: Buffer.from(reader.result)})
        } 
    }

    onChangeHandlerimage4=event=>{
        event.preventDefault()
        //Process file for IPFS ....
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({bufferimage4: Buffer.from(reader.result)})
        } 
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
      return (
        <div className="container">
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
           
          <div className="container">
            <form enctype ="multipart/form-data" onSubmit={(e) => this.ajoutersollicitation(e)}>
            <h3>Ajouter sollicitation:</h3>
            <FormGroup as={Col} controlId="titre" bsSize="large">
              <FormLabel>Titre</FormLabel>
              <FormControl
                value={this.state.titre}
                onChange={(e) => this.setState({titre: e.target.value})}
                type="text"
              />
            </FormGroup>

            <FormGroup as={Col} controlId="description" bsSize="large">
              <FormLabel>Description</FormLabel>
              <FormControl
                value={this.state.description}
                as="textarea" 
                rows={2}
                onChange={(e) => this.setState({description: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="montant" bsSize="large">
              <FormLabel>Somme Souhaité</FormLabel>
              <FormControl
                value={this.state.montant}
                onChange={(e) => this.setState({montant: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup controlId="image1" bsSize="large">
              <FormLabel>Image 1</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerimage1}
              />
              </FormGroup>
              <FormGroup controlId="image1" bsSize="large">
              <FormLabel>Image 2</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerimage2}
              />
              </FormGroup>
              <FormGroup controlId="image3" bsSize="large">
              <FormLabel>Image 3</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerimage3}
              />
              </FormGroup>
              <FormGroup controlId="image4" bsSize="large">
              <FormLabel>Image 4</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerimage4}
              />
              </FormGroup>
              <LoaderButton
              block
              bsSize="large"
              type="submit"
              isLoading={this.state.isLoading}
              text="Ajouter"
              className ="classbtn"
              />
              <br/>
              </form>
          </div>
        </div>);
    }
}

export default Ajoutersollicitation
