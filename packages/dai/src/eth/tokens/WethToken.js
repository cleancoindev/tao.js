import Erc20Token from './Erc20Token';
import { ETH, WETH, PETH } from '../Currency';
import tracksTransactions from '../../utils/tracksTransactions';
import contracts from '../../../contracts'

export default class WethToken extends Erc20Token {
  constructor(contract, web3Service, decimals) {
    // super(name, ['smartContract', 'token', 'allowance']);
    super(contract, web3Service, decimals, 'WETH');
  }

  name() {
    return this._contract.name();
  }

  _getToken(token) {
    return this.get('token').getToken(token);
  }

  deposit(amount, { unit = ETH, ...options } = {}) {
    return this._contract.deposit({
      value: this._valueForContract(amount, unit),
      ...options
    });
  }

  withdraw(amount, { unit = WETH, ...options } = {}) {
    const value = this._valueForContract(amount, unit);
    return this._contract.withdraw(value, options);
  }

  @tracksTransactions
  convertEthToWeth(amount, options) {
    return this._getToken(WETH).deposit(amount, options);
  }

  @tracksTransactions
  async convertPethToWeth(amount, { unit = WETH, promise }) {
    const pethToken = this._getToken(PETH);

    await this.get('allowance').requireAllowance(
      PETH,
      this.get('smartContract').getContract(contracts.SAI_TUB).address,
      { promise }
    );
    return pethToken.exit(amount, { unit, promise });
  }
}
