import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';

import {
  Routes,
  Route,
  useNavigate,
  Router,
  Outlet,
  useLocation
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/ingredients/ingredients-actions';
import { getIngredientsSelector } from '../../services/ingredients/ingredients-slice';
import { getUser } from '../../services/user/user-actions';
import { getUserSelector } from '../../services/user/user-slice';
import { OrderInfoModal } from '../order-info-modal';

const App = () => {
  const { loading: isIngredientsLoading, error } = useSelector(
    getIngredientsSelector
  );
  const { isUserChecked } = useSelector(getUserSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, []);

  const goBack = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading || !isUserChecked ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={location.state?.background ?? location}>
            <Route path='/'>
              <Route index element={<ConstructorPage />} />

              <Route path='feed' element={<Feed />} />

              <Route path='feed/:number' element={<OrderInfo />} />
              <Route path='ingredients/:id' element={<IngredientDetails />} />
              <Route
                path='profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <OrderInfo />
                  </ProtectedRoute>
                }
              />

              <Route
                path='login'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path='register'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path='forgot-password'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ForgotPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path='reset-password'
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />

              <Route path='profile'>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='orders'
                  element={
                    <ProtectedRoute>
                      <ProfileOrders />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path='*' element={<NotFound404 />} />
            </Route>
          </Routes>

          {location.state?.background && (
            <Routes>
              <Route
                path='ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={goBack}>
                    <IngredientDetails />
                  </Modal>
                }
              />

              <Route
                path='feed/:number'
                element={<OrderInfoModal onClose={goBack} />}
              />

              <Route
                path='profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <OrderInfoModal onClose={goBack} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
