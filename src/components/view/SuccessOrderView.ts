import { EventEmitter } from '../base/events';

export class SuccessOrderView {
	protected template = document.getElementById(
		'success'
	) as HTMLTemplateElement;

	constructor(protected emitter: EventEmitter) {}

	render(total: number): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const text = clone.querySelector('.order-success__description')!;
		text.textContent = `Списано ${total} синапсов`;
		const button = clone.querySelector('.order-success__close')!;
		button.addEventListener('click', () => this.emitter.emit('modal:close'));
		return clone;
	}
}
