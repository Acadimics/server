import { port, baseAPIRoute, version, APIs as serverApis } from '../server.config';
import { createAPI, creatAxios } from './axios';

const axios = creatAxios(`http://localhost:${port}${baseAPIRoute}/v${version}`);

const apis = serverApis.reduce((acc, {name, ...api}) => ({
        ...acc,
        [name]: createAPI(axios, api)
    }), {});

console.log(apis);

apis.mock = (data) =>  new Promise(resolve => setTimeout(() => {
    console.log(data);
    resolve(data);
}, 2000));

export default apis;