import Erc20Token from './Erc20Token';
import { WETH, PETH } from '../Currency';
import tracksTransactions from '../utils/tracksTransactions';
import contracts from '../../../contracts'

export default class PethToken extends Erc20Token {
  constructor(contract, web3Service, tub) {
    // super(name, ['smartContract', 'token', 'allowance']);
    super(contract, web3Service, 18, 'PETH');
    this._tub = tub;
  }

  _getToken(token) {
    return this.get('token').getToken(token);
  }

  join(amount, { unit = WETH, promise } = {}) {
    const value = this._valueForContract(amount, unit);
    return this._tub.join(value, { promise });
  }

  exit(amount, { unit = PETH, promise } = {}) {
    const value = this._valueForContract(amount, unit);
    return this._tub.exit(value, { promise });
  }

  async wrapperRatio() {
    return WETH.ray(await this._tub.per());
  }

  async joinPrice(amount, unit = WETH) {
    const value = this._valueForContract(amount, unit);
    return WETH.wei(await this._tub.ask(value));
  }

  async exitPrice(amount, unit = WETH) {
    const value = this._valueForContract(amount, unit);
    return WETH.wei(await this._tub.bid(value));
  }

  @tracksTransactions
  async convertWethToPeth(amount, { unit = WETH, promise } = {}) {
    const pethContract = this._getToken(PETH);

    await this.get('allowance').requireAllowance(
      WETH,
      this.get('smartContract').getContract(contracts.SAI_TUB).address,
      { promise }
    );
    return pethContract.join(amount, { unit, promise });
  }

  @tracksTransactions
  async convertEthToPeth(value, { promise }) {
    await this.convertEthToWeth(value, { promise });
    return this.convertWethToPeth(value, { promise });
  }
}
