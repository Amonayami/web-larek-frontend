// Подключение стилей приложения
import './scss/styles.scss';

// Импорт константы с базовым URL API
import { API_URL } from './utils/constants';

// Утилиты: для работы с DOM-элементами
import { cloneTemplate, ensureElement } from './utils/utils';

// Импорт клиента API и системы событий
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';

// Импорт моделей данных (карточки, корзина, заказ)
import { CardsModel } from './components/models/CardsModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';

// Импорт представлений (компонентов отображения)
import { CardView } from './components/view/CardView';
import { MainView } from './components/view/MainView';
import { ModalView } from './components/view/ModalView';
import { CartView } from './components/view/CartView';
import { OrderView } from './components/view/OrderView';
import { ContactView } from './components/view/ContactView';
import { SuccessOrderView } from './components/view/SuccessOrderView';

// Типы данных, используемые в приложении
import {
	ICard,
	TCardModal,
	TCartModal,
	TOrderModal,
	TContactModal,
} from './types';

// Создание глобальных экземпляров: событий, API, моделей и видов
const emitter = new EventEmitter();
const api = new Api(API_URL);

const cardsModel = new CardsModel(emitter);
const cartModel = new CartModel(emitter);
const orderModel = new OrderModel(emitter);

const mainView = new MainView(emitter);
const modalView = new ModalView(emitter);
const cartView = new CartView(emitter);
const orderView = new OrderView(emitter);
const contactView = new ContactView(emitter);
const successView = new SuccessOrderView(emitter);

// Получение шаблонов карточек из HTML
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Инициализация компонентов карточек с нужными шаблонами
const catalogCard = new CardView(catalogTemplate, emitter);
const previewCard = new CardView(previewTemplate, emitter);
const basketCard = new CardView(basketTemplate, emitter);

// Получение товаров с сервера и первичная отрисовка каталога
api
	.get('/product')
	.then((response: { items: ICard[] }) => {
		const validItems = response.items.filter(
			(item) => typeof item.price === 'number'
		);
		cardsModel.cards = validItems;
		mainView.renderCards(validItems, (card) =>
			catalogCard.render(card, {
				addable: true,
				disabled: cartModel.getItems().some((item) => item.id === card.id),
			})
		);
	})
	.catch((err) => console.error('Ошибка загрузки карточек:', err));

// Событие выбора карточки
emitter.on('card:select', ({ id }: { id: string }) => {
	cardsModel.preview = id;
});

// Обновление модального окна при смене выбранной карточки
emitter.on('preview:changed', (card?: TCardModal) => {
	if (!card) return;
	const isInCart = cartModel.getItems().some((item) => item.id === card.id);
	const el = previewCard.render(card, {
		addable: true,
		disabled: isInCart,
	});
	modalView.open(el);
});

// Добавление товара в корзину и обновление интерфейса
emitter.on('basket:add', ({ id }: { id: string }) => {
	const card = cardsModel.getCard(id);
	if (card) {
		cartModel.addItem(card);
		mainView.renderCartCounter(cartModel.getItems().length);
		mainView.renderCards(cardsModel.cards, (card) =>
			catalogCard.render(card, {
				addable: true,
				disabled: cartModel.getItems().some((item) => item.id === card.id),
			})
		);
	}
	if (cardsModel.preview === id) {
		const card = cardsModel.getCard(id);
		if (card) {
			const el = previewCard.render(card, {
				addable: true,
				disabled: true,
			});
			modalView.render(el);
		}
	}
});

// Удаление товара из корзины и обновление каталога и корзины
emitter.on('card:deselect', ({ id }: { id: string }) => {
	cartModel.deleteItem(id);
	mainView.renderCartCounter(cartModel.getItems().length);
	mainView.renderCards(cardsModel.cards, (card) =>
		catalogCard.render(card, {
			addable: true,
			disabled: cartModel.getItems().some((item) => item.id === card.id),
		})
	);
	const items = cartModel.getItems() as TCartModal[];
	const total = cartModel.getTotalPrice();
	const content = cartView.render(items, total, (data, opts) =>
		basketCard.render(data, opts)
	);
	modalView.render(content);
});

// Открытие модального окна корзины
emitter.on('basket:open', () => {
	const items = cartModel.getItems() as TCartModal[];
	const total = cartModel.getTotalPrice();
	const content = cartView.render(items, total, (data, opts) =>
		basketCard.render(data, opts)
	);
	modalView.open(content);
});

// Переход к шагу выбора способа оплаты и адреса
emitter.on('basket:submit', () => {
	const content = orderView.render({
		payment: orderModel.payment,
		address: orderModel.address,
	});
	modalView.open(content);
});

// Обновление данных заказа при вводе адреса или выборе оплаты
emitter.on(
	'order:change',
	({ field, value }: { field: keyof TOrderModal; value: string }) => {
		if (field === 'payment') orderModel.setPayment(value as any);
		if (field === 'address') orderModel.setAddress(value);
	}
);

// Подтверждение заказа: переход к вводу контактов или ошибка
emitter.on('order:submit', () => {
	if (orderModel.payment && orderModel.address) {
		const content = contactView.render({
			email: orderModel.email,
			phone: orderModel.phone,
		});
		modalView.open(content);
	} else {
		orderView.showError('address', 'Введите адрес');
	}
});

// Обработка изменения данных в контактной форме
emitter.on(
	'contacts:change',
	({ field, value }: { field: keyof TContactModal; value: string }) => {
		if (field === 'email' || field === 'phone') {
			orderModel.setContactInfo(
				field === 'email' ? value : orderModel.email,
				field === 'phone' ? value : orderModel.phone
			);
		}
	}
);

// Завершение заказа: проверка и показ успешного сообщения
emitter.on('order:success', () => {
	if (orderModel.isValid()) {
		const total = cartModel.getTotalPrice();
		const content = successView.render(total);
		modalView.open(content);
		cartModel.clear();
		mainView.renderCartCounter(0);
		orderModel.clear();
	} else {
		contactView.showError('email', 'Введите email');
		contactView.showError('phone', 'Введите телефон');
	}
});

// Закрытие модального окна сбрасывает предпросмотр
emitter.on('modal:close', () => {
	cardsModel.preview = null;
});
