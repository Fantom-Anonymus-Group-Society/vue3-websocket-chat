import axios from "axios";
import JwtService from "../jwt_service";
import {API_HOST} from '../../../env'

const API_URL = `${API_HOST}/api/users/`

class UsersService {
    async get_list() {
        return await axios
            .get(API_URL + '', {
                headers: JwtService.getTokenHeader()
              })
            .then(response => {
                return response.data
            });
    }
}

export default new UsersService;
