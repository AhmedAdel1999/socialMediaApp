import { io } from 'socket.io-client';
const url="https://facebookcloneapi.onrender.com/"
const socket = io(url);

export default socket;