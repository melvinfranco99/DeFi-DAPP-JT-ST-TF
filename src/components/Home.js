import React, { Component } from 'react';
import JamToken from '../abis/JamToken.json';
import StellartToken from '../abis/StellartToken.json';
import TokenFarm from '../abis/TokenFarm.json';
import Web3 from 'web3';

import Navigation from './Navbar';
import MyCarousel from './Carousel';

class App extends Component {

  async componentDidMount() {
    // 1. Carga de Web3
    await this.loadWeb3()
    // 2. Carga de datos de la Blockchain
    await this.loadBlockchainData()

  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });//esta funcion conecta las cuentas abiertas en metamask o solicita conectarlas y posteriormente las recoge en la variable accounts, despues de esto para llamar a las cuentas debemos usar la funcion: await web3.eth.getAccounts();
      console.log('Cuentas desde loadWeb3: ', accounts)
      console.log('Primera cuenta desde loadWeb3: ', accounts[0])
      this.setState({ cuentaPrincipal: accounts[0] })
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('¡Deberías considerar usar Metamask!')
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts() //esta funcion me devuelve las cuentas una vez ya conectadas
    console.log('Cuentas desde loadBlockchainData: ', accounts)
    console.log('Primera cuenta desde loadBlockchainData como "accounts[0]": ', accounts[0])
    this.setState({ account: accounts[0] })
    console.log('Primera cuenta desde loadBlockchainData como "this.state.account": ', this.state.account) //no funciona
    this.setState({ account2: accounts[1] })
    console.log('Segunda cuenta desde loadBlockchainData como "accounts[1]": ', accounts[1])
    console.log('Segunda cuenta desde loadBlockchainData como "this.state.account2": ', this.state.account2) //no funciona
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId()
    console.log('networkid:', networkId)

    //Carga del JamToken
    const jamTokenData = JamToken.networks[networkId]
    if (jamTokenData) {
      const jamToken = new web3.eth.Contract(JamToken.abi, jamTokenData.address)
      this.setState({ jamToken: jamToken })
      let jamTokenBalance = await jamToken.methods.balanceOf(this.state.account).call() //podria poner accounts[0] ya que me encuentro dentro de la funcion
      let jamTokenName = await jamToken.methods.name().call()
      console.log('Balance JT cuenta 0 desde loadBlockchainData: ', jamTokenBalance)
      console.log("Nombre del contrato JT al que estamos llamando: ", jamTokenName)
      this.setState({ jamTokenBalance: jamTokenBalance.toString() })
      this.setState({ jamTokenName: jamTokenName })
      let decimales = await jamToken.methods.decimals().call()
      this.setState({ jamTokenDecimals: decimales.toString() })
    } else {
      window.alert('No se ha desplegado el contrato JamToken correctamente')
    }

    //Carga StellartToken
    const stellartTokenData = StellartToken.networks[networkId]
    if (stellartTokenData) {
      const stellartToken = new web3.eth.Contract(StellartToken.abi, stellartTokenData.address)
      this.setState({ stellartToken: stellartToken })
      let stellartTokenBalance = await stellartToken.methods.balanceOf(accounts[0]).call()
      let stellartTokenName = await stellartToken.methods.name().call()
      console.log('Balance ST cuenta 0 desde loadBlockchainData: ', stellartTokenBalance)
      console.log("Nombre del contrato ST al que estamos llamando: ", stellartTokenName)
      this.setState({ stellartTokenBalance: stellartTokenBalance.toString() })
      this.setState({ stellartTokenName: stellartTokenName })
    } else {
      window.alert('No se ha desplegado el contrato StellartToken correctamente')
    }

    //Carga TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm: tokenFarm })
      let tokenFarmName = await tokenFarm.methods.name().call()
      this.setState({ tokenFarmName: tokenFarmName })
      let tokenFarmStakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ tokenFarmStakingBalanceCuenta0: tokenFarmStakingBalance })
      console.log("StakingBalance: ", tokenFarmStakingBalance)
    } else {
      window.alert('No se ha desplegado el contrato TokenFarm correctamente')
    }

    this.setState({ loading: false })



    /* //Carga el contrato Migrations, importar: 'import Migrations from '../abis/Migrations.json';' al principio
    const networkData = smart_contract.networks[networkId]
    console.log('NetworkData:', networkData)

    if (networkData) {
      const abi = smart_contract.abi
      console.log('abi', abi)
      const address = networkData.address
      console.log('address:', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract: contract })
      let contractOwner = await contract.methods.owner().call()
      console.log("Este es el owner del contrato: ", contractOwner)
      this.setState({ contractOwner: contractOwner }) //declarar 'contractOwner en las variables globales del constructor
    } else {
      window.alert('¡El Smart Contract no se ha desplegado en la red!')
    }*/
  }

  transfer = (address_to, amount_transfer) => {
    this.setState({ loading: true })
    this.state.jamToken.methods.transfer(address_to, amount_transfer).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }


  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.jamToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }


  unstakeTokens = (/*amount*/) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  issueTokens = () => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.issueTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = { //Aqui se declaran variables globales para que puedan ser accedidas desde cualquier sitio del codigo y no solo en la propia funcion donde se recogen los datos de dicha variable
      account: '0x0',
      cuentaPrincipal: '0x00',
      loading: true,
      jamToken: {},
      jamTokenBalance: '0',
      jamTokenName: 'undefined',
      stellartToken: {},
      stellartTokenBalance: '0',
      stellartTokenName: 'undefined',
      tokenFarm: {},
      tokenFarmName: 'undefined',
      tokenFarmStakingBalanceCuenta0: '0',
      jamTokenDecimals: '0'
    }
  }

  render() {
    /*let content
    if (this.state.loading) {
      content = <p id="loader" className='text-center'>Loading...</p>
    } else {
      content = <Main
        jamTokenBalance={this.state.jamTokenBalance}
        stellarTokenBalance={this.state.stellartTokenBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        tokenFarmStakingBalanceCuenta0={this.state.tokenFarmStakingBalanceCuenta0}
      />
    }*/

    let contenido
    if (this.state.loading) {
      contenido = <p id="loader" className='text-center'>Loading...</p>
    } else {
      contenido = <div className="content mr-auto ml-auto card">
        <table className='table table-borderless text-muted text-center'>
          <thead>
            <tr>
              <th scope="col">Balance de Staking</th>
              <th scope="col">Balance de recompensas</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.tokenFarmStakingBalanceCuenta0.toString()} JAM</td>
              <td>{this.state.stellartTokenBalance.toString()} STE</td>
            </tr>
          </tbody>
        </table>
        <div className='card mb-4'>
          <div className='card-body'>
            <form className='mb-3' onSubmit={(event) => {
              event.preventDefault()
              let amount
              amount = this.input.value.toString()
              this.stakeTokens(amount)
            }}>
              <div>
                <label className='float-left'>
                  <b>Stake Tokens &nbsp; </b>
                </label>
                <span className='float-right text-muted'>
                  Balance: {this.state.jamTokenBalance} JAM
                </span>
              </div>
              <br></br>
              <div className='input-group mb-4 '>
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className='form-control form-control-md'
                  placeholder='0'
                  required
                />
                <div className='input-group-append'>
                  <div className='input-group-text'>
                    <span>JAM</span>
                  </div>
                </div>
              </div>
              <button type="submit" className='btn btn-primary btn-block btn-lg'>STAKE!</button>

            </form>
            <button type="submit"
              className='btn btn-link btn-block btn-lg'
              onClick={(event) => {
                event.preventDefault()
                this.unstakeTokens()
              }}
            >RETIRAR STAKE</button>
          </div>
        </div>
      </div>
    }
    return (
      <div>
        <Navigation account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div>
                <div className="content mr-auto ml-auto card">
                  <h3>Datos del JamToken</h3>
                  <span>cuenta: {this.state.account}</span> <br></br>
                  <span>Balance de esta cuenta: {this.state.jamTokenBalance}</span>
                  <br></br>
                  <span>nombre del contrato que hemos llamado: {this.state.jamTokenName}</span>
                  <span>Decimales JamToken: {this.state.jamTokenDecimals}</span>
                </div>
                <div className="content mr-auto ml-auto card">
                  <h3>Datos del StellartToken</h3>
                  <span>cuenta: {this.state.account}</span> <br></br>
                  <span>balance: {this.state.stellartTokenBalance}</span>
                  <br></br>
                  <span>nombre del contrato que hemos llamado: {this.state.stellartTokenName}</span>
                </div>
                <div className="content mr-auto ml-auto card">
                  <h3>Datos del TokenFarm</h3>
                  <span>cuenta: {this.state.account}</span> <br></br>
                  <span>Staking Balance de la cuenta conectada: {this.state.tokenFarmStakingBalanceCuenta0}</span>
                  <br></br>
                  <span>nombre del contrato que hemos llamado: {this.state.tokenFarmName}</span>
                </div>

              </div>

              <div>
                <div className="content mr-auto ml-auto card">
                  <h3>Transferencia</h3>
                  <form className='mb-3' onSubmit={(event) => {
                    event.preventDefault()
                    let address_transfer
                    address_transfer = this.input1.value.toString()
                    let amount_transfer
                    amount_transfer = this.input2.value.toString()
                    console.log('direccionde envio', address_transfer, '. Cantidad enviada: ', amount_transfer)
                    this.transfer(address_transfer, amount_transfer)
                  }}>
                    <div>
                      <label className='float-left'>
                        <b>Transfer</b>
                      </label>
                      <br></br>
                      <span className='float-right text-muted'>
                        Balance: {this.state.jamTokenBalance} JAM
                      </span>
                    </div>
                    <br></br>
                    <div className='input-group mb-4 '>
                      <label>Direccion: </label>
                      <input
                        type="text"
                        ref={(input1) => { this.input1 = input1 }}
                        className='form-control form-control-md'
                        placeholder='0x0'
                        required
                      />

                      <label>
                        Cantidad:
                      </label>
                      <input
                        type="text"
                        ref={(input2) => { this.input2 = input2 }}
                        className='form-control form-control-md'
                        placeholder='0'
                        required
                      />
                      <div className='input-group-append'>
                        <div className='input-group-text'>
                          <span>JAM</span>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className='btn btn-primary btn-block btn-lg'>TRANSFER!</button>

                  </form>
                </div>
              </div>

              {contenido}

              <div className='content card'>
                <span>Cuenta principal: {this.state.account} <br></br>Solamente si estoy en esta cuenta podré llamar a la siguiente funcion.</span> <br></br><br></br>
                <button className='btn btn-success' type='submit'
                  onClick={(event) => {
                    event.preventDefault()
                    this.issueTokens()
                  }}
                >ISSUE TOKENS</button>


              </div>


            </main>
          </div >
        </div >
      </div >
    );
  }
}

export default App;
