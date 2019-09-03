const expect = require("chai").expect;
const db = require('../lib/frameworks_drivers/database');

require("dotenv").config();

describe('test configs', function () {
    describe('process.env required keys', function () {

        it('should have DB key', function () {
            expect(process.env).to.have.own.property('DB');
        })

        it('should have DB_PASS key', function () {
            expect(process.env).to.have.own.property('DB_PASS');
        })
    })

    describe('#database()', function () {

        context('with required keys', function () {
            it('should not return database connection error', function (done) {
                const config = {
                    username: process.env.DB,
                    password: process.env.DB_PASS
                }

                expect(function () {

                    db.config(config)
                    done()
                }).to.throw(TypeError, 'Unable to connect to database.')
              })
        })

        context('without required keys', function () {
            it('should return database connection error', function (done) {
                const config = {
                    username: process.env.DB,
                    password: process.env.DB_PASS
                }

                expect(function () {

                    db.config(config)
                    done()
                }).to.throw(TypeError, 'Unable to connect to database.')

            })
        })
    })

})
