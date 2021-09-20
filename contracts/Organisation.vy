#pragma line
# @version ^0.2.0
#Contract Organisation

nbBeneficiaireinfos : uint256
nbDonateur : uint256
nbnotification_organisation :uint256
nbnotification_donateur :uint256
nbnotification_beneficiaire :uint256
#Informations sur l'Organisation

email: String[100]
password: String[100]
walletAddress: address

@external
def __init__():
    self.email = "organisation@gmail.com"
    self.password = "password"
    self.walletAddress = 0xB29272F8750ec320964aAf531DbC7a629B898C5a
    self.nbBeneficiaireinfos = 0
    self.nbDonateur = 0
    self.nbnotification_organisation = 0
    self.nbnotification_donateur = 0
    self.nbnotification_beneficiaire = 0

#Informations sur le Beneficiaire

struct Beneficiaireinfos:
    photo : String[1000]
    cin: String[100]
    nom : String[100]
    dt : String[50]
    account : address
    prenom : String[100]
    email: String[200]
    password : String[100]
    tel : String[100]
    addresse : String[1000]
    status : String[20]


#Informations sur le donateur
struct Donateur:
    photo : String[1000]
    cin: String[100]
    nom : String[100]
    dt : String[50]
    account : address
    prenom : String[100]
    email: String[200]
    password : String[100]
    tel : String[100]
    addresse : String[1000]
    status : String[20]


struct Notification_Organisation:
    message : String[30000]
    status : String[25]

struct Notification_Donateur:
    accountdonateur : address
    message : String[30000]
    status : String[25]

struct Notification_Beneficiaire:
    accountbeneficiare : address
    message : String[30000]
    status : String[25]

listeBeneficiaireinfos: public(HashMap[uint256,Beneficiaireinfos])
listeDonateur : public(HashMap[uint256,Donateur])
notificationOrganisation : public(HashMap[uint256,Notification_Organisation])
notificationDonateur : public(HashMap[uint256,Notification_Donateur])
notificationBeneficiaire : public(HashMap[uint256,Notification_Beneficiaire])

#Fonction Organisation
@external
def ajouternotification_Organisation(_message : String[30000]):
    self.notificationOrganisation[self.nbnotification_organisation] = Notification_Organisation({
         message : _message,
         status : 'Disponible'
    })
    self.nbnotification_organisation = self.nbnotification_organisation + 1
@external
def modifiernotification_Organisation(_nb:uint256):
    self.notificationOrganisation[_nb].status = "Supprimer"

@external
def LoginOrganisation(_email:String[100], _password:String[100],_account:address) -> String[100]:
    res:String[100] = "r"
    if self.email == _email:
        res = "emailok"
        if self.password == _password:
            res = "passwordok"
            if self.walletAddress == _account:
                res = "welcome"
            else:
                res = "invalide email ou mot de passe"
    return res

@external
def Inscriptionbeneficiaire_organisation(_dt : String[50],_photo: String[100],_cin: String[100],_nom : String[100],_account : address,_prenom : String[100],_email: String[200],_password : String[100],_tel : String[100], _addresse : String[1000]):
    self.listeBeneficiaireinfos[self.nbBeneficiaireinfos] = Beneficiaireinfos({
         photo:_photo,
         cin: _cin,
         nom : _nom,
         dt : _dt,
         account : _account,
         prenom : _prenom,
         email: _email,
         password : _password,
         tel : _tel,
         addresse : _addresse,
         status : "Activer"
      })
    self.nbBeneficiaireinfos = self.nbBeneficiaireinfos + 1

#Fonction Donateur

@external
def ajouternotification_Donateur(_accountdonateur : address,_message : String[30000]):
    self.notificationDonateur[self.nbnotification_donateur] = Notification_Donateur({
        accountdonateur : _accountdonateur,
        message : _message,
        status : 'Disponible'
    })
    self.nbnotification_donateur = self.nbnotification_donateur + 1

@external
def modifiernotification_Donateur(_nb:uint256):
    self.notificationDonateur[_nb].status = "Supprimer"

@external
def Activerdonateur(nb:uint256):
    self.listeDonateur[nb].status = "Activer"
@external
def Desactiverdonateur(nb:uint256):
    self.listeDonateur[nb].status = "Desactiver"
@external
def InscriptionDonateur(_dt : String[50],_photo: String[100],_cin: String[100],_nom : String[100],_account : address,_prenom : String[100],_email: String[200],_password : String[100],_tel : String[100], _addresse : String[1000]):
    self.listeDonateur[self.nbDonateur] = Donateur({
         photo:_photo,
         cin: _cin,
         nom : _nom,
         dt : _dt,
         account : _account,
         prenom : _prenom,
         email: _email,
         password : _password,
         tel : _tel,
         addresse : _addresse,
         status : "Desactiver"
      })
    self.nbDonateur = self.nbDonateur + 1

@external
def LoginDonateur(_nb:uint256,_email:String[200],_password : String[100]) -> String[100]:
    res:String[100] = "r"
    if self.listeDonateur[_nb].email == _email:
        if self.listeDonateur[_nb].password == _password:
            if self.listeDonateur[_nb].status == "Activer":
                res = "welcome"
            else:
                res = "Attendez la confirmation de l'admin"
        else:
            res = "invalide password"
    else:
        res = "invalide email"
    return res

#Fonction Beneficiaire

@external
def ajouternotification_Beneficiaire(_accountbeneficiare : address,_message : String[30000]):
    self.notificationBeneficiaire[self.nbnotification_beneficiaire] = Notification_Beneficiaire({
        accountbeneficiare : _accountbeneficiare,
        message : _message,
        status : 'Disponible'
    })
    self.nbnotification_beneficiaire = self.nbnotification_beneficiaire + 1

