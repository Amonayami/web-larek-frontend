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
	// Получаем шаблон формы из HTML
	protected template = document.getElementById(
		'contacts'
	) as HTMLTemplateElement;

	constructor(protected emitter: EventEmitter) {}

	render(data: TContactModal): HTMLElement {
		// Клонируем содержимое шаблона формы
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

			// Блокировка/разблокировка кнопки отправки
			if (submitButton) submitButton.disabled = !isValid;

			// Отображение текстов ошибок
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

		// Заполняем поля из переданных данных
		emailInput.value = data.email;
		phoneInput.value = data.phone;

		// Обработка ввода email
		emailInput.addEventListener('input', () => {
			this.emitter.emit('contacts:change', {
				field: 'email',
				value: emailInput.value,
			});
			toggleSubmitState();
		});

		// Обработка ввода телефона
		phoneInput.addEventListener('input', () => {
			this.emitter.emit('contacts:change', {
				field: 'phone',
				value: phoneInput.value,
			});
			toggleSubmitState();
		});

		// Отправка формы — только при валидных данных
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.emitter.emit('order:success');
		});

		// При первом отображении формы проверим валидность
		toggleSubmitState();
		return clone;
	}

	// Показать ошибку
	showError(field: keyof TContactModal, message: string): void {
		const form = document.querySelector(
			'form[name="contacts"]'
		) as HTMLFormElement;
		showFormError(form, message);
	}

	// Скрыть ошибку
	hideError(field: keyof TContactModal): void {
		const form = document.querySelector(
			'form[name="contacts"]'
		) as HTMLFormElement;
		clearFormError(form);
	}
}
