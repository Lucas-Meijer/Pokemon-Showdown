export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8', 
	pokemon: {
		eatItem(force?: boolean, source?: Pokemon, sourceEffect?: Effect) {
			if (!this.hp || !this.isActive) return false;
			if (!this.item) return false;

			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			const item = this.getItem();
			if (
				this.battle.runEvent('UseItem', this, null, null, item) &&
				(force || this.battle.runEvent('TryEatItem', this, null, null, item))
			) {
				this.battle.add('-enditem', this, item, '[eat]');

				this.battle.singleEvent('Eat', item, this.itemData, this, source, sourceEffect);
				this.battle.runEvent('EatItem', this, null, null, item);

				/* this.lastItem = this.item;
				this.item = '';
				this.itemData = { id: '', target: this };
				this.usedItemThisTurn = true;
				this.ateBerry = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item); */
				return true;
			}
			return false;
		},
		useItem(source?: Pokemon, sourceEffect?: Effect) {
			if ((!this.hp && !this.getItem().isGem) || !this.isActive) return false;
			if (!this.item) return false;

			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			const item = this.getItem();
			if (this.battle.runEvent('UseItem', this, null, null, item)) {
				switch (item.id) {
					case 'redcard':
						this.battle.add('-enditem', this, item, '[of] ' + source);
						break;
					default:
						if (item.isGem) {
							this.battle.add('-enditem', this, item, '[from] gem');
						} else {
							this.battle.add('-enditem', this, item);
						}
						break;
				}
				if (item.boosts) {
					this.battle.boost(item.boosts, this, source, item);
				}

				this.battle.singleEvent('Use', item, this.itemData, this, source, sourceEffect);
				return true;
			}
			return false;
		}
	},
};
