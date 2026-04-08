import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { getFeedSelector } from '../../services/feed/feed-slice';
import { useDispatch, useSelector } from '../../services/store';
import { getFeed } from '../../services/feed/feed-actions';

export const Feed: FC = () => {
  const {
    data: { orders },
    loading: isFeedLoading,
    error
  } = useSelector(getFeedSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, []);

  if (isFeedLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-default'>{error}</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeed())} />;
};
