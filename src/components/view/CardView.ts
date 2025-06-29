import { ICard, TMain, TCardModal, TCartModal } from '../../types/index';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

type CardData = TMain | TCardModal | TCartModal;
type CardOptions = {
	addable?: boolean;
	removable?: boolean;
	disabled?: boolean;
};

export class CardView {
	protected template: HTMLTemplateElement;
	protected categoryColors: Record<string, string> = {
		'софт-скил': 'soft',
		другое: 'other',
		кнопка: 'button',
		'хард-скил': 'hard',
		дополнительное: 'additional',
	};

	constructor(template: HTMLTemplateElement, protected emitter: EventEmitter) {
		this.template = template;
	}

	protected setText(el: HTMLElement, value: unknown) {
		if (el) {
			el.textContent = String(value);
		}
	}
	protected setCategory(el: HTMLElement, value: string) {
		this.setText(el, value);
		const raw = value.toLowerCase().trim();
		const cls = this.categoryColors[raw] ?? 'other';
		el.className = `card__category card__category_${cls}`;
	}

	render(data: CardData, options: CardOptions = {}): HTMLElement {
		const card = this.template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		const title = card.querySelector('.card__title') as HTMLElement;
		if (title) this.setText(title, data.title);

		const price = card.querySelector('.card__price') as HTMLElement;
		if (price) {
			const isFree = typeof (data as ICard).price !== 'number';
			price.textContent = isFree
				? 'Бесценно'
				: `${(data as ICard).price} синапсов`;
		}
		const image = card.querySelector('.card__image') as HTMLImageElement | null;
		if (image && 'image' in data) {
			image.src = data.image.startsWith('http')
				? data.image
				: `${CDN_URL.replace(/\/$/, '')}${data.image}`;
			image.alt = data.title;
		}
		const category = card.querySelector('.card__category') as HTMLElement;
		if (category && 'category' in data) {
			this.setCategory(category, data.category);
		}
		const description = card.querySelector('.card__text') as HTMLElement;
		if (description && 'description' in data) {
			this.setText(description, data.description);
		}
		if (options.addable) {
			const addButton = card.querySelector(
				'.card__button'
			) as HTMLButtonElement;

			if (addButton) {
				const priceValue = 'price' in data ? data.price : undefined;
				const isFree = typeof priceValue !== 'number' || priceValue <= 0;
				if (isFree) {
					addButton.textContent = 'Недоступен';
					addButton.disabled = true;
					addButton.classList.add('card__button--disabled');
				} else if (options.disabled) {
					addButton.textContent = 'Товар уже в корзине';
					addButton.disabled = true;
					addButton.classList.add('card__button--disabled');
				} else {
					addButton.textContent = 'В корзину';
					addButton.disabled = false;
					addButton.classList.remove('card__button--disabled');
					addButton.addEventListener('click', (e) => {
						e.stopPropagation();
						if ('id' in data) {
							this.emitter.emit('basket:add', { id: data.id });
						}
					});
				}
			}
		}
		if (options.removable) {
			const deleteButton = card.querySelector(
				'.basket__item-delete'
			) as HTMLButtonElement;
			deleteButton?.addEventListener('click', (e) => {
				e.stopPropagation();
				this.emitter.emit('card:deselect', { id: (data as ICard).id });
			});
		}
		card.addEventListener('click', () => {
			const button = card.querySelector('.card__button') as HTMLButtonElement;
			if (button?.disabled) return;

			if ('id' in data) {
				this.emitter.emit('card:select', { id: data.id });
			}
		});
		return card;
	}
}
