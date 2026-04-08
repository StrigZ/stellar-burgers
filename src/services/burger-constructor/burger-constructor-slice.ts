import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { makeOrder } from '../order/order-actions';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const newIngredients = [...state.ingredients];
        [newIngredients[index - 1], newIngredients[index]] = [
          newIngredients[index],
          newIngredients[index - 1]
        ];
        state.ingredients = newIngredients;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const newIngredients = [...state.ingredients];
        [newIngredients[index], newIngredients[index + 1]] = [
          newIngredients[index + 1],
          newIngredients[index]
        ];
        state.ingredients = newIngredients;
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBurgerConstructorSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder.addCase(makeOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const {
  addBun,
  addIngredient,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} = burgerConstructorSlice.actions;

export const { getBurgerConstructorSelector } =
  burgerConstructorSlice.selectors;
