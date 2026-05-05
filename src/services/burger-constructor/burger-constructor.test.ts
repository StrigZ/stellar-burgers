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
import mockBun from '../../../mocks/bun.json';
import mockIngredients from '../../../mocks/ingredients.json';

describe('Тестирует редьюсер слайса burgerConstructor', () => {
  const reducer = burgerConstructorSlice.reducer;

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

    const newState = reducer(initialState, addIngredient(mockIngredients[0]));
    expect(newState).toEqual({ bun: null, ingredients: [mockIngredients[0]] });
  });
  test('обработка экшена добавления булки', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    const newState = reducer(initialState, addBun(mockBun));
    expect(newState).toEqual({ bun: mockBun, ingredients: [] });
  });

  test('обработка экшена удаления ингредиента', () => {
    const initialState = {
      bun: null,
      ingredients: [mockIngredients[0]]
    };

    const newState = reducer(
      initialState,
      removeIngredient(mockIngredients[0].id)
    );
    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
  test('обработка экшена удаления несуществующего ингредиента', () => {
    const initialState = {
      bun: null,
      ingredients: [mockIngredients[0]]
    };

    const newState = reducer(initialState, removeIngredient('test'));
    expect(newState).toEqual({ bun: null, ingredients: [mockIngredients[0]] });
  });

  test('обработка экшена изменения порядка ингредиента', () => {
    const initialState = {
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    };

    const newState = reducer(initialState, moveIngredientUp(1));
    expect(newState).toEqual({
      bun: null,
      ingredients: [mockIngredients[1], mockIngredients[0], mockIngredients[0]]
    });

    const anotherNewState = reducer(newState, moveIngredientDown(0));
    expect(anotherNewState).toEqual({
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    });
  });
  test('обработка экшена изменения порядка ингредиента, краевые случаи', () => {
    const initialState = {
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    };

    //  поднимаем 1й элемент, ничего не должно произойти
    const newState = reducer(initialState, moveIngredientUp(0));
    expect(newState).toEqual({
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    });
    //  опускаем последний элемент, ничего не должно произойти
    const anotherNewState = reducer(newState, moveIngredientDown(2));
    expect(anotherNewState).toEqual({
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    });
  });

  test('очистка конструктора', () => {
    const initialState = {
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    };

    const newState = reducer(initialState, clearConstructor());
    expect(newState).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
