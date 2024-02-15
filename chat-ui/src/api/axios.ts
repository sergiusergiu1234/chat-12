import axios from 'axios';
const BASE_URL = 'https://chats-12-7c193ee8b202.herokuapp.com/'

export default axios.create({
    baseURL: `${BASE_URL}`
});

export const axiosPrivate = axios.create({
    url: `${BASE_URL}`
    ,
    headers:{
        'Content-type' :'application/json',
    },
});