import React, {Component,memo,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import './App.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { Card, Button,Container,Row,Col} from 'react-bootstrap';

class detailsollicitation extends Component {
  state = {
    web3: null,
    accounts: null,
    chainid: null,
    organisation : null,
    cin: "", 
    description : "",
    image1 : null,
    image2 : null,
    image3 : null,
    image4: null, 
    nom: "",
    prenom :"",
    tel : "",
    addresse: "",
    titre: ""
    
}
handleChangeenregistrement = async ()=>{
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
  
  const organisation = await this.loadContract("dev","Don")

  var nb =  await organisation.methods.getnbEnregistrement().call()
  if(nb == 0){
    var resultat =  await organisation.methods.AjouterEnregistrement(accounts[0],this.state.titre).send({from: accounts[0]})
    alert("La sollicitation est enregistrée")
  }
  else{
    for(var i = 0;i<nb;i++){
      var titre1 = await organisation.methods.gettitre().call() 
      if(titre1 == this.state.titre){
        var resultat =  await organisation.methods.AjouterEnregistrement(accounts[0],this.state.titre).send({from: accounts[0]})
        alert("La sollicitation est enregistrée")
      }
    }
  }
  this.props.history.push("/Mesenregistrements");
}
handleChange = async (titre)=>{
  localStorage.setItem("titre",titre)
  this.props.history.push("/Fairedon")
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
      const organisation1 = await this.loadContract("dev", "Organisation")
      var nb =  await organisation.methods.getnbSollicitation().call()
      var nbl =  await organisation1.methods.getnbBeneficiaireinfos().call()

      for (var i=0; i < nb; i++) {
        const titre = await organisation.methods.gettitre_soli(i).call()
        if(titre == localStorage.getItem('titre'))
        {
            const ci = await organisation.methods.getcin_soli(i).call()
            const desc = await organisation.methods.getdescription_soli(i).call()
            const img1 = await organisation.methods.getimage1_soli(i).call()
            const img2 = await organisation.methods.getimage2_soli(i).call()
            const img3 = await organisation.methods.getimage3_soli(i).call()
            const img4 = await organisation.methods.getimage4_soli(i).call()
            const m = await organisation.methods.getmontant_soli(i).call()
            for(var j = 0;j<nbl; j++){
                const cin = await organisation1.methods.getcin(j).call()
                if(ci == cin)
                {
                  const nm = await organisation1.methods.getnom(j).call()
                  const pr = await organisation1.methods.getprenom(j).call()
                  const t = await organisation1.methods.gettel(j).call()
                  const ad = await organisation1.methods.getaddresse(j).call()
            
                  this.setState({
                    cin: ci, 
                    description : desc,
                    image1 : img1,
                    image2 : img2,
                    image3 : img3,
                    image4: img4, 
                    nom: nm,
                    prenom :pr,
                    tel : t,
                    addresse: ad,
                    titre: titre,
                    montant : m
                  })

                }
            }
            
        }
      }  
}

loadInitialContracts = async () => {
  if (this.state.chainid <= 42) {
      // Wrong Network!
      return
  }
  const organisation = await this.loadContract("dev", "Don")

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


    render() {   

        return ( 
          <>
          <br/><br/>
              <center>
                <AwesomeSlider className="slider" >
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.image1}`}/>
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.image2}`}/>
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.image3}`}/>
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.image4}`}/>
                </AwesomeSlider>
                </center>
                  <Card>
                     <Card.Body className="detailscard">
                      <Card.Title className="classp" ><b>Titre :{this.state.titre}</b></Card.Title>
                      <Card.Text>
                      <p><b>Descriptif :</b> {this.state.description}</p>
                      <p><b>Le besoin  :</b> {this.state.montant} DH</p>
                      <center>
                      {localStorage.getItem('isdonateur') === 'true' &&
                        <Button className="classbtn" onClick={() => this.handleChangeenregistrement()}>Enregistrer</Button>
                          }
                        
                        &nbsp;&nbsp;&nbsp;{localStorage.getItem('isdonateur') === 'true' &&
                      <Button className="classbtn" onClick={() => this.handleChange(this.state.titre)}>Faire un Don </Button>
                          }
                        </center>
                      </Card.Text>
                    </Card.Body>
                  </Card> 
    <Container>
  <Row>
    <Col>
                    <Card>
                    <Card.Header className="detailscardtitle" as="h5">Informations du bénéficiaire </Card.Header>
                    <Card.Body className="detailscard">
                      <Card.Title></Card.Title>
                      <Card.Text>
                      <p class = "classp"><b>Cin :</b> {this.state.cin}</p>
                      <p class = "classp"><b>Nom  :</b> {this.state.nom}</p>
                      <p class = "classp"><b>Prénom: </b>{this.state.prenom}</p>
                      <p class = "classp"><b>Tel :</b> {this.state.tel}</p>
                      <p class = "classp"><b>Addresse:</b> {this.state.addresse}</p>

                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <br/>
                  </Col>
            </Row>
            </Container>
     </>

       )
    }
    
}

export default detailsollicitation
