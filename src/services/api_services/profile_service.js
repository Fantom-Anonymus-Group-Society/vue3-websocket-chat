import axios from "axios";
import {API_HOST} from '../../../env'
import JwtService from "../jwt_service";

const API_URL = `${API_HOST}/api/auth/`

class ProfileService {
    async get_me() {
        return await axios
            .get(API_URL + 'me', {headers: JwtService.getTokenHeader()})
            .then(response => {
                return response.data
            });
    }

    update_me({
        first_name=null,
        last_name=null,
        username=null,
        password=null,
    }) {
        let params = {}
        if(first_name != null){
            params.first_name = first_name
        }
        if(last_name != null){
            params.last_name = last_name
        }
        if(username != null){
            params.username = username
        }
        if(password != null){
            params.password = password
        }
        return axios
            .patch(API_URL + 'me', 
                {params},
                {headers: JwtService.getTokenHeader()}
            )
            .then(response => {
                return response.data
            })
    }
}

export default new ProfileService;
