import axios from 'axios';

export const creatAxios = (baseURL) => axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const createAPI = (axios, {serviceMethod, method, uri}) => (data = {}) => {
    const apiMethod = method || serviceMethod;
    return axios[apiMethod](`/${uri}`, data)
        .then(response => {

            if (response.status !== 200){
                throw new Error(`/${uri} returned status ${response.status}`)
            }

            return response.data; 
        })
        .catch(err => {
            console.error(err, `Request failed - ${apiMethod}`, data);
            return [];
        })
}