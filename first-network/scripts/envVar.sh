#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

source scriptUtils.sh

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp/tlscacerts/tlsca.nusayer.com-cert.pem
export PEER0_store1_CA=${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/ca.crt
export PEER0_store2_CA=${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/ca.crt
export PEER0_store3_CA=${PWD}/organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/ca.crt

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  export CORE_PEER_LOCALMSPID="OrdererMSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp/tlscacerts/tlsca.nusayer.com-cert.pem
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/ordererOrganizations/nusayer.com/users/Admin@nusayer.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  infoln "Using Store ${USING_ORG}"
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_LOCALMSPID="store1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_store1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/store1.nusayer.com/users/Admin@store1.nusayer.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_LOCALMSPID="store2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_store2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/store2.nusayer.com/users/Admin@store2.nusayer.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_LOCALMSPID="store3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_store3_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/store3.nusayer.com/users/Admin@store3.nusayer.com/msp
    export CORE_PEER_ADDRESS=localhost:11051
  else
    errorln "STORE Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {

  PEER_CONN_PARMS=""
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER="peer0.store$1"
    ## Set peer addresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    ## Set path to TLS certificate
    TLSINFO=$(eval echo "--tlsRootCertFiles \$PEER0_store$1_CA")
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    # shift by one to get to the next organization
    shift
  done
  # remove leading space for output
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}
