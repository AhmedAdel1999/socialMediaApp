import { io } from 'socket.io-client';
const url="https://facebookeappapi.herokuapp.com/"
const socket = io(url);

export default socket;