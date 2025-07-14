export const apiurl = "https://construction-aqri.onrender.com/api/";
export const fileurl = "https://construction-aqri.onrender.com/";
export const token = () => {
  const userInfo = localStorage.getItem("userInfo");
  const data = JSON.parse(userInfo);
  return data.token;
};
