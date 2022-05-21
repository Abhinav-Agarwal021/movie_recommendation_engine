import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
})

//sends otp
export const sendOtp = (data) => api.post('/api/send-otp', data);

//verifies otp
export const verifyOtp = (data) => api.post('/api/verify-otp', data);

//activates user
export const activateUser = (data) => api.post('/api/activate-user', data);

//user logout
export const logout = () => api.post('/api/logout')

//user data using phone number
export const getUsBD = (data) => api.get('/api/userData', { params: { phone: data } });

//creates a room(dm or personal server)
export const createRoom = (data) => api.post('/api/rooms', data)

//update members of rooms
export const updateRoom = (data) => api.post('/api/updateRoom', data);

//get rooms using user id (user being the member of the rooms are fetched)
export const getRs = (id) => api.get(`/api/rooms/${id}`)

//rooms fetched using room id
export const getRId = (id) => api.get(`/api/room/${id}`)

//sends conversation list
export const sendCList = (data) => api.post('/api/chat', data);

//check user in conversation
export const checkCList = (data) => api.post('/api/check', data);

//fetching conversations using user id
export const getCs = (data) => api.get(`/api/chat/${data}`)

//fetching conversations using conversation id
export const getCsBId = (data) => api.get(`/api/conv/${data}`);

//fetch users using user id
export const getUs = (id) => api.get(`/api/user/${id}`)


api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest.isRetry = true;
            try {
                await axios.get(
                    "http://localhost:5000/api/refresh",
                    {
                        withCredentials: true,
                    }
                );

                return api.request(originalRequest);

            } catch (err) {
                console.log(err.message);
            }
        }
        throw error;
    }
);

export default api;