/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from '../redux/chatSlice';
import { setNotifications } from '../redux/rtnSlice';
import { BASE_WS } from '../configs/globalVariables';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io(BASE_WS, {
        query: {
          userId: user?.id,
        },
        transports: ["websocket"],
      });

      setSocket(socketio);

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        console.log(notification);
        
        dispatch(setNotifications(notification));
      });

      return () => {
        socketio.close();
        setSocket(null);
      };
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};