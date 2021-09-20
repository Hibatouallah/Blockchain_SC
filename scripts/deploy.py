from brownie import Organisation, accounts ,Don


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(Organisation)
    accounts[0].deploy(Don)