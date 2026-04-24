import { baseURL } from "@/config";
import axios from "axios";

export const req = axios.create({
    headers: { 'Content-Type': 'Application/json' },
    baseURL: baseURL
});