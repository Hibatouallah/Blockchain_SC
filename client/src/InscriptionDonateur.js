import React, { Component } from "react";
import {
  Form,
  Col,
  FormGroup,
  FormControl,
  FormLabel
} from "react-bootstrap";
import LoaderButton from "./containers/LoaderButton";
import "./containers/Signup.css";

import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import axios from 'axios';

const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class InscriptionDonateur extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isLoading: false,
          passwordconfirmation: "",
          confirmationCode: "",
          newUser: null,
          buffer : null,
          web3: null,
          accounts: null,
          chainid: null,
          organisation : null, 
          photo : null,
          cin: null,
          nom : null,
          dt : null,
          prenom : null,
          email: null,
          password : null,
          tel : null,
          addresse : null,
          status : null
        };
      }

    validateForm() {
        return (
          this.state.photo.length > 0 &&
          this.state.cin.length > 0 &&
          this.state.dt.length > 0 &&
          this.state.nom.length > 0 &&
          this.state.prenom.length > 0 &&
          this.state.email.length > 0 &&
          this.state.tel.length > 0 &&
          this.state.addresse.length > 0 &&
          this.state.password === this.state.passwordconfirmation
        );
      }
      validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
      }
      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
      handleSubmit = async event => {
        event.preventDefault();
    
        this.setState({ isLoading: true });
    
        this.setState({ newUser: "test" });
    
        this.setState({ isLoading: false });
      }
    
      handleConfirmationSubmit = async event => {
        event.preventDefault();
    
        this.setState({ isLoading: true });
      }
      handleOnChangetel = value => {
        console.log(value);
        this.setState({ tel: value }, () => {
          console.log(this.state.tel);
        });
      };
      renderConfirmationForm() {
        return (
          <form onSubmit={this.handleConfirmationSubmit}>
            <FormGroup controlId="confirmationCode" bsSize="large">
              <FormLabel>Confirmation Code</FormLabel>
              <FormControl
                autoFocus
                type="tel"
                value={this.state.confirmationCode}
                onChange={this.handleChange}
              />
              <p>Please check your email for the code.</p>
            </FormGroup>
            <LoaderButton
              block
              bsSize="large"
              disabled={!this.validateConfirmationForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Verify"
              loadingText="Verifying…"
            />
          </form>
        );
      }
      onChangeHandlerimage= (event)=>{
        event.preventDefault()
          //Process file for IPFS ....
          const file = event.target.files[0]
          const reader = new window.FileReader()
          reader.readAsArrayBuffer(file)
          reader.onloadend = () => {
              this.setState({buffer : Buffer.from(reader.result)})
          }
      }
    
      renderForm() {
        return (
            <form onSubmit={(e) => this.Inscriptionbeneficiaire(e)}>
              
          <Form.Row>
            <FormGroup as={Col}  controlId="cin" bsSize="large">
              <FormLabel>Votre Cin</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value={this.state.cin}
                onChange={(e) => this.setState({cin: e.target.value})}
              
              />
            </FormGroup>
            <FormGroup as={Col}  controlId="nom" bsSize="large">
              <FormLabel>Votre Nom</FormLabel>
              <FormControl
                value={this.state.nom}
                onChange={(e) => this.setState({nom: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col}  controlId="prenom" bsSize="large">
              <FormLabel>Votre prenom</FormLabel>
              <FormControl
                value={this.state.prenom}
                onChange={(e) => this.setState({prenom: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col}  controlId="dt" bsSize="large">
              <FormLabel>Votre date de naissance</FormLabel>
              <FormControl
                value={this.state.dt}
                onChange={(e) => this.setState({dt: e.target.value})}
                type="date"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="photo" bsSize="large">
              <FormLabel>Image principale</FormLabel>
              <FormControl
                autoFocus
                type="file"
                name="photo"
                onChange={this.onChangeHandlerimage}
              />
            </FormGroup>
            <FormGroup as={Col}  controlId="tel" bsSize="large">
              <FormLabel>Votre Numero de telephone</FormLabel>
              <ReactPhoneInput
                inputExtraProps={{
                    name: "tel",
                    required: true,
                    autoFocus: true
                }}
                defaultCountry={"mor"}
                value={this.state.tel}
                onChange={this.handleOnChangetel}
                />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col}  controlId="addresse" bsSize="large">
              <FormLabel>Votre Adresse</FormLabel>
              <FormControl
                value={this.state.addresse}
                onChange={(e) => this.setState({addresse: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="email" bsSize="large">
              <FormLabel>Votre email</FormLabel>
              <FormControl
                value={this.state.email}
                onChange={(e) => this.setState({email: e.target.value})}
                type="email"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col}  controlId="password" bsSize="large">
            <FormLabel>votre Mot de passe</FormLabel>
            <FormControl
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}
                type="password"
            />
            </FormGroup>
            <FormGroup as={Col}  controlId="passwordconfirmation" bsSize="large">
            <FormLabel>Mot de passe confirmation</FormLabel>
            <FormControl
                value={this.state.passwordconfirmation}
                onChange={(e) => this.setState({passwordconfirmation: e.target.value})}
                type="password"
            />
            </FormGroup>
            </Form.Row>
            
            <LoaderButton
              block
              bsSize="large"
              type="submit"
              isLoading={this.state.isLoading}
              text="S'inscrire"
              className ="classbtn"
            />
          </form>
        );
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

    Inscriptionbeneficiaire = async (e) => {
        const {accounts,organisation,photo,cin,nom,dt,prenom,tel,addresse,email,password} = this.state
       
        e.preventDefault()
        console.log("Submitting File .....")
        if (this.state.buffer){
            const file = await ipfs.add(this.state.buffer)
            this.state.photo = file[0]["hash"]
            console.log(this.state.photo)
          
        }
        var _photo = this.state.photo
        var _nom = nom
        var _cin = cin
        var _dt = dt
        var _prenom = prenom
        var _tel = tel
        var _addresse = addresse
        var _email = email
        var _password = password
        var nbdonateur = await organisation.methods.getnbDonateur().call()
        console.log(_photo)
        console.log(_nom)
        console.log(_cin)
        console.log(_dt)
        console.log(_prenom)
        console.log(_tel)
        console.log(_addresse)
        console.log(_email)
        console.log(_password)
        console.log(nbdonateur)
        console.log(accounts[0])
        if(nbdonateur == 0){
          var result = await organisation.methods.InscriptionDonateur(_dt,_photo,_cin,_nom,accounts[0],_prenom,_email,_password,_tel, _addresse).send({from: accounts[0]})
          var _message = "Veuillez activer le compte du donateur avec le cin "+_cin
          var result1 = await organisation.methods.ajouternotification_Organisation(_message).send({from: accounts[0]})
          alert("veuillez attender la confirmation du compte par l'administrateur")
          this.props.history.push("/Logindonateur");
        }
        else{
          for(var i = 0;i<nbdonateur;i++){
            var wallet = await organisation.methods.getaccount_donateur(i).call()
            if(wallet == accounts[0])
              {
                alert('Compte déja existe')
                this.props.history.push("/Logindonateur");
              }
              else{
                var result = await organisation.methods.InscriptionDonateur(_dt,_photo,_cin,_nom,accounts[0],_prenom,_email,_password,_tel, _addresse).send({from: accounts[0]})
                var _message = "Veuillez activer le compte du donateur avec le cin "+_cin
                var result1 = await organisation.methods.ajouternotification_Organisation(_message).send({from: accounts[0]})      
                alert("veuillez attender la confirmation du compte par l'administrateur")
                this.props.history.push("/Logindonateur"); 
              }
          }
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
            
              <div className="slContainer">
                  <div className ="formBoxLeftSignupdono"></div>
                  <div className="formBoxRight">
                    <div className = "formContent">
                    <h3>S'inscrire</h3>
                      {
                          !isAccountsUnlocked ?
                              <p><strong>Connect with Metamask and refresh the page to
                                  be able to edit the storage fields.</strong>
                              </p>
                              : null
                      }
                  
                          {this.state.newUser === null
                          ? this.renderForm()
                          : this.renderConfirmationForm()}
                  </div>
              </div>
          </div>
        </div>)
    }
}

export default InscriptionDonateur
