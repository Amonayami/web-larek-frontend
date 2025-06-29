export const isNotEmpty = (value: string): boolean => {
	return value.trim().length > 0;
};

export const isValidEmail = (value: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const isValidPhone = (value: string): boolean => {
	return /^\+?\d{11}$/.test(value.trim());
};

export const isValidAddress = (value: string): boolean => {
	return isNotEmpty(value);
};

export const isContactValid = (email: string, phone: string): boolean => {
	return isValidEmail(email) && isValidPhone(phone);
};

export const isOrderValid = (address: string, payment: string): boolean => {
	return isValidAddress(address) && isNotEmpty(payment);
};

export function showFormError(form: HTMLFormElement, message: string): void {
	const errorElement = form.querySelector('.form__errors');
	if (errorElement) {
		errorElement.textContent = message;
	}
}

export function clearFormError(form: HTMLFormElement): void {
	const errorElement = form.querySelector('.form__errors');
	if (errorElement) {
		errorElement.textContent = '';
	}
}
