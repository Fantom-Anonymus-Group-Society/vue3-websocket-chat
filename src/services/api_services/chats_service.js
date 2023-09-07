import axios from "axios";
import JwtService from "../jwt_service";
import {API_HOST} from '../../../env'

const API_URL = `${API_HOST}/api/chats/`

class ChatsService {
    async get_list() {
        return await axios
            .get(API_URL + '', {
                headers: JwtService.getTokenHeader()
              })
            .then(response => {
                return response.data
            });
    }

    async get_one({
        id = null,
    }){
        return await axios
            .get(API_URL + id, {
                headers: JwtService.getTokenHeader()
            })
            .then(response => {
                return response.data
            })
    }

    store(receiver_id){
        return axios
            .post(API_URL + '', {
                receiver_id: receiver_id
            }, {
                headers: JwtService.getTokenHeader()
            })
            .then(
                response => {
                    return response.data
                }
            )
    }

    destroy(id){
        return axios
            .delete(API_URL + id, {
                headers: JwtService.getTokenHeader()
            })
            .then(
                response => {
                    return response.data
                }
            )
    }
}

export default new ChatsService;
