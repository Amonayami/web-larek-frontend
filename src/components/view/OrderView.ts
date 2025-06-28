import { TOrderModal } from '../../types/index';
import { EventEmitter } from '../base/events';
import {
	isOrderValid,
	isValidAddress,
	showFormError,
	clearFormError,
} from '../../utils/validation';

export class OrderView {
	// Получаем шаблон формы из DOM
	protected template = document.getElementById('order') as HTMLTemplateElement;

	constructor(protected emitter: EventEmitter) {}

	render(data: TOrderModal): HTMLElement {
		// Клонируем шаблон
		const clone = this.template.content.cloneNode(true) as HTMLElement;
		const form = clone.querySelector('form') as HTMLFormElement;

		// Находим элементы формы
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


		// Переключает состояние кнопки отправки и отображает ошибки
		const toggleSubmitState = () => {
			const address = addressInput?.value.trim() || '';
			const selectedPayment =
				Array.from(buttons).find((b) =>
					b.classList.contains('button_alt-active')
				)?.name || '';

			const isValid = isOrderValid(address, selectedPayment);

			// Кнопка активна, только если все валидно
			if (submitButton) submitButton.disabled = !isValid;

			// Показываем текст ошибки внизу формы
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

		// Адрес: подставляем и следим за изменениями
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

		// Кнопки выбора оплаты: подставляем активную и слушаем клики
		buttons.forEach((button) => {
			if (button.name) {
				if (data.payment === button.name) {
					button.classList.add('button_alt-active');
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

		// Отправка формы
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.emitter.emit('order:submit');
		});

		toggleSubmitState();
		return clone;
	}

	// Показывает ошибку
	showError(field: keyof TOrderModal, message: string): void {
		const form = document.querySelector(
			'form[name="order"]'
		) as HTMLFormElement;
		showFormError(form, message);
	}

	// Скрывает ошибку
	hideError(field: keyof TOrderModal): void {
		const form = document.querySelector(
			'form[name="order"]'
		) as HTMLFormElement;
		clearFormError(form);
	}
}
