import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import donoricon from './img/donor.png';
import benefiicon from './img/help.png';


class Inscription extends Component {

    handledonateur = async event => {
        localStorage.setItem('userdonateur', 'true');
        localStorage.setItem('nouser',false);
        this.props.history.push("/InscriptionDonateur");
      }
    handlebeneficiaire = async event => {
        localStorage.setItem('userbenefi', 'true');
        localStorage.setItem('nouser',false);
        this.props.history.push("/Inscriptionbeneficiaire");
      }
    render() {
        

        return (
            <center>
            <div className="Login">
                
          <Container>
          
            <Row className="justify-content-md-center">
                <Col xs lg="2">
                    <Image onClick={this.handledonateur} src={donoricon} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Donateur</h3>
                </Col>
                <Col xs lg="2"></Col>
                <Col xs lg="2">
                    <Image onClick={this.handlebeneficiaire}src={benefiicon} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bénéficiaire</h3>
                </Col>
                
            </Row>
        </Container>
        </div>
        </center>
       )
    }
}

export default Inscription
