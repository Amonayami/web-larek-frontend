// Данные от API
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// Данные для отображения
export interface IViewProduct {
	id: string;
	image: string;
	title: string;
	category: string;
	price: number;
	description?: string;
}

// Заказ и оплата
export type PaymentMethod = 'card' | 'cash';
export interface IOrderData {
	payment: PaymentMethod;
	address: string;
	email: string;
	telephone: string;
}
export interface IOrderResponse {
	id: string;
	total: number;
}

// API-клиент
export interface IApiClient {
	getProducts(): Promise<IProduct[]>;
	sendOrder(order: IOrderData): Promise<IOrderResponse>;
}

//Модель корзины
export interface ICartModel {
	items: IProduct[];
	addItem(item: IProduct): void;
	removeItem(id: string): void;
	clear(): void;
	getItems(): IProduct[];
	getTotal(): number;
	on(event: 'change', listener: () => void): void;
}

//Модель заказа
export interface IOrderModel {
	setPayment(payment: PaymentMethod): void;
	setAddress(address: string): void;
	setContacts(email: string, telephone: string): void;
	getOrder(): IOrderData;
	clear(): void;
	on(event: 'change', listener: () => void): void;
}

//События и брокер
export type AppEvent =
	| 'products:changed'
	| 'product:selected'
	| 'cart:changed'
	| 'order:changed'
	| 'order:submitted'
	| 'error';

export interface IAppEventPayload {
	'products:changed': void;
	'product:selected': { id: string };
	'cart:changed': { total: number; count: number };
	'order:changed': Partial<IOrderData>;
	'order:submitted': { orderId: string };
	error: { message: string };
}

export interface IEventEmitter {
	on<T extends AppEvent>(event: T, listener: (payload: IAppEventPayload[T]) => void): void;
	off<T extends AppEvent>(event: T, listener: (payload: IAppEventPayload[T]) => void): void;
	emit<T extends AppEvent>(event: T, payload: IAppEventPayload[T]): void;
}