import React, {Component,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,ListGroup} from 'react-bootstrap';

import Slider from "./components/Slider";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBRipple } from 'mdb-react-ui-kit';

class Home extends Component {
  state = {
    web3: null,
    accounts: null,
    chainid: null,
    fonds : null,
    nbprojet:0,
    listsollicitation:[],
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
            const status = await beneficiaire.methods.getstatus_soli(j).call()
            if(status == "Activer"){
              const ti = await beneficiaire.methods.gettitre_soli(j).call()
              const i1 = await beneficiaire.methods.getimage1_soli(j).call()
              const listc = [{
                  num : j,
                  titre : ti,
                  image1 : i1
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
  const fonds = await this.loadContract("dev", "Organisation")

  if (!fonds) {
      return
  }
  this.setState({
      fonds
  })
}
moredetails = (titre) => {
  localStorage.setItem('titre', titre);
  this.props.history.push("/detailsollicitation"); 
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
        <Slider />
        <Container>
          <Row>
          {this.state.listsollicitation.map((list) =>
          <Col md={4}>
            <MDBCard style={{ maxWidth: '22rem' }}>
              <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                <MDBCardImage className="image" src={`https://ipfs.infura.io/ipfs/${list[0].image1}`} position='top' alt='...' />
              </MDBRipple>
              <MDBCardBody>
                <MDBCardTitle></MDBCardTitle>
                <MDBCardText>
                <p><b>{list[0].titre}</b></p>
                </MDBCardText>
                <MDBBtn className = "classbtn" onClick={() => this.moredetails(list[0].titre)} >Plus de detail</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </Col>
            )}
          </Row>
          </Container>
           </>
       )
    }
}

export default Home
