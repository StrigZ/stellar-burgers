import { describe, expect, test } from '@jest/globals';
import {
  addBun,
  addIngredient,
  burgerConstructorSlice,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './burger-constructor-slice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('Тестирует редьюсер слайса burgerConstructor', () => {
  const reducer = burgerConstructorSlice.reducer;

  const ingredient1: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };
  const ingredient2: TConstructorIngredient = {
    id: '643d69a5c3f7b9001cfa093f',
    _id: '643d69a5c3f7b9001cfa093f',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'https://code.s3.yandex.net/react/code/meat-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
  };

  const bun: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  test('инициализация редьюсера', () => {
    const newState = reducer(undefined, { type: '@@INIT' });

    expect(newState).toBeDefined();

    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
  test('обработка экшена добавления ингредиента', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    const newState = reducer(initialState, addIngredient(ingredient1));
    expect(newState).toEqual({ bun: null, ingredients: [ingredient1] });
  });
  test('обработка экшена добавления булки', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    const newState = reducer(initialState, addBun(bun));
    expect(newState).toEqual({ bun, ingredients: [] });
  });

  test('обработка экшена удаления ингредиента', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient1]
    };

    const newState = reducer(initialState, removeIngredient(ingredient1.id));
    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
  test('обработка экшена удаления несуществующего ингредиента', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient1]
    };

    const newState = reducer(initialState, removeIngredient('test'));
    expect(newState).toEqual({ bun: null, ingredients: [ingredient1] });
  });

  test('обработка экшена изменения порядка ингредиента', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient1]
    };

    const newState = reducer(initialState, moveIngredientUp(1));
    expect(newState).toEqual({
      bun: null,
      ingredients: [ingredient2, ingredient1, ingredient1]
    });

    const anotherNewState = reducer(newState, moveIngredientDown(0));
    expect(anotherNewState).toEqual({
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient1]
    });
  });
  test('обработка экшена изменения порядка ингредиента, краевые случаи', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient1]
    };

    //  поднимаем 1й элемент, ничего не должно произойти
    const newState = reducer(initialState, moveIngredientUp(0));
    expect(newState).toEqual({
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient1]
    });
    //  опускаем последний элемент, ничего не должно произойти
    const anotherNewState = reducer(newState, moveIngredientDown(2));
    expect(anotherNewState).toEqual({
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient1]
    });
  });

  test('очистка конструктора', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient1, ingredient2, ingredient1]
    };

    const newState = reducer(initialState, clearConstructor());
    expect(newState).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
