import axios from "axios";
import JwtService from "../jwt_service";
import {API_HOST} from '../../../env'

const API_URL = `${API_HOST}/api/messages/`

class MessagesService {
    async get_list(chat_id) {
        return await axios
            .get(API_URL + chat_id, {
                headers: JwtService.getTokenHeader()
              })
            .then(response => {
                return response.data
            });
    }

    store({
        chat_id = null,
        content = null
    }){
        return axios
            .post(API_URL + chat_id, {
                content: content
            }, {
                headers: JwtService.getTokenHeader()
            })
            .then(
                response => {
                    return response.data
                }
            )
    }

    destroy({
        chat_id = null,
        id = null
    }){
        return axios
            .delete(API_URL + `${chat_id}/${id}`, {
                headers: JwtService.getTokenHeader()
            })
            .then(
                response => {
                    return response.data
                }
            )
    }
}

export default new MessagesService;
