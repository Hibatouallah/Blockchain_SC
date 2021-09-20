#pragma line
# @version ^0.2.0
#Contract Don

nbSollicitation : uint256
nbEnregistrement : uint256
nbDon : uint256

@external
def __init__():
    self.nbSollicitation = 0
    self.nbEnregistrement = 0
    self.nbDon = 0

#Informations sur la sollicitation
struct Sollicitation:
    cin: String[100]
    account : address
    titre : String[1000]
    description : String[90000]
    montant : String[20]
    status : String[20]
    image1 : String[200]
    image2 : String[200]
    image3 : String[200]
    image4 : String[200]
    somme_don : String[40]

struct Enregistrement:
    accountdonateur : address
    titre : String[1000]
    status : String[100]

struct Don : 
    accountdonateur : address
    accountbeneficiare : address
    datetransaction : String[50]
    titresollicitation : String[20]
    montantdon : String[50]

listeenregistrement : public(HashMap[uint256,Enregistrement])
listeDons : public(HashMap[uint256,Don])
listeSollicitation : public(HashMap[uint256,Sollicitation])

#Don
@external
def ajouterDon(_titresollicitation : String[20],_accountdonateur:address,_accountbeneficiare:address,_datetransaction : String[50],_montantdon : String[50]):
    self.listeDons[self.nbDon] = Don({
        accountdonateur : _accountdonateur,
        accountbeneficiare : _accountbeneficiare,
        datetransaction : _datetransaction,
        titresollicitation : _titresollicitation,
        montantdon : _montantdon
    })
    self.nbDon = self.nbDon + 1

#Enregistrement
@external
def AjouterEnregistrement(_accountdonateur:address,_titre:String[1000]):
    self.listeenregistrement[self.nbEnregistrement] = Enregistrement({
        accountdonateur : _accountdonateur,
        titre : _titre,
        status : "Activer"
    })
    self.nbEnregistrement = self.nbEnregistrement + 1

@external
def ModifierEnregistrement(nb : uint256):
    self.listeenregistrement[nb].status = "Desactiver"

#Sollicitation
@external
def ModifierSomme(nb : uint256,sommemontant :String[40]):
    self.listeSollicitation[nb].somme_don = sommemontant
@external
def ActiverSollicitation(nb:uint256):
    self.listeSollicitation[nb].status = "Activer"
@external
def DesactiverSollicitation(nb:uint256):
    self.listeSollicitation[nb].status = "Desactiver"

@external
def ajouterSollicitation(_status : String[20],_montant:String[20],_cin: String[100],_account : address,_titre : String[1000],_description : String[90000],_image1 : String[200],_image2 : String[200],_image3 : String[200],_image4 : String[200]):
    self.listeSollicitation[self.nbSollicitation] = Sollicitation({
        cin: _cin,
        account : _account,
        titre : _titre,
        description : _description,
        montant : _montant,
        status : _status,
        image1 : _image1,
        image2 : _image2,
        image3 : _image3,
        image4 : _image4,
        somme_don : ""
    })
    self.nbSollicitation = self.nbSollicitation + 1

#nb
@external
def getnbEnregistrement() -> uint256 :
    return self.nbEnregistrement
@external
def getnbSollicitation() -> uint256 :
    return self.nbSollicitation

@external
def getnbDons() -> uint256 :
    return self.nbDon

#Sollicitation:

@external
def getcin_soli(nb:uint256)->String[100]:
    return self.listeSollicitation[nb].cin
@external
def getaccount_soli(nb:uint256)->address:
    return self.listeSollicitation[nb].account
@external
def gettitre_soli(nb:uint256)->String[1000]:
    return self.listeSollicitation[nb].titre
@external
def getdescription_soli(nb:uint256)->String[90000]:
    return self.listeSollicitation[nb].description
@external
def getstatus_soli(nb:uint256)->String[20]:
    return self.listeSollicitation[nb].status
@external
def getimage1_soli(nb:uint256)->String[200]:
    return self.listeSollicitation[nb].image1
@external
def getimage2_soli(nb:uint256)->String[200]:
    return self.listeSollicitation[nb].image2
@external
def getimage3_soli(nb:uint256)->String[200]:
    return self.listeSollicitation[nb].image3
@external
def getimage4_soli(nb:uint256)->String[200]:
    return self.listeSollicitation[nb].image4
@external
def getmontant_soli(nb:uint256)->String[20]:
    return self.listeSollicitation[nb].montant   
@external
def getsomme_don(nb:uint256)->String[40]:
    return self.listeSollicitation[nb].somme_don  
#Enregistrement
@external
def getaccountdonateur(nb:uint256)->address:
    return self.listeenregistrement[nb].accountdonateur
@external
def gettitre_enreg(nb:uint256)->String[1000]:
    return self.listeenregistrement[nb].titre
@external
def getstatus_enreg(nb:uint256)->String[100]:
    return self.listeenregistrement[nb].status

#Dons
@external
def getaccountdonateur_don(nb:uint256)->address:
    return self.listeDons[nb].accountdonateur

@external
def getaccountbeneficiare_don(nb:uint256)->address:
    return self.listeDons[nb].accountbeneficiare

@external
def getdatetransaction(nb:uint256)->String[50]:
    return self.listeDons[nb].datetransaction

@external
def gettitresollicitation_don(nb:uint256)->String[20]:
    return self.listeDons[nb].titresollicitation

@external
def getmontantdon(nb:uint256)->String[50]:
    return self.listeDons[nb].montantdon

 