@external
def modifiernotification_Beneficiaire(_nb:uint256):
    self.notificationBeneficiaire[_nb].status = "Supprimer"

@external
def Activerbeneficiaire(nb:uint256):
    self.listeBeneficiaireinfos[nb].status = "Activer"
@external
def Desactiverbeneficiaire(nb:uint256):
    self.listeBeneficiaireinfos[nb].status = "Desactiver"

@external
def Inscriptionbeneficiaire(_dt : String[50],_photo: String[100],_cin: String[100],_nom : String[100],_account : address,_prenom : String[100],_email: String[200],_password : String[100],_tel : String[100], _addresse : String[1000]):
    self.listeBeneficiaireinfos[self.nbBeneficiaireinfos] = Beneficiaireinfos({
         photo:_photo,
         cin: _cin,
         nom : _nom,
         dt : _dt,
         account : _account,
         prenom : _prenom,
         email: _email,
         password : _password,
         tel : _tel,
         addresse : _addresse,
         status : "Desactiver"
      })
    self.nbBeneficiaireinfos = self.nbBeneficiaireinfos + 1

@external
def Loginbeneficiaire(_nb:uint256,_email:String[200],_password : String[100]) -> String[100]:
    res:String[100] = "r"
    if self.listeBeneficiaireinfos[_nb].email == _email:
        if self.listeBeneficiaireinfos[_nb].password == _password:
            if self.listeBeneficiaireinfos[_nb].status == "Activer":
                res = "welcome"
            else :
                res ="Attendez la confirmation de l'admin"
        else:
            res = "invalide password"
    else:
        res = "invalide email"
    return res

#nb

@external
def getnbBeneficiaireinfos() -> uint256 :
    return self.nbBeneficiaireinfos  

@external
def getnbDonateur() -> uint256 :
    return self.nbDonateur

@external
def getnbnotification_organisation() -> uint256 :
    return self.nbnotification_organisation

@external
def getnbnotification_donateur() -> uint256 :
    return self.nbnotification_donateur

@external
def getnbnotification_beneficiaire() -> uint256 :
    return self.nbnotification_beneficiaire

#Beneficiaireinfos

@external
def getphoto(nb:uint256)->String[1000]:
    return self.listeBeneficiaireinfos[nb].photo
@external
def getcin(nb:uint256)->String[100]:
    return self.listeBeneficiaireinfos[nb].cin
@external
def getnom(nb:uint256)->String[100]:
    return self.listeBeneficiaireinfos[nb].nom
@external
def getdt(nb:uint256)->String[50]:
    return self.listeBeneficiaireinfos[nb].dt
@external
def getaccount(nb:uint256)->address:
    return self.listeBeneficiaireinfos[nb].account
@external
def getprenom(nb:uint256)->String[100]:
    return self.listeBeneficiaireinfos[nb].prenom
@external
def getemail(nb:uint256)->String[200]:
    return self.listeBeneficiaireinfos[nb].email
@external
def getpassword(nb:uint256)->String[100]:
    return self.listeBeneficiaireinfos[nb].password
@external
def gettel(nb:uint256)->String[100]:
    return self.listeBeneficiaireinfos[nb].tel
@external
def getaddresse(nb:uint256)->String[1000]:
    return self.listeBeneficiaireinfos[nb].addresse
@external
def getstatus(nb:uint256)->String[20]:
    return self.listeBeneficiaireinfos[nb].status


#Donateur
@external
def getphoto_donateur(nb:uint256)->String[1000]:
    return self.listeDonateur[nb].photo
@external
def getcin_donateur(nb:uint256)->String[100]:
    return self.listeDonateur[nb].cin
@external
def getnom_donateur(nb:uint256)->String[100]:
    return self.listeDonateur[nb].nom
@external
def getdt_donateur(nb:uint256)->String[50]:
    return self.listeDonateur[nb].dt
@external
def getaccount_donateur(nb:uint256)->address:
    return self.listeDonateur[nb].account
@external
def getprenom_donateur(nb:uint256)->String[100]:
    return self.listeDonateur[nb].prenom
@external
def getemail_donateur(nb:uint256)->String[200]:
    return self.listeDonateur[nb].email
@external
def getpassword_donateur(nb:uint256)->String[100]:
    return self.listeDonateur[nb].password
@external
def gettel_donateur(nb:uint256)->String[100]:
    return self.listeDonateur[nb].tel
@external
def getaddresse_donateur(nb:uint256)->String[1000]:
    return self.listeDonateur[nb].addresse
@external
def getstatus_donateur(nb:uint256)->String[20]:
    return self.listeDonateur[nb].status


#Notification_Donateur
@external
def getaccountnotification_donateur(nb:uint256)->address:
    return self.notificationDonateur[nb].accountdonateur
@external
def getmessage_donateur(nb:uint256)->String[30000]:
    return self.notificationDonateur[nb].message
@external
def getstatusnotification_donateur(nb:uint256)->String[25]:
    return self.notificationDonateur[nb].status

#Notification_Beneficiaire
@external
def getaccountnotification_beneficiaire(nb:uint256)->address:
    return self.notificationBeneficiaire[nb].accountbeneficiare
@external
def getmessage_beneficiaire(nb:uint256)->String[30000]:
    return self.notificationBeneficiaire[nb].message
@external
def getstatusnotification_beneficiaire(nb:uint256)->String[25]:
    return self.notificationBeneficiaire[nb].status

#Notification_Organisation
@external
def getmessage_organisation(nb:uint256)->String[30000]:
    return self.notificationOrganisation[nb].message
@external
def getstatus_organisation(nb:uint256)->String[25]:
    return self.notificationOrganisation[nb].status