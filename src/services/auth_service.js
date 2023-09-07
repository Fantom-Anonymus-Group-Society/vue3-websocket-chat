import axios from "axios";
import JwtService from "./jwt_service";
import {API_HOST} from '../../env'

const API_URL = `${API_HOST}/api/auth/`

class AuthService {
    login(user) {
        return axios
            .post(API_URL + 'login', {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.token) {
                    let parsedToken = response.data.token.replace('Bearer ','')
                    JwtService.storeToken(parsedToken)
                }
                return response.data
            });
    }

    logout(){
        JwtService.deleteToken()
    }

    register(user){
        return axios
            .post(API_URL + 'register', {
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                password: user.password,
                confirmation: user.confirmation
            })
    }
}

export default new AuthService;
