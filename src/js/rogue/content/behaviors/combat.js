
import _ from 'lodash';
import ROT from 'rot-js';
import Behavior, { Priority } from '../../definitions/behavior';
import GameState from '../../init/gamestate';
import MessageQueue from '../../display/message-handler';

/* monsters can attack with this */
class AttacksBehavior extends Behavior {
  constructor() { super(Priority.DEFENSE); }
  act(me) {
    return !me.tryAttack();
  }
}

export const Attacks = () => new AttacksBehavior();

class TeleportsWhenHitBehavior extends Behavior {
  constructor(percent = 100) {
    super(Priority.DEFER);
    this.percent = percent;
  }
  takeDamage(me) {
    if(ROT.RNG.getPercentage() > this.percent) return;
    GameState.world.placeEntityAtRandomLocation(me);
  }
}

export const TeleportsWhenHit = (percent) => new TeleportsWhenHitBehavior(percent);

class StealsBehavior extends Behavior {
  constructor(percent = 100) {
    super(Priority.ALWAYS);
    this.percent = percent;
  }
  act(me) {
    if(ROT.RNG.getPercentage() > this.percent) return;
    let didSteal = false;
    let item = null;
    const entities = GameState.world.getValidEntitiesInRange(me.x, me.y, me.z, 1, ent => me.canAttack(ent));
    _.each(entities, ent => {
      item = _.sample(ent.inventory);
      if(!item) return;
      didSteal = ent;
      return false;
    });

    if(didSteal) {
      MessageQueue.add({ message: `${me.name} stole ${item.name} from ${didSteal.name}!` });
      didSteal.removeFromInventory(item);
      me.addToInventory(item);
    }
  }
}

export const Steals = () => new StealsBehavior();

class SplitsWhenHitBehavior extends Behavior {
  constructor(percent = 100) {
    super(Priority.ALWAYS);
    this.percent = percent;
  }
  takeDamage(me) {
    if(ROT.RNG.getPercentage() > this.percent) return;
    GameState.world.placeEntityAtRandomLocation(me);
  }
}

export const SplitsWhenHit = (percent) => new SplitsWhenHitBehavior(percent);