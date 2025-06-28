import { ICard } from '../../types/index';
import { EventEmitter } from '../base/events';

export class MainView {
	// Контейнер, в который рендерятся карточки товаров
	protected container: HTMLElement = document.querySelector('.gallery')!;
	// Элемент, показывающий количество товаров в корзине
	protected cartCounter = document.querySelector('.header__basket-counter')!;
	// Иконка-кнопка корзины в шапке
	protected cartIcon = document.querySelector('.header__basket')!;

	constructor(protected emitter: EventEmitter) {
		// Подписываемся на клик по иконке корзины
		this.cartIcon.addEventListener(
			'click',
			() => this.emitter.emit('basket:open')
		);
	}


	// Метод отрисовки карточек товаров
	renderCards(cards: ICard[], createCard: (data: ICard) => HTMLElement): void {
		this.container.innerHTML = '';
		cards.forEach((card) => {
			const cardEl = createCard(card);
			this.container.append(cardEl);
		});
	}


	// Обновляет счётчик корзины
	renderCartCounter(count: number): void {
		this.cartCounter.textContent = count.toString();
	}
}
