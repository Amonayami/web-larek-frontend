import { ICard, ICardsData } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CardsModel implements ICardsData {
	private _cards: ICard[] = [];
	private _preview: string | null = null;

	constructor(private events: EventEmitter) {}

	// Устанавливает список карточек
	set cards(data: ICard[]) {
		this._cards = data;
		this.events.emit('cards:changed', this._cards);
	}

	// Возвращает все карточки
	get cards(): ICard[] {
		return this._cards;
	}

	// Устанавливает ID карточки для предпросмотра
	set preview(id: string | null) {
		this._preview = id;
		this.events.emit('preview:changed', this.getCard(id));
	}

	// Возвращает ID карточки предпросмотра
	get preview(): string | null {
		return this._preview;
	}

	// Получает карточку по ID
	getCard(id: string | null): ICard | undefined {
		return this._cards.find((card) => card.id === id);
	}

	// Проверяет, есть ли выбранная карточка
	hasSelected(): boolean {
		return this._preview !== null;
	}
}
