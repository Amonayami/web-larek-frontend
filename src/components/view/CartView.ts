import { TCartModal } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CartView {
	// Получаем шаблон корзины из HTML по id
	protected template = document.getElementById('basket') as HTMLTemplateElement;

	constructor(protected emitter: EventEmitter) {}

	render(
		items: TCartModal[],
		total: number,
		createCard: (
			data: TCartModal,
			options?: { removable?: boolean }
		) => HTMLElement
	): HTMLElement {
		// Клонируем DOM-шаблон корзины
		const clone = this.template.content.cloneNode(true) as HTMLElement;

		// Получаем элементы списка, суммы и кнопки оформления
		const list = clone.querySelector('.basket__list')!;
		const totalEl = clone.querySelector('.basket__price')!;
		const button = clone.querySelector('.basket__button')!;

		// Генерация карточек товаров и вставка в список
		items.forEach((item, index) => {
			const el = createCard(item, { removable: true });
			el.querySelector('.basket__item-index')!.textContent = (
				index + 1
			).toString();
			list.append(el);
		});

		// Отображение общей суммы
		totalEl.textContent = `${total} синапсов`;

		// Если корзина пустая — блокируем кнопку оформления
		if (items.length === 0) {
			button.setAttribute('disabled', 'true');
		} else {
			button.removeAttribute('disabled');
		}

		// При нажатии на кнопку отправляем событие "basket:submit"
		button.addEventListener('click', () => this.emitter.emit('basket:submit'));

		return clone;
	}
}
