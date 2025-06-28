// Проверка, что строка не пустая
export const isNotEmpty = (value: string): boolean => {
	return value.trim().length > 0;
};

// Простая проверка email
export const isValidEmail = (value: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

// Простая проверка телефона: начинается с +7 и далее 11 цифр
export const isValidPhone = (value: string): boolean => {
	return /^\+?\d{11}$/.test(value.trim());
};

// Валидация адреса
export const isValidAddress = (value: string): boolean => {
	return isNotEmpty(value);
};

// Общая проверка: email и телефон
export const isContactValid = (email: string, phone: string): boolean => {
	return isValidEmail(email) && isValidPhone(phone);
};

// Проверка: адрес + способ оплаты
export const isOrderValid = (address: string, payment: string): boolean => {
	return isValidAddress(address) && isNotEmpty(payment);
};

// Показывает сообщение об ошибке в форме
export function showFormError(form: HTMLFormElement, message: string): void {
	const errorElement = form.querySelector('.form__errors');
	if (errorElement) {
		errorElement.textContent = message;
	}
}

// Очищает сообщение об ошибке формы
export function clearFormError(form: HTMLFormElement): void {
	const errorElement = form.querySelector('.form__errors');
	if (errorElement) {
		errorElement.textContent = '';
	}
}
