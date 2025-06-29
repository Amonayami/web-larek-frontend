import { EventEmitter } from '../base/events';

export class MainView {
	protected container: HTMLElement = document.querySelector('.gallery')!;
	protected cartCounter = document.querySelector('.header__basket-counter')!;
	protected cartIcon = document.querySelector('.header__basket')!;

	constructor(protected emitter: EventEmitter) {
		this.cartIcon.addEventListener('click', () =>
			this.emitter.emit('basket:open')
		);
	}

	renderCards(elements: HTMLElement[]): void {
		this.container.replaceChildren(...elements);
	}

	renderCartCounter(count: number): void {
		this.cartCounter.textContent = count.toString();
	}
}
