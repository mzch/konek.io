const expect = require("chai").expect;
const db = require('../lib/frameworks_drivers/database');

require("dotenv").config();

describe('test configs', function () {

    describe('process.env required keys', function () {

        it('should have DB_USER key', function () {
            expect(process.env).to.have.own.property('DB_USER');
        })

        it('should have DB_PASS key', function () {
            expect(process.env).to.have.own.property('DB_PASS');
        })
    })

})
