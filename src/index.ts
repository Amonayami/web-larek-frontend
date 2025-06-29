import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { CardsModel } from './components/models/CardsModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';

import { CardView } from './components/view/CardView';
import { MainView } from './components/view/MainView';
import { ModalView } from './components/view/ModalView';
import { CartView } from './components/view/CartView';
import { OrderView } from './components/view/OrderView';
import { ContactView } from './components/view/ContactView';
import { SuccessOrderView } from './components/view/SuccessOrderView';

import {
	ICard,
	TCardModal,
	TOrderModal,
	TContactModal,
} from './types';

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

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const catalogCard = new CardView(catalogTemplate, emitter);
const previewCard = new CardView(previewTemplate, emitter);
const basketCard = new CardView(basketTemplate, emitter);

api
	.get('/product')
	.then((response: { items: ICard[] }) => {
		emitter.emit('cards:changed', response.items);
	})
	.catch((err) => console.error('Ошибка загрузки карточек:', err));

emitter.on('cards:changed', (cards: ICard[]) => {
	cardsModel.cards = cards;
	const elements = cards.map((card) => {
		const isInCart = cartModel.getItems().some((item) => item.id === card.id);
		const isFree = typeof card.price !== 'number';
		return catalogCard.render(card, {
			addable: !isFree,
			disabled: isFree || isInCart,
		});
	});
	mainView.renderCards(elements);
});

emitter.on('card:select', ({ id }: { id: string }) => {
	cardsModel.preview = id;
});

emitter.on('preview:changed', (card?: TCardModal) => {
	if (!card) return;
	const isInCart = cartModel.getItems().some((item) => item.id === card.id);
	const isFree = typeof card.price !== 'number';
	const el = previewCard.render(card, {
		addable: true,
		disabled: isFree || isInCart,
	});
	modalView.open(el);
});

emitter.on('basket:add', ({ id }: { id: string }) => {
	const card = cardsModel.getCard(id);
	if (card && typeof card.price === 'number') {
		cartModel.addItem(card);
		emitter.emit('items:change', cardsModel.cards);
		mainView.renderCartCounter(cartModel.getItems().length);
	}
	if (cardsModel.preview === id) {
		const el = previewCard.render(card, {
			addable: typeof card.price === 'number',
			disabled: true,
		});
		modalView.render(el);
	}
});

emitter.on('basket:open', () => {
	const items = cartModel.getItems();
	const elements = items.map((item, index) => {
		const el = basketCard.render(item, { removable: true });
		el.querySelector('.basket__item-index')!.textContent = (
			index + 1
		).toString();
		return el;
	});
	const total = cartModel.getTotalPrice();
	const content = cartView.render(elements, total);
	modalView.open(content);
});

emitter.on('card:deselect', ({ id }: { id: string }) => {
	cartModel.deleteItem(id);
	emitter.emit('cards:changed', cardsModel.cards);
	mainView.renderCartCounter(cartModel.getItems().length);

	if (cardsModel.preview === id) {
		const card = cardsModel.getCard(id);

		if (cartModel.hasItems()) {
			if (card) {
				const isInCart = false;
				const isFree = typeof card.price !== 'number';
				const el = previewCard.render(card, {
					addable: true,
					disabled: isFree || isInCart,
				});
				modalView.render(el);
			}
		} else {
			emitter.emit('modal:close');
		}
	}

	const modalEl = document.querySelector('.modal.modal_active');
	if (modalEl?.querySelector('.basket')) {
		emitter.emit('basket:open');
	}
});

emitter.on('basket:submit', () => {
	const content = orderView.render({
		payment: orderModel.payment,
		address: orderModel.address,
	});
	modalView.open(content);
});

emitter.on('order:submit', () => {
	const content = contactView.render({
		email: orderModel.email,
		phone: orderModel.phone,
	});
	modalView.render(content);
});

emitter.on(
	'order:change',
	({ field, value }: { field: keyof TOrderModal; value: string }) => {
		if (field === 'payment') orderModel.setPayment(value as any);
		if (field === 'address') orderModel.setAddress(value);
	}
);

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

emitter.on('order:success', () => {
	if (orderModel.isValid()) {
		api
			.post('/order', {
				...orderModel.getOrderData(),
				items: cartModel
					.getItems()
					.filter((item) => typeof item.price === 'number')
					.map((item) => item.id),
				total: cartModel.getTotalPrice(),
			})
			.then(() => {
				const total = cartModel.getTotalPrice();
				const content = successView.render(total);
				modalView.open(content);
				cartModel.clear();
				mainView.renderCartCounter(0);
				orderModel.clear();
			})
			.catch((err) => console.error('Ошибка отправки заказа:', err));
	} else {
		contactView.showError('email', 'Введите email');
		contactView.showError('phone', 'Введите телефон');
	}
});
