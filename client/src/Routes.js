import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import NotFound from "./containers/NotFound";
import Home from "./Home.js"
import Inscription from "./Inscription"
import Login from "./Login"
import Inscriptionbeneficiaire from "./Inscriptionbeneficiaire"
import InscriptionDonateur from "./InscriptionDonateur"
import Loginbeneficiaire from "./Loginbeneficiaire"
import Logindonateur from "./Logindonateur"
import ProfileDonateur from "./ProfileDonateur"
import Messollicitations from "./Messollicitations"
import Ajoutersollicitation from "./Ajoutersollicitation"
import detailsollicitation from "./detailsollicitation"
import Mesenregistrements from "./Mesenregistrements"
import Fairedon from "./Fairedon"
import Mesdons from "./Mesdons"
import loginorganisation from "./loginorganisation"
import Listebeneficiaires from "./Listebeneficiaires"
import Listedonateurs from "./Listedonateurs"
import Listesollicitations from "./Listesollicitations"
import listedons from "./listedons"
import notificationDonateur from "./notificationDonateur"
import notificationOrganisation from "./notificationOrganisation"
import notificationBeneficiaire from "./notificationBeneficiaire"
import Ajoutersollicitation_organisation from "./Ajoutersollicitation_organisation"
export default ({ childProps }) =>
  <Switch>
    { /* routes */ }
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/Inscription" exact component={Inscription} props={childProps} />
    <AppliedRoute path="/Login" exact component={Login} props={childProps} />
    
    { /* Donateur */ }
    <AppliedRoute path="/InscriptionDonateur" exact component={InscriptionDonateur} props={childProps} />
    <AppliedRoute path="/Logindonateur" exact component={Logindonateur} props={childProps} />
    <AppliedRoute path="/ProfileDonateur" exact component={ProfileDonateur} props={childProps} />
    <AppliedRoute path="/listedons" exact component={listedons} props={childProps} />
    <AppliedRoute path="/Mesenregistrements" exact component={Mesenregistrements} props={childProps} />
    <AppliedRoute path="/Fairedon" exact component={Fairedon} props={childProps} />
    <AppliedRoute path="/Mesdons" exact component={Mesdons} props={childProps} />
    <AppliedRoute path="/notificationDonateur" exact component={notificationDonateur} props={childProps} />
    
    { /* Beneficiaire */ }
    <AppliedRoute path="/Inscriptionbeneficiaire" exact component={Inscriptionbeneficiaire} props={childProps} />
    <AppliedRoute path="/Loginbeneficiaire" exact component={Loginbeneficiaire} props={childProps} />
    <AppliedRoute path="/Messollicitations" exact component={Messollicitations} props={childProps} />
    <AppliedRoute path="/Ajoutersollicitation" exact component={Ajoutersollicitation} props={childProps} />
    <AppliedRoute path="/detailsollicitation" exact component={detailsollicitation} props={childProps} />
    <AppliedRoute path="/notificationBeneficiaire" exact component={notificationBeneficiaire} props={childProps} />
    { /* Organisation */ }
    <AppliedRoute path="/loginorganisation" exact component={loginorganisation} props={childProps} />
    <AppliedRoute path="/Listebeneficiaires" exact component={Listebeneficiaires} props={childProps} />
    <AppliedRoute path="/Listedonateurs" exact component={Listedonateurs} props={childProps} />
    <AppliedRoute path="/Listesollicitations" exact component={Listesollicitations} props={childProps} />
    <AppliedRoute path="/listedons" exact component={listedons} props={childProps} />
    <AppliedRoute path="/notificationOrganisation" exact component={notificationOrganisation} props={childProps} />
    <AppliedRoute path="/Ajoutersollicitation_organisation" exact component={Ajoutersollicitation_organisation} props={childProps} />
    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>