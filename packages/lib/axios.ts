import axios from 'axios';

export const service = axios.create({
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  }
});