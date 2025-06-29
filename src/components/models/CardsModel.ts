import { ICard, ICardsData } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CardsModel implements ICardsData {
	private _cards: ICard[] = [];
	private _preview: string | null = null;

	constructor(private events: EventEmitter) {}

	set cards(value: ICard[]) {
		this._cards = value;
		this.events.emit('items:change', this._cards);
	}

	get cards(): ICard[] {
		return this._cards;
	}

	set preview(id: string | null) {
		this._preview = id;
		this.events.emit('preview:changed', this.getCard(id));
	}

	get preview(): string | null {
		return this._preview;
	}

	getCard(id: string | null): ICard | undefined {
		return this._cards.find((card) => card.id === id);
	}

	hasSelected(): boolean {
		return this._preview !== null;
	}
}
