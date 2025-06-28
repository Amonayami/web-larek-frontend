// Тип способа оплаты: либо онлайн, либо наличные
export type PaymentType = 'online' | 'cash';

// Тип категории товара, ограниченный набор строк
export type CategoryType =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Тип всех возможных событий, которые может обрабатывать система событий (EventEmitter)
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

// Основной тип товара (карточки)
export interface ICard {
	id: string; // уникальный идентификатор товара
	description: string; // описание товара
	image: string; // URL изображения товара
	title: string; // заголовок
	category: CategoryType; // категория
	price: number; // цена
}

// Интерфейс модели данных всех карточек
export interface ICardsData {
	cards: ICard[]; // массив всех карточек
	preview: string | null; // ID выбранной карточки
	getCard(id: string): ICard; // метод для получения карточки по ID
	hasSelected(): boolean; // есть ли выбранная карточка
}

// Интерфейс модели корзины
export interface ICartData {
	getItems(): ICard[]; // вернуть список товаров в корзине
	getTotalPrice(): number; // сумма всех товаров
	addItem(item: ICard): void; // добавить товар
	deleteItem(id: string): void; // удалить товар
	hasItems(): boolean; // есть ли что-то в корзине
}

// Интерфейс модели оформления заказа
export interface IOrderData {
	payment: PaymentType; // выбранный способ оплаты
	address: string; // адрес
	email: string;
	phone: string;
	setPayment(type: PaymentType): void; // установка способа оплаты
	setAddress(address: string): void; // установка адреса
	setContactInfo(email: string, phone: string): void; // установка email и телефона
	isValid(): boolean; // все ли поля заполнены
}

// Интерфейс структуры корзины (для передачи на сервер или использования во view)
export interface ICart {
	cards: ICard[];
	price: number;
}

// Интерфейс структуры заказа (в том числе для сериализации)
export interface IOrder {
	payment: PaymentType;
	address: string;
	email: string;
	phone: string;
}

// Упрощённый тип карточки — для каталога
export type TMain = Pick<ICard, 'category' | 'title' | 'image' | 'price'>;

// Расширенная карточка — для модального окна предпросмотра
export type TCardModal = Pick<
	ICard,
	'id' | 'category' | 'title' | 'description' | 'image' | 'price'
>;

// Карточка в корзине — достаточно только названия и цены
export type TCartModal = Pick<ICard, 'title' | 'price'>;

// Тип формы оформления заказа (оплата и адрес)
export type TOrderModal = Pick<IOrder, 'payment' | 'address'>;

// Тип контактной формы (email и телефон)
export type TContactModal = Pick<IOrder, 'email' | 'phone'>;
