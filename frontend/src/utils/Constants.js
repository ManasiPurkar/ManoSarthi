export const BASE_URL = "http://192.168.169.199:9090/";
export const getToken = () => {
  return localStorage.getItem("JWT");
};

export const getUserId = () => {
  return localStorage.getItem("User_Id");
};
