import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";
import {Image} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import React, { Component, Fragment} from "react";
import {getWeb3} from "./getWeb3"
import {getEthereum} from "./getEthereum"
import notification from './img/notification.png'
import map from "./artifacts/deployments/map.json"
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

class App extends Component {
    
    state = {
        isAuthenticated: false,
        isAuthenticating: true,
        web3: null,
        accounts: null,
        organisation : null,
        chainid: null,
        nouser : true,
        nbnotificationorganisation : 0,
        nbnotificationbeneficiaire : 0,
        nbnotificationdonateur : 0
    };
    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: true });
    }
    handleLogout = async event => {
      localStorage.clear();
      localStorage.setItem('nouser',true);
      alert('vous avez déconnecté ');
      this.props.history.push("/");
    }
    handlenotification_organisation = async event =>{
      this.props.history.push("/notificationOrganisation");
    }
    handlenotification_donateur = async event =>{
      this.props.history.push("/notificationDonateur");
    }
    handlenotification_beneficiaire = async event =>{
      this.props.history.push("/notificationBeneficiaire");
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
        this.setState({ isAuthenticating: false });
        const organisation = await this.loadContract("dev", "Organisation")
        // Organisation
        var nb1 =  await organisation.methods.getnbnotification_organisation().call()
        this.setState({nbnotificationorganisation:nb1})
        localStorage.setItem('nbnotificationorganisation',this.state.nbnotificationorganisation)
        // Donateur
        var nb2 =  await organisation.methods.getnbnotification_donateur().call()
        this.setState({nbnotificationdonateur:nb1})
        localStorage.setItem('nbnotificationdonateur',this.state.nbnotificationdonateur)
        // Beneficiaire
        var nb3 =  await organisation.methods.getnbnotification_beneficiaire().call()
        this.setState({nbnotificationbeneficiaire:nb1})
        localStorage.setItem('nbnotificationbeneficiaire',this.state.nbnotificationbeneficiaire)
      
    }

    render() {
        const REACT_VERSION = React.version;

        const childProps = {
            isAuthenticatedPromo: this.state.isAuthenticatedPromo,
            userHasAuthenticated: this.userHasAuthenticated
          };

        return (
            !this.state.isAuthenticating &&
    <>
        <Nav>
        <NavLink to='/'>
          <img src={require('./img/donate.png')} alt='logo' />
        </NavLink>
        <Bars />
        <NavMenu>
             {localStorage.getItem('isAuthenticated') === 'true' 
            ?<Fragment>
              {localStorage.getItem('isdonateur') === 'true' &&
                <NavLink to='/ProfileDonateur' activeStyle>
                    Profile
                </NavLink>
                }
                {localStorage.getItem('isdonateur') === 'true' &&
                <NavLink to="/Mesdons" activeStyle>
                    Mes Dons
                </NavLink>
                 }
                 {localStorage.getItem('isdonateur') === 'true' &&
                <NavLink to="/Mesenregistrements" activeStyle>
                    Mes Enregistrements
                </NavLink>
                 }
                 {localStorage.getItem('isdonateur') === 'true' &&
                 <NavLink to="/notificationDonateur" activeStyle>
                 <Image onClick={this.handlenotification_donateur} src={notification} roundedCircle />
                 <button className="badge">{localStorage.getItem('nbnotificationdonateur')}</button>
                 </NavLink>
                }
                 {localStorage.getItem('isbeneficiaire') === 'true' &&
                <NavLink to="/Messollicitations" activeStyle>
                    Mes Sollicitations
                </NavLink>
                }
                  {localStorage.getItem('isbeneficiaire') === 'true' &&
                 <NavLink to="/notificationBeneficiaire" activeStyle>
                 <Image onClick={this.handlenotification_beneficiaire} src={notification} roundedCircle />
                 <button className="badge">{localStorage.getItem('nbnotificationbeneficiaire')}</button>
                 </NavLink>
                }
                {localStorage.getItem('isorganisation') === 'true' &&
                <NavLink to="/Listebeneficiaires" activeStyle>
                     Bénefiaires
                </NavLink>
                }
                {localStorage.getItem('isorganisation') === 'true' &&
                <NavLink to='/Listedonateurs' activeStyle>
                    Donateurs
                </NavLink>
                }
                 {localStorage.getItem('isorganisation') === 'true' &&
                <NavLink to="/Listesollicitations" activeStyle>
                    Sollicitations
                </NavLink>
                }
                 {localStorage.getItem('isorganisation') === 'true' &&
                <NavLink to="/listedons" activeStyle>
                    Dons
                </NavLink>
                }
                {localStorage.getItem('isorganisation') === 'true' &&
                 <NavLink to="/notificationOrganisation" activeStyle>
                 <Image onClick={this.handlenotification_organisation} src={notification} roundedCircle />
                 <button className="badge">{localStorage.getItem('nbnotificationorganisation')}</button>
                 </NavLink>
                }
                  
                {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listecontrats" activeStyle>
                     Les Contrats
                </NavLink>
                }
                  {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listepromoteurs" activeStyle>
                     Les promoteurs
                </NavLink>
                }
                  {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listeclients" activeStyle>
                     Les clients
                </NavLink>
                }
                <NavLink onClick={this.handleLogout} activeStyle>
                    Se Déconnecter
                </NavLink>
                
          </Fragment>
          :<Fragment>
                <NavLink to='/Inscription' activeStyle>
                S'inscrire
                </NavLink>
                <NavLink to='/Login' activeStyle>
                     Se connecter
                </NavLink> 
          </Fragment>
          }
           { this.state.accounts  == "0xdb49fb381F46b3A6078Fec43f0F5A0695a6C715E" &&
                  <NavLink to='/listeprojets' activeStyle>
                    Mes Projets
                  </NavLink>
            }
        </NavMenu>
      </Nav>
      <Routes childProps={childProps} />
    <MDBFooter className="footerbg">
      <MDBContainer fluid className="text-center text-md-left">
          <br/>
        <MDBRow>
          <MDBCol md="6">
            <h5 className="title">CryptoDonation</h5>
            <p className="title">
              Here you can use rows and columns here to organize your footer
              content.
            </p>
          </MDBCol>
          <MDBCol md="6">
            <h5 className="title">Links</h5>
            <ul>
              <li className="list-unstyled title">
                <a href="#!">Link 1</a>
              </li>
              <li className="list-unstyled title">
                <a href="#!">Link 2</a>
              </li>
              <li className="list-unstyled title">
                <a href="#!">Link 3</a>
              </li>
              <li className="list-unstyled title">
                <a href="#!">Link 4</a>
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer className="title" fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="https://www.mdbootstrap.com"> CryptoDonation</a>
        </MDBContainer>
      </div>
    </MDBFooter>
    </>
  );
    }
}

export default withRouter(App);