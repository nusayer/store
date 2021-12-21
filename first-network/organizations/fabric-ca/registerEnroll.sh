#!/bin/bash

source scriptUtils.sh

function createstore1() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/store1.nusayer.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/store1.nusayer.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://store1admin:store1nusayer@localhost:7054 --caname ca-store1 --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-store1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-store1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-store1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-store1.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/store1.nusayer.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-store1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-store1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-store1 --id.name store1store1admin --id.secret store1store1nusayer --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/store1.nusayer.com/peers
  mkdir -p organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-store1 -M ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/msp --csr.hosts peer0.store1.nusayer.com --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-store1 -M ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls --enrollment.profile tls --csr.hosts peer0.store1.nusayer.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/store1.nusayer.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/store1.nusayer.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/store1.nusayer.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/store1.nusayer.com/tlsca/tlsca.store1.nusayer.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/store1.nusayer.com/ca
  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/peers/peer0.store1.nusayer.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/store1.nusayer.com/ca/ca.store1.nusayer.com-cert.pem

  mkdir -p organizations/peerOrganizations/store1.nusayer.com/users
  mkdir -p organizations/peerOrganizations/store1.nusayer.com/users/User1@store1.nusayer.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-store1 -M ${PWD}/organizations/peerOrganizations/store1.nusayer.com/users/User1@store1.nusayer.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/store1.nusayer.com/users/User1@store1.nusayer.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/store1.nusayer.com/users/Admin@store1.nusayer.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://store1store1admin:store1store1nusayer@localhost:7054 --caname ca-store1 -M ${PWD}/organizations/peerOrganizations/store1.nusayer.com/users/Admin@store1.nusayer.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/store1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store1.nusayer.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/store1.nusayer.com/users/Admin@store1.nusayer.com/msp/config.yaml

}

function createStore2() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/store2.nusayer.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/store2.nusayer.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://store2admin:store2nusayer@localhost:8054 --caname ca-store2 --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-store2.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-store2.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-store2.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-store2.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/store2.nusayer.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-store2 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-store2 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-store2 --id.name store2store2admin --id.secret store2store2nusayer --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/store2.nusayer.com/peers
  mkdir -p organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-store2 -M ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/msp --csr.hosts peer0.store2.nusayer.com --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-store2 -M ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls --enrollment.profile tls --csr.hosts peer0.store2.nusayer.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/store2.nusayer.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/store2.nusayer.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/store2.nusayer.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/store2.nusayer.com/tlsca/tlsca.store2.nusayer.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/store2.nusayer.com/ca
  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/peers/peer0.store2.nusayer.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/store2.nusayer.com/ca/ca.store2.nusayer.com-cert.pem

  mkdir -p organizations/peerOrganizations/store2.nusayer.com/users
  mkdir -p organizations/peerOrganizations/store2.nusayer.com/users/User1@store2.nusayer.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-store2 -M ${PWD}/organizations/peerOrganizations/store2.nusayer.com/users/User1@store2.nusayer.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/store2.nusayer.com/users/User1@store2.nusayer.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/store2.nusayer.com/users/Admin@store2.nusayer.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://store2store2admin:store2store2nusayer@localhost:8054 --caname ca-store2 -M ${PWD}/organizations/peerOrganizations/store2.nusayer.com/users/Admin@store2.nusayer.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/store2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/store2.nusayer.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/store2.nusayer.com/users/Admin@store2.nusayer.com/msp/config.yaml

}

function createOrderer() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/ordererOrganizations/nusayer.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/nusayer.com
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/nusayer.com/msp/config.yaml

  infoln "Register orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/nusayer.com/orderers
  mkdir -p organizations/ordererOrganizations/nusayer.com/orderers/nusayer.com

  mkdir -p organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com

  infoln "Generate the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp --csr.hosts orderer.nusayer.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/nusayer.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp/config.yaml

  infoln "Generate the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls --enrollment.profile tls --csr.hosts orderer.nusayer.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/msp/tlscacerts/tlsca.nusayer.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/nusayer.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/nusayer.com/orderers/orderer.nusayer.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/nusayer.com/msp/tlscacerts/tlsca.nusayer.com-cert.pem

  mkdir -p organizations/ordererOrganizations/nusayer.com/users
  mkdir -p organizations/ordererOrganizations/nusayer.com/users/Admin@nusayer.com

  infoln "Generate the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/nusayer.com/users/Admin@nusayer.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/nusayer.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/nusayer.com/users/Admin@nusayer.com/msp/config.yaml

}
