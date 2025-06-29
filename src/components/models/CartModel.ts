import { ICard } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CartModel {
	private items: ICard[] = [];

	constructor(private events: EventEmitter) {}

	getItems(): ICard[] {
		return this.items;
	}

	addItem(item: ICard): void {
		if (this.items.find((i) => i.id === item.id)) return;
		this.items.push(item);
		this.events.emit('cart:changed', this.items);
	}

	deleteItem(id: string): void {
		this.items = this.items.filter((card) => card.id !== id);
		this.events.emit('cart:changed', this.items);
	}

	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + item.price, 0);
	}

	hasItems(): boolean {
		return this.items.length > 0;
	}

	clear(): void {
		this.items = [];
		this.events.emit('cart:changed', this.items);
	}
}
