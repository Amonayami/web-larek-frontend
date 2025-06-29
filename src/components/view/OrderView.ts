import { TOrderModal } from '../../types/index';
import { EventEmitter } from '../base/events';
import {
	isOrderValid,
	isValidAddress,
	showFormError,
	clearFormError,
} from '../../utils/validation';

export class OrderView {
	protected template = document.getElementById('order') as HTMLTemplateElement;

	constructor(protected emitter: EventEmitter) {}

	render(data: TOrderModal): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const form = clone.querySelector('form') as HTMLFormElement;
		const addressInput = form.querySelector<HTMLInputElement>(
			'input[name="address"]'
		);
		const buttons = form.querySelectorAll<HTMLButtonElement>(
			'.order__buttons .button'
		);
		const submitButton = form.querySelector<HTMLButtonElement>(
			'button[type="submit"]'
		);
		const errorSpan = form.querySelector<HTMLSpanElement>('.form__errors');
		const toggleSubmitState = () => {
			const address = addressInput?.value.trim() || '';
			const selectedPayment =
				Array.from(buttons).find((b) =>
					b.classList.contains('button_alt-active')
				)?.name || '';
			const isValid = isOrderValid(address, selectedPayment);
			if (submitButton) submitButton.disabled = !isValid;
			if (errorSpan) {
				if (!address && !selectedPayment) {
					errorSpan.textContent = 'Введите адрес и выберите способ оплаты';
				} else if (!address || !isValidAddress(address)) {
					errorSpan.textContent = 'Введите корректный адрес';
				} else if (!selectedPayment) {
					errorSpan.textContent = 'Выберите способ оплаты';
				} else {
					errorSpan.textContent = '';
				}
			}
		};

		if (addressInput) {
			addressInput.value = data.address;
			addressInput.addEventListener('input', () => {
				this.emitter.emit('order:change', {
					field: 'address',
					value: addressInput.value,
				});
				toggleSubmitState();
			});
		}

		buttons.forEach((button) => {
			if (button.name) {
				if (data.payment === button.name) {
					button.classList.add('button_alt-active');
					toggleSubmitState();
				}
				button.addEventListener('click', () => {
					buttons.forEach((b) => b.classList.remove('button_alt-active'));
					button.classList.add('button_alt-active');
					this.emitter.emit('order:change', {
						field: 'payment',
						value: button.name,
					});
					toggleSubmitState();
				});
			}
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const address = addressInput?.value.trim() || '';
			const selectedPayment =
				Array.from(buttons).find((b) =>
					b.classList.contains('button_alt-active')
				)?.name || '';
			if (isOrderValid(address, selectedPayment)) {
				this.emitter.emit('order:submit');
			} else {
				if (!address || !isValidAddress(address)) {
					this.showError('address', 'Введите корректный адрес');
				}
				if (!selectedPayment && errorSpan) {
					errorSpan.textContent = 'Выберите способ оплаты';
				}
			}
		});
		toggleSubmitState();
		return clone;
	}

	showError(field: keyof TOrderModal, message: string): void {
		const form = document.querySelector(
			'form[name="order"]'
		) as HTMLFormElement;
		showFormError(form, message);
	}

	hideError(field: keyof TOrderModal): void {
		const form = document.querySelector(
			'form[name="order"]'
		) as HTMLFormElement;
		clearFormError(form);
	}
}
