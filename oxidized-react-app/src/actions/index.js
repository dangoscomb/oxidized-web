import axios from 'axios';
import {POPULATE_NODES} from "../constants/action-types";

const apiUrl = 'http://oxidized.hso-group.net:8888/';

export const getNodes = () => {
    return (dispatch) => {
        return axios.get(`${apiUrl}nodes.json`)
            .then(response => {
                dispatch({
                    type: POPULATE_NODES,
                    payload: response.data
                })
            })
            .catch(error => {
                throw(error);
            });
    };
};