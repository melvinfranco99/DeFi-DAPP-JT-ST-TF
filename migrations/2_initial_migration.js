const JamToken = artifacts.require('JamToken')
const StellartToken = artifacts.require('StellartToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(JamToken)
    const jamToken = await JamToken.deployed()

    await deployer.deploy(StellartToken)
    const stellartToken = await StellartToken.deployed()

    await deployer.deploy(TokenFarm, stellartToken.address, jamToken.address)
    const tokenFarm = await TokenFarm.deployed()


    await stellartToken.transfer(tokenFarm.address, '1000000000000000000000000')
    await jamToken.transfer(accounts[1], '1000')
    await jamToken.transfer(accounts[2], '2000')
}