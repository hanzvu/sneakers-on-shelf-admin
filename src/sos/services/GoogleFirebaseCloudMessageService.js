import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { BASE_API, firebaseConfig } from './ApplicationConstant';
import store from '../redux/store';
import { addNotification, clearNotifications, markNotificationAsRead } from '../redux/notificationSlice';

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = async () => {
    const token = await getToken(messaging, { vapidKey: 'BAIQguBPV-SkhPX7T40ygfE6cEdMfyhVdgk-Z5BmACYF54-FfWp_WWCSeXXd7S-yk0hLj7Xps3aGpomr70Tbgl0' });
    return token;
}

export const onMessageListener = () => (
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    })
)

export const subscribeNotification = async () => {
    const token = await fetchToken();
    const response = axios.post(`${BASE_API}/admin/v1/notifications/subscribe`, token, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
    return response;
}

export const addNotificationToStore = (data) => {
    store.dispatch(addNotification({
        id: data.messageId,
        title: data.notification.title,
        description: data.notification.body,
        avatar: null,
        type: data.data.type,
        link: data.data.link,
        createdAt: new Date().getTime(),
        isUnRead: true,
    }))
}

export const markNotificationAsReadById = id => {
    store.dispatch(markNotificationAsRead({ id }));
}

export const removeAllNotification = () => {
    store.dispatch(clearNotifications());
}