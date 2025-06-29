export type PaymentType = 'online' | 'cash';

export type CategoryType =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type AppEvent =
	| 'card:select'
	| 'modal:open'
	| 'basket:add'
	| 'basket:open'
	| 'card:deselect'
	| 'basket:submit'
	| 'order:submit'
	| 'order:confirm'
	| 'order:contact'
	| 'order:success';

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number;
}

export interface ICardsData {
	cards: ICard[];
	preview: string | null;
	getCard(id: string): ICard;
	hasSelected(): boolean;
}

export interface ICartData {
	getItems(): ICard[];
	getTotalPrice(): number;
	addItem(item: ICard): void;
	deleteItem(id: string): void;
	hasItems(): boolean;
}

export interface IOrderData {
	payment: PaymentType;
	address: string;
	email: string;
	phone: string;
	setPayment(type: PaymentType): void;
	setAddress(address: string): void;
	setContactInfo(email: string, phone: string): void;
	isValid(): boolean;
}

export interface ICart {
	cards: ICard[];
	price: number;
}

export interface IOrder {
	payment: PaymentType;
	address: string;
	email: string;
	phone: string;
}

export type TMain = Pick<ICard, 'category' | 'title' | 'image' | 'price'>;
export type TCardModal = Pick<
	ICard,
	'id' | 'category' | 'title' | 'description' | 'image' | 'price'
>;
export type TCartModal = Pick<ICard, 'title' | 'price'>;
export type TOrderModal = Pick<IOrder, 'payment' | 'address'>;
export type TContactModal = Pick<IOrder, 'email' | 'phone'>;
