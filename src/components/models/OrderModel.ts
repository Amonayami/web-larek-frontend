import { IOrderData, PaymentType } from '../../types/index';
import { EventEmitter } from '../base/events';

export class OrderModel implements IOrderData {
	payment: PaymentType = 'online';
	address: string = '';
	email: string = '';
	phone: string = '';

	constructor(private events: EventEmitter) {}

	setPayment(type: PaymentType): void {
		this.payment = type;
		this.events.emit('order:changed', this);
	}

	setAddress(address: string): void {
		this.address = address;
		this.events.emit('order:changed', this);
	}

	setContactInfo(email: string, phone: string): void {
		this.email = email;
		this.phone = phone;
		this.events.emit('order:changed', this);
	}

	isValid(): boolean {
		return Boolean(this.payment && this.address && this.email && this.phone);
	}

	clear(): void {
		this.payment = 'online';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.events.emit('order:cleared');
	}

	getOrderData() {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}
}
