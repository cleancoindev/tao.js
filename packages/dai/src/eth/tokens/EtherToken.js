import { getCurrency, ETH, WETH } from '../Currency';
import tracksTransactions from '../../utils/tracksTransactions';

export default class EtherToken {
  constructor(web3Service, gasService, transactionManager) {
    // super(name, ['smartContract', 'token', 'allowance']);
    this._web3 = web3Service;
    this._gasService = gasService;
    this._transactionManager = transactionManager;
  }

  _getToken(token) {
    return this.get('token').getToken(token);
  }

  // eslint-disable-next-line
  allowance(tokenOwner, spender) {
    return Promise.resolve(Number.MAX_SAFE_INTEGER);
  }

  balance() {
    return this.balanceOf(this._web3.currentAddress());
  }

  async balanceOf(owner) {
    return ETH.wei(await this._web3.getBalance(owner));
  }

  // eslint-disable-next-line
  approve(spender, value) {
    return Promise.resolve(true);
  }

  // eslint-disable-next-line
  approveUnlimited(spender) {
    return Promise.resolve(true);
  }

  @tracksTransactions
  async transfer(toAddress, amount, options) {
    return this.transferFrom(
      this._web3.currentAddress(),
      toAddress,
      amount,
      options
    );
  }

  @tracksTransactions
  async transferFrom(fromAddress, toAddress, amount, { unit = ETH, promise }) {
    return this._transactionManager.sendTransaction(
      {
        from: fromAddress,
        to: toAddress,
        value: getCurrency(amount, unit).toFixed('wei')
      },
      {
        metadata: {
          action: {
            name: 'transfer',
            from: fromAddress,
            to: toAddress,
            amount: getCurrency(amount, unit)
          }
        },
        promise
      }
    );
  }

  @tracksTransactions
  convertWethToEth(amount, options) {
    return this._getToken(WETH).withdraw(amount, options);
  }

  @tracksTransactions
  async convertPethToEth(amount, { promise }) {
    await this.convertPethToWeth(amount, { promise });
    return this.convertWethToEth(amount, { promise });
  }
}
