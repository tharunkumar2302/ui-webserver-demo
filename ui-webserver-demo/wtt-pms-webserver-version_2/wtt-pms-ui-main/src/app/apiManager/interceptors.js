import React from "react";
import ReactDom from "react-dom";
import { localStorageAccessToken } from 'app/utils/constant';
import axios from 'axios';
import API from './endpoints';
import { authenticateError } from 'app/utils/constantForms';
import { authenticateMessage } from 'app/utils/constantForms';
import AlertMsg from '../components/AlertMsg/AlertMsg'

const requestClient = axios.create();

const handleClose = () => {
  document.getElementById('alert').style.display = 'none';
}

requestClient.interceptors.request.use(request => {
  if (localStorageAccessToken()) {
    request.headers.Authorization = `Bearer ${localStorageAccessToken()}`
  }

  return request;
});

requestClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // comment- When token expires
    if (error.response.data.message === authenticateError) {
      ReactDom.render(
        <AlertMsg
          open={true}
          severity="error"
          handle={handleClose}
          Msg={authenticateMessage}
        />,
        document.getElementById('authenticateError')
      )

      document.getElementById('alert').style.display = 'flex';
      window.location.href = `${API.SESSION_API}/signin`;
    }
    return Promise.reject((error.response && error.response?.data) || 'Something went wrong!')
  }
);

export default requestClient;
