import requestClient from '../../apiManager/interceptors'

export const GET_NOTIFICATION = 'GET_NOTIFICATION';
export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION';

export const getNotification = () => (dispatch) => {
  requestClient.get('/api/notification').then((res) => {
    dispatch({
      type: GET_NOTIFICATION,
      payload: res.data,
    });
  });
};

export const deleteNotification = (id) => (dispatch) => {
  requestClient.post('/api/notification/delete', { id }).then((res) => {
    dispatch({
      type: DELETE_NOTIFICATION,
      payload: res.data,
    });
  });
};

export const deleteAllNotification = () => (dispatch) => {
  requestClient.post('/api/notification/delete-all').then((res) => {
    dispatch({
      type: DELETE_ALL_NOTIFICATION,
      payload: res.data,
    });
  });
};

export const createNotification = (notification) => (dispatch) => {
  requestClient.post('/api/notification/add', { notification }).then((res) => {
    dispatch({
      type: CREATE_NOTIFICATION,
      payload: res.data,
    });
  });
};
