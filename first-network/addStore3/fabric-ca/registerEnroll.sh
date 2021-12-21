

function createStore3 {

  echo
	echo "Enroll the CA admin of store3"
  echo
	mkdir -p ../organizations/peerOrganizations/store3.nusayer.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/../organizations/peerOrganizations/store3.nusayer.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://store3admin:store3nusayer@localhost:11054 --caname ca-store3 --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-store3.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-store3.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-store3.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-store3.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/msp/config.yaml

  echo
	echo "Register peer0 of store3"
  echo
  set -x
	fabric-ca-client register --caname ca-store3 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register user of store3"
  echo
  set -x
  fabric-ca-client register --caname ca-store3 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register the store3 admin"
  echo
  set -x
  fabric-ca-client register --caname ca-store3 --id.name store3store3admin --id.secret store3store3nusayer --id.type admin --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null

	mkdir -p ../organizations/peerOrganizations/store3.nusayer.com/peers
  mkdir -p ../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com

  echo
  echo "## Generate the peer0 msp for store3"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-store3 -M ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/msp --csr.hosts peer0.store3.nusayer.com --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for store3"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-store3 -M ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls --enrollment.profile tls --csr.hosts peer0.store3.nusayer.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null


  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/ca.crt
  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/signcerts/* ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/server.crt
  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/keystore/* ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/server.key

  mkdir ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/msp/tlscacerts
  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/tlsca
  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/tlsca/tlsca.store3.nusayer.com-cert.pem

  mkdir ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/ca
  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/peers/peer0.store3.nusayer.com/msp/cacerts/* ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/ca/ca.store3.nusayer.com-cert.pem

  mkdir -p ../organizations/peerOrganizations/store3.nusayer.com/users
  mkdir -p ../organizations/peerOrganizations/store3.nusayer.com/users/User1@store3.nusayer.com

  echo
  echo "## Generate the user msp for store3"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:11054 --caname ca-store3 -M ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/users/User1@store3.nusayer.com/msp --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/users/User1@store3.nusayer.com/msp/config.yaml

  mkdir -p ../organizations/peerOrganizations/store3.nusayer.com/users/Admin@store3.nusayer.com

  echo
  echo "## Generate the store 3 admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://store3store3admin:store3store3nusayer@localhost:11054 --caname ca-store3 -M ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/users/Admin@store3.nusayer.com/msp --tls.certfiles ${PWD}/fabric-ca/store3/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/store3.nusayer.com/users/Admin@store3.nusayer.com/msp/config.yaml

}
