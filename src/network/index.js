import axios from "axios"
import { api_url } from "@/utils"

export default function request() {
    const instance = axios.create({
        baseURL: api_url,
        timeout: 10000,
        // headers: {
        //     "Real-Origin": "zndex.com"
        // }
    })
    return instance
}