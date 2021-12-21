#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp/tlscacerts/tlsca.nusayer.com-cert.pem
PEER0_STORE1_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/ca.crt
PEER0_STORE2_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/ca.crt
PEER0_STORE3_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/ca.crt

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  CORE_PEER_LOCALMSPID="OrdererMSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp/tlscacerts/tlsca.nusayer.com-cert.pem
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/nusayer.com/users/Admin@nusayer.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  ORG=$1
  if [ $ORG -eq 1 ]; then
    CORE_PEER_LOCALMSPID="store1MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_STORE1_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/store1.nusayer.com/users/Admin@store1.nusayer.com/msp
    CORE_PEER_ADDRESS=peer0.store1.nusayer.com:7051
  elif [ $ORG -eq 2 ]; then
    CORE_PEER_LOCALMSPID="store2MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_STORE2_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/store2.nusayer.com/users/Admin@store2.nusayer.com/msp
    CORE_PEER_ADDRESS=peer0.store2.nusayer.com:9051
  elif [ $ORG -eq 3 ]; then
    CORE_PEER_LOCALMSPID="store3MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_STORE3_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/store3.nusayer.com/users/Admin@store3.nusayer.com/msp
    CORE_PEER_ADDRESS=peer0.store3.nusayer.com:11051
  else
    echo "================== ERROR !!! ORG Unknown =================="
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo $'\e[1;31m'!!!!!!!!!!!!!!! $2 !!!!!!!!!!!!!!!!$'\e[0m'
    echo
    exit 1
  fi
}
