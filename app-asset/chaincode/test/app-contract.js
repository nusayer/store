/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { AppContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('AppContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new AppContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"app 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"app 1002 value"}'));
    });

    describe('#appExists', () => {

        it('should return true for a app', async () => {
            await contract.appExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a app that does not exist', async () => {
            await contract.appExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createapp', () => {

        it('should create a app', async () => {
            await contract.createapp(ctx, '1003', 'app 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"app 1003 value"}'));
        });

        it('should throw an error for a app that already exists', async () => {
            await contract.createapp(ctx, '1001', 'myvalue').should.be.rejectedWith(/The app 1001 already exists/);
        });

    });

    describe('#readapp', () => {

        it('should return a app', async () => {
            await contract.readapp(ctx, '1001').should.eventually.deep.equal({ value: 'app 1001 value' });
        });

        it('should throw an error for a app that does not exist', async () => {
            await contract.readapp(ctx, '1003').should.be.rejectedWith(/The app 1003 does not exist/);
        });

    });

    describe('#updateapp', () => {

        it('should update a app', async () => {
            await contract.updateapp(ctx, '1001', 'app 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"app 1001 new value"}'));
        });

        it('should throw an error for a app that does not exist', async () => {
            await contract.updateapp(ctx, '1003', 'app 1003 new value').should.be.rejectedWith(/The app 1003 does not exist/);
        });

    });

    describe('#deleteapp', () => {

        it('should delete a app', async () => {
            await contract.deleteapp(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a app that does not exist', async () => {
            await contract.deleteapp(ctx, '1003').should.be.rejectedWith(/The app 1003 does not exist/);
        });

    });

});