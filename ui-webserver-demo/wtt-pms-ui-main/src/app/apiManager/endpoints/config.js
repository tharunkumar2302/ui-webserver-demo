export const REACT_APP_SERVICE_URL =
    (window._env_ && window._env_.REACT_APP_PATH) ||
    process.env.REACT_APP_PATH;

export const REACT_APP_SYSTEM_URL =
    (window._env_ && window._env_.REACT_APP_PATH_SYSTEM) ||
    process.env.REACT_APP_PATH_SYSTEM;

export const REACT_APP_PROJECT_ENV =
    (window._env_ && window._env_.REACT_APP_Project_Env) ||
    process.env.REACT_APP_Project_Env;