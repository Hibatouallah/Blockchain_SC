import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Container,Row,Image,Col,Button} from "react-bootstrap"
import imagemodifier from './img/imagemodifier.png'; 

class ProfilecDonateur extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        donateur : null,
        nbclient:0,
        photo: null, 
        nom : "",
        cin : "",
        prenom : "",
        email: "", 
        password: "",
        tele: "",
        addresse : "",
        status : ""
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
        var nb =  await donateur.methods.getnbDonateur().call()
        this.setState({nbdonateur:nb})

        for (var i=0; i < nb; i++) {
          const wallet = await donateur.methods.getaccount_donateur(i).call()
          if(accounts[0] == wallet){
            const ph = await donateur.methods.getphoto_donateur(i).call()
            const no = await donateur.methods.getnom_donateur(i).call()
            const ci = await donateur.methods.getcin_donateur(i).call()
            const dt = await donateur.methods.getdt_donateur(i).call()
            const pre = await donateur.methods.getprenom_donateur(i).call()
            const ema = await donateur.methods.getemail_donateur(i).call()
            const pass = await donateur.methods.getpassword_donateur(i).call()
            const tel = await donateur.methods.gettel_donateur(i).call()
            const addr = await donateur.methods.getaddresse_donateur(i).call()
            const st = await donateur.methods.getstatus_donateur(i).call()
            this.setState({
                walletaddress : wallet,
                photo: ph, 
                nom : no,
                dt_naiss : dt,
                cin : ci,
                prenom : pre,
                email: ema, 
                password: pass,
                tele: tel,
                addresse : addr,
                status : st
            })
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

    modifierclientinfos = (event) =>{
        event.preventDefault()
        this.props.history.push("/Modifierclientinfos")
    }
    modifierclientimage = (event) =>{
        event.preventDefault()
        this.props.history.push("/Modifierclientimage")
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
           
            <br/>
            <Container>
                {/* Columns are always 50% wide, on mobile and desktop */}
                <Row>
                <Col xs={6} > 
                <Card border="primary" style={{ width: '30rem' }}>
                    <Card.Header>
                        <Image src={`https://ipfs.infura.io/ipfs/${this.state.photo}`} fluid roundedCircle />
                       <center>
                       <Image onClick={this.modifierclientimage} src={imagemodifier} roundedCircle />
                       Modifier votre image de profile 
                       </center>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title><center><h5><b>Informations Personnelle</b></h5></center></Card.Title>
                      <Card.Text>
                        <p><b>Nom :</b>{this.state.nom}</p>
                        <p><b>Prenom :</b>{this.state.prenom}</p>
                        <p><b>Email :</b>{this.state.email}</p>
                        <p><b>Addresse :</b>{this.state.addresse}</p>
                        <p><b>Addresse du portefeuille :</b>{this.state.walletaddress}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <br /></Col>
                  <Col xs={6} >
                  <Card border="primary" style={{ width: '30rem' }}>
                    <Card.Header><center><h5><b>Details</b></h5></center></Card.Header>
                    <Card.Body>
                      <Card.Title></Card.Title>
                      <Card.Text>
                        <p><b>Date de naissance :</b>{this.state.dt_naiss}</p>
                        <p><b>Numero de téléphone:</b>{this.state.tele}</p>
                        <p><b>Cin :</b>{this.state.cin}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <br />
                  <Button variant="dark" onClick = {this.modifierclientinfos} >Modifier Mes Informations</Button>
                  </Col>
                </Row>
            </Container>
            
        </div>)
    }
}

export default ProfilecDonateur

