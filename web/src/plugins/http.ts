import axios from "axios";
import Vue from 'vue';
import CommonInformation from "@/store/modules/CommonInformation"; 

import createAuthRefreshInterceptor from 'axios-auth-refresh';

const refreshAuthLogic = failedRequest => axios.get('api/auth/tokens').then(tokenRefreshResponse => {
    
    console.log(CommonInformation);
    localStorage.setItem('token', tokenRefreshResponse.data.access_token);
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.access_token;
    return Promise.resolve();
}).catch((error) => {
    location.replace('/api/auth/login?redirectUri=%2Fapi');
});

function configureInstance(){
    createAuthRefreshInterceptor(axios, refreshAuthLogic);    
    return axios
}


const httpInstance = configureInstance();
export default {
    install () {
        Vue.prototype.$http = httpInstance
    }
};