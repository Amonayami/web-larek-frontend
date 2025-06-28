import { EventEmitter } from '../base/events';

export class ModalView {
	// Получаем DOM-элементы модального окна, контейнера и кнопки закрытия
	protected modal = document.getElementById('modal-container') as HTMLElement;
	protected content = this.modal.querySelector(
		'.modal__content'
	) as HTMLElement;
	protected closeBtn = this.modal.querySelector(
		'.modal__close'
	) as HTMLButtonElement;

	constructor(protected emitter: EventEmitter) {
		// Закрытие по кнопке-крестику
		this.closeBtn.addEventListener('click', () => this.close());

		// Подписка на глобальное событие закрытия модалки
		this.emitter.on('modal:close', () => this.close());

		// Закрытие при клике вне контента
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) {
				this.close();
			}
		});
	}

	// Открывает модальное окно
	open(content: HTMLElement): void {
		this.render(content);
		this.modal.classList.add('modal_active');
	}

	// Закрывает модальное окно
	close(): void {
		this.modal.classList.remove('modal_active');
	}

	// Обновляет содержимое модального окна
	render(content: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.append(content);
	}
}
