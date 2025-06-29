import { EventEmitter } from '../base/events';

export class ModalView {
	protected modal = document.getElementById('modal-container') as HTMLElement;
	protected content = this.modal.querySelector(
		'.modal__content'
	) as HTMLElement;
	protected closeBtn = this.modal.querySelector(
		'.modal__close'
	) as HTMLButtonElement;

	constructor(protected emitter: EventEmitter) {
		this.closeBtn.addEventListener('click', () => this.close());
		this.emitter.on('modal:close', () => this.close());
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) {
				this.close();
			}
		});
	}

	open(content: HTMLElement): void {
		this.render(content);
		this.modal.classList.add('modal_active');
	}

	close(): void {
		this.modal.classList.remove('modal_active');
	}

	render(content: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.append(content);
	}
}
