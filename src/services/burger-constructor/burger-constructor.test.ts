import { describe, expect, test } from '@jest/globals';
import {
  addBun,
  addIngredient,
  burgerConstructorSlice,
  clearConstructor,
  initialState,
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

    expect(newState).toEqual(initialState);
  });
  test('обработка экшена добавления ингредиента', () => {
    const newState = reducer(initialState, addIngredient(mockIngredients[0]));
    expect(newState).toEqual({ bun: null, ingredients: [mockIngredients[0]] });
  });
  test('обработка экшена добавления булки', () => {
    const newState = reducer(initialState, addBun(mockBun));
    expect(newState).toEqual({ bun: mockBun, ingredients: [] });
  });

  test('обработка экшена удаления ингредиента', () => {
    const testState = {
      bun: null,
      ingredients: [mockIngredients[0]]
    };

    const newState = reducer(
      testState,
      removeIngredient(mockIngredients[0].id)
    );
    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
  test('обработка экшена удаления несуществующего ингредиента', () => {
    const testState = {
      bun: null,
      ingredients: [mockIngredients[0]]
    };

    const newState = reducer(testState, removeIngredient('test'));
    expect(newState).toEqual({ bun: null, ingredients: [mockIngredients[0]] });
  });

  test('обработка экшена изменения порядка ингредиента', () => {
    const testState = {
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    };

    const newState = reducer(testState, moveIngredientUp(1));
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
    const testState = {
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    };

    //  поднимаем 1й элемент, ничего не должно произойти
    const newState = reducer(testState, moveIngredientUp(0));
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
    const testState = {
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[0]]
    };

    const newState = reducer(testState, clearConstructor());
    expect(newState).toEqual(initialState);
  });
});
