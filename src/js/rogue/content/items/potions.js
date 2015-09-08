
import _ from 'lodash';
import dice from 'dice.js';
import { Potion } from '../../definitions/equipment';

export class Healing extends Potion {
  static get rarity() { return 50; }
  constructor(opts = {}) {
    _.extend(opts, { charges: '1d1', healRoll: '4d4', autoRemove: true });
    super(opts);
  }
  use(entity) {
    const healVal = +dice.roll(this.healRoll);
    super.use(entity, { healVal, messageFinish: `regained ${healVal} health` });
  }
}