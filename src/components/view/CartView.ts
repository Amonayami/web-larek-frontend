import { EventEmitter } from '../base/events';

export class CartView {
	protected template = document.getElementById('basket') as HTMLTemplateElement;

	constructor(protected emitter: EventEmitter) {}

	render(items: HTMLElement[], total: number): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const list = clone.querySelector('.basket__list')!;
		const totalEl = clone.querySelector('.basket__price')!;
		const button = clone.querySelector('.basket__button')!;
		list.replaceChildren(...items);
		totalEl.textContent = `${total} синапсов`;
		if (items.length === 0) {
			button.setAttribute('disabled', 'true');
		} else {
			button.removeAttribute('disabled');
		}
		button.addEventListener('click', () => this.emitter.emit('basket:submit'));
		return clone;
	}
}
