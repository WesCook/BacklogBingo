import { reactive, readonly } from 'vue';

import { useGameRules } from '../composables/gamerules.js';
import { useBingo } from '../composables/bingo.js';

const { getGameRules } = useGameRules();
const { getBingoCard, getStarTile } = useBingo();

const gamerules = getGameRules();
const bingoCard = getBingoCard();

export function useCardOutput() {
	// Format the bingo card object for more convenient output
	// Replaces category string on star tiles automatically, and adds helper properties isSatisfied and starType
	function getBingoCardOutput() {
		const starUUID = getStarTile();
		const card = reactive([]);

		// Iterate over each category in the bingo card
		for (const { name, entry, uuid } of bingoCard.categories) {
			let category = name;
			let entryNew = (entry === undefined) ? '' : entry;
			const isStarTile = (uuid === starUUID && gamerules.star !== 'disabled');
			const isSatisfied = (!!entry || (isStarTile && gamerules.star === 'free'));
			let starType = '';

			// Update the category if it's a star tile
			if (isStarTile) {
				starType = gamerules.star;
				if (gamerules.star === 'free') {
					category = '★';
					entryNew = '';
				} else if (gamerules.star === 'wildcard') {
					category = '★ Wildcard';
				}
			}

			// Push the formatted category to the list
			card.push({
				category,
				entry: entryNew,
				isStarTile,
				isSatisfied,
				starType
			});
		}

		return readonly(card);
	}

	return {
		getBingoCardOutput
	};
}
