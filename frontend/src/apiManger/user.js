import AxiosInstance from ".";

const uploadImage = async (formData) => {
  return await AxiosInstance.post("/user/upload-photo", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getUser = async () => {
  return await AxiosInstance.get("/user");
};

const updateUser = async (data) => {
  return await AxiosInstance.put("/user/update-profile", data);
};

// Get user profile with ratings and achievements
const getUserProfile = async (userId) => {
  const url = userId ? `/user/profile/${userId}` : "/user/profile";
  return await AxiosInstance.get(url);
};

const userAPI = { uploadImage, getUser, updateUser, getUserProfile };

export default userAPI;
