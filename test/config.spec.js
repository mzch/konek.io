const expect = require("chai").expect;
const utils = require('../server/helpers/utils');

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

                    utils.db(config)
                    done()
                }).to.throw(TypeError, 'Unable to connect to database.')
                // .to.throw(new Error('Property does not exist in model schema.'));
            })
        })

        context('without required keys', function () {
            it('should return database connection error', function (done) {
                const config = {
                    username: process.env.DB,
                    password: process.env.DB_PASS
                }

                expect(function () {

                    utils.db(config)
                    done()
                }).to.throw(TypeError, 'Unable to connect to database.')
                // .to.throw(new Error('Property does not exist in model schema.'));
            })
        })
    })

})
