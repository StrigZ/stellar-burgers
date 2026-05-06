import {
  TIngredientsResponse,
  TUserResponse,
  TNewOrderResponse
} from '../../src/utils/burger-api';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').as('ingredients');
    cy.fixture('order.json').as('order');
    cy.fixture('user.json').as('user');

    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'it-refresh');
      win.document.cookie = 'accessToken=Bearer it-access; path=/';
    });

    cy.intercept<TIngredientsResponse>('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept<TUserResponse>('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept<TNewOrderResponse>('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('postOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет выбранную булку в конструктор', () => {
    cy.get<TIngredientsResponse>('@ingredients').then(
      ({ data: ingredients }) => {
        const bun = ingredients.find((i) => i.type === 'bun');
        if (!bun) {
          throw new Error('Булка не найдена в моковых данных');
        }

        cy.get(`[data-testid="ingredient-${bun._id}"]`)
          .contains('button', 'Добавить')
          .click();

        cy.get(`[data-testid="burger-constructor-bun-top"]`).should(
          'contain',
          bun.name
        );

        cy.get(`[data-testid="burger-constructor-bun-bottom"]`).should(
          'contain',
          bun.name
        );
      }
    );
  });

  it('добавляет начинку в конструктор', () => {
    cy.get<TIngredientsResponse>('@ingredients').then(
      ({ data: ingredients }) => {
        const main = ingredients.find((i) => i.type === 'main');
        if (!main) {
          throw new Error('Начинка не найдена в моковых данных');
        }
        cy.get(`[data-testid="ingredient-${main._id}"]`)
          .contains('button', 'Добавить')
          .click();

        cy.get('[data-testid="burger-constructor-main"]').should(
          'contain',
          main?.name
        );
      }
    );
  });

  it('открывает модальное окно ингредиента по клику', () => {
    cy.get<TIngredientsResponse>('@ingredients').then(
      ({ data: ingredients }) => {
        const bun = ingredients.find((i) => i.type === 'bun');
        cy.get(`[data-testid="ingredient-${bun?._id}"]`).click();
        cy.get('[data-testid="modal"]').should('be.visible');
        cy.get('[data-testid="modal-content"]').should('contain', bun?.name);
      }
    );
  });

  it('закрывает модальное окно по клику на крестик', () => {
    cy.get<TIngredientsResponse>('@ingredients').then(
      ({ data: ingredients }) => {
        cy.get(`[data-testid="ingredient-${ingredients[0]?._id}"]`).click();
        cy.get('[data-testid="modal"]').should('be.visible');

        cy.get('[data-testid="modal-close-btn"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
      }
    );
  });

  it('закрывает модальное окно по клику на оверлей', () => {
    cy.get<TIngredientsResponse>('@ingredients').then(
      ({ data: ingredients }) => {
        cy.get(`[data-testid="ingredient-${ingredients[0]?._id}"]`).click();
        cy.get('[data-testid="modal"]').should('be.visible');

        cy.get('[data-testid="modal-overlay"]').click({ force: true });
        cy.get('[data-testid="modal"]').should('not.exist');
      }
    );
  });

  it('оформляет заказ и проверяет его номер, затем очищает конструктор', () => {
    // Добавляем ингредиенты в конструктор
    cy.get<TIngredientsResponse>('@ingredients').then(
      ({ data: ingredients }) => {
        const bun = ingredients.find((i) => i.type === 'bun');
        const main = ingredients.find((i) => i.type === 'main');
        if (!bun) {
          throw new Error('Булка не найдена в моковых данных');
        }
        if (!main) {
          throw new Error('Начинка не найдена в моковых данных');
        }

        cy.get(`[data-testid="ingredient-${bun._id}"]`)
          .contains('button', 'Добавить')
          .click();

        cy.get(`[data-testid="ingredient-${main._id}"]`)
          .contains('button', 'Добавить')
          .click();
      }
    );

    // Жмем на кнопку заказать
    cy.get('[data-testid="order-button"]').should('be.enabled').click();

    // Дожидаемся postOrder
    cy.wait('@postOrder');

    // Открывается модалка
    cy.get('[data-testid="modal"]').should('be.visible');

    // В модалке должен быть номер заказа
    cy.get<TNewOrderResponse>('@order').then(({ order }) => {
      cy.get('[data-testid="modal-content"]').should(
        'contain',
        order.number.toString()
      );
    });

    // Закрываем модалку
    cy.get('[data-testid="modal-close-btn"]').click();

    // Проверяем, что конструктр пустой
    cy.get('[data-testid="burger-constructor-bun-top"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-testid="burger-constructor-bun-bottom"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-testid="burger-constructor-main"]').should(
      'contain',
      'Выберите начинку'
    );
  });
});
