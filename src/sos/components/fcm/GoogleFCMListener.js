import { useEffect } from "react";
import { showSnackbar } from "../../services/NotificationService";
import { addNotificationToStore, onMessageListener, subscribeNotification } from "../../services/GoogleFirebaseCloudMessageService";

export default function GoogleFCMListener() {
    useEffect(() => {
        subscribeNotification().catch(error => {
            console.log(error);
            showSnackbar('Gặp sự cố kết nối với máy chủ thông báo.', 'warning');
        });
    }, [])

    useEffect(() => {
        onMessageListener().then(payload => {
            addNotificationToStore(payload)
        }).catch(err => console.log('failed: ', err));
    })

    return null;
}