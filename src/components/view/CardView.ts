import { ICard, TMain, TCardModal, TCartModal } from '../../types/index';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

// Тип данных карточки может быть каталогом, превью или корзиной
type CardData = TMain | TCardModal | TCartModal;

// Дополнительные опции отрисовки карточки
type CardOptions = {
	addable?: boolean; // если true — показывать кнопку добавления в корзину
	removable?: boolean; // если true — показывать кнопку удаления из корзины
	disabled?: boolean; // если true — кнопка "в корзину" будет отключена
};

export class CardView {
	protected template: HTMLTemplateElement;

	constructor(template: HTMLTemplateElement, protected emitter: EventEmitter) {
		this.template = template;
	}

	render(data: CardData, options: CardOptions = {}): HTMLElement {
		// Клонируем шаблон карточки
		const card = this.template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		// Устанавливаем заголовок карточки
		const title = card.querySelector('.card__title');
		if (title) title.textContent = data.title;

		// Устанавливаем цену
		const price = card.querySelector('.card__price');
		if (price) price.textContent = `${data.price} синапсов`;

		// Устанавливаем изображение (если доступно)
		const image = card.querySelector('.card__image') as HTMLImageElement | null;
		if (image && 'image' in data) {
			image.src = data.image.startsWith('http')
				? data.image
				: `${CDN_URL.replace(/\/$/, '')}${data.image}`;
			image.alt = data.title;
		}

		// Устанавливаем категорию (если доступно)
		const category = card.querySelector('.card__category');
		if (category && 'category' in data) {
			category.textContent = data.category;
			category.classList.add(`card__category_${data.category}`);
		}

		// Устанавливаем описание (если доступно)
		const description = card.querySelector('.card__text');
		if (description && 'description' in data) {
			description.textContent = data.description;
		}

		// Если карточка может быть добавлена в корзину
		if (options.addable) {
			const addButton = card.querySelector('button');
			if (addButton instanceof HTMLButtonElement) {
				addButton.textContent = options.disabled
					? 'Товар уже в корзине'
					: 'В корзину';
				if (options.disabled) {
					addButton.setAttribute('disabled', 'true');
				} else {
					addButton.addEventListener('click', (e) => {
						e.stopPropagation();
						this.emitter.emit('basket:add', { id: (data as ICard).id });
					});
				}
			}
		}

		// Если карточку можно удалить из корзины
		if (options.removable) {
			const deleteButton =
				card.querySelector('.basket__item-delete') ??
				card.querySelector('.card__button');
			deleteButton?.addEventListener('click', (e) => {
				e.stopPropagation();
				this.emitter.emit('card:deselect', { id: (data as ICard).id });
			});
		}

		// При клике на карточку — открытие превью
		card.addEventListener('click', () => {
			if ('id' in data) {
				this.emitter.emit('card:select', { id: data.id });
			}
		});
		return card;
	}
}
