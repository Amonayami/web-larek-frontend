import { ICard } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CartModel {
	private items: ICard[] = [];

	constructor(private events: EventEmitter) {}

	// Возвращает текущие товары в корзине
	getItems(): ICard[] {
		return this.items;
	}

	// Добавляет товар в корзину
	addItem(item: ICard): void {
		if (this.items.find((i) => i.id === item.id)) return;
		this.items.push(item);
		this.events.emit('cart:changed', this.items);
	}

	// Удаляет товар по ID
	deleteItem(id: string): void {
		this.items = this.items.filter((card) => card.id !== id);
		this.events.emit('cart:changed', this.items);
	}

	// Возвращает общую стоимость корзины
	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + item.price, 0);
	}

	// Проверяет, пуста ли корзина
	hasItems(): boolean {
		return this.items.length > 0;
	}

	// Очищает корзину
	clear(): void {
		this.items = [];
		this.events.emit('cart:changed', this.items);
	}
}
