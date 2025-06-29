import { TContactModal } from '../../types/index';
import { EventEmitter } from '../base/events';
import {
	isContactValid,
	isValidEmail,
	isValidPhone,
	showFormError,
	clearFormError,
} from '../../utils/validation';

export class ContactView {
	protected template = document.getElementById(
		'contacts'
	) as HTMLTemplateElement;

	constructor(protected emitter: EventEmitter) {}

	render(data: TContactModal): HTMLElement {
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const form = clone.querySelector('form')!;
		const emailInput = form.elements.namedItem('email') as HTMLInputElement;
		const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
		const submitButton = form.querySelector<HTMLButtonElement>(
			'button[type="submit"]'
		);
		const errorSpan = form.querySelector<HTMLSpanElement>('.form__errors');
		const toggleSubmitState = () => {
			const email = emailInput.value.trim();
			const phone = phoneInput.value.trim();
			const isValid = isContactValid(email, phone);
			if (submitButton) submitButton.disabled = !isValid;
			if (errorSpan) {
				if (!email && !phone) {
					errorSpan.textContent = 'Введите email и телефон';
				} else if (!email || !isValidEmail(email)) {
					errorSpan.textContent = 'Некорректный email';
				} else if (!phone || !isValidPhone(phone)) {
					errorSpan.textContent = 'Некорректный телефон';
				} else {
					errorSpan.textContent = '';
				}
			}
		};
		emailInput.value = data.email;
		phoneInput.value = data.phone;
		emailInput.addEventListener('input', () => {
			this.emitter.emit('contacts:change', {
				field: 'email',
				value: emailInput.value,
			});
			toggleSubmitState();
		});
		phoneInput.addEventListener('input', () => {
			this.emitter.emit('contacts:change', {
				field: 'phone',
				value: phoneInput.value,
			});
			toggleSubmitState();
		});
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.emitter.emit('order:success');
		});
		toggleSubmitState();
		return clone;
	}

	showError(field: keyof TContactModal, message: string): void {
		const form = document.querySelector(
			'form[name="contacts"]'
		) as HTMLFormElement;
		showFormError(form, message);
	}

	hideError(field: keyof TContactModal): void {
		const form = document.querySelector(
			'form[name="contacts"]'
		) as HTMLFormElement;
		clearFormError(form);
	}
}
