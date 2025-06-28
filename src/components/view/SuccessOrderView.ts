import { EventEmitter } from '../base/events';

export class SuccessOrderView {
	// Получаем шаблон из DOM (template#success)
	protected template = document.getElementById(
		'success'
	) as HTMLTemplateElement;

	// Принимаем emitter через конструктор для генерации событий
	constructor(protected emitter: EventEmitter) {}

	render(total: number): HTMLElement {
		// Клонируем содержимое шаблона
		const clone = this.template.content.cloneNode(true) as HTMLElement;

		// Находим элемент с текстом и устанавливаем сумму
		const text = clone.querySelector('.order-success__description')!;
		text.textContent = `Списано ${total} синапсов`;

		// Находим кнопку "За новыми покупками!" и вешаем обработчик
		const button = clone.querySelector('.order-success__close')!;
		button.addEventListener('click', () => this.emitter.emit('modal:close'));

		// Возвращаем полностью подготовленный DOM-элемент
		return clone;
	}
}
