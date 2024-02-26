import React, { useEffect } from 'react';
import type { RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { removeAlert } from '../slices/alertSlice';

const Alert = () => {
    const dispatch = useDispatch();
    const alerts = useSelector((state: RootState) => state.alerts);

    const removeAlertHandler = (id: string) => {
        dispatch(removeAlert(id));
    }

    console.log('Alert is rendering');

    useEffect(() => {
        const alertTimeout = setTimeout(() => {
            if (alerts.length > 0) {
                removeAlertHandler(alerts[0].id);
            }
        }, 5000);
        return () => clearTimeout(alertTimeout);
    }, [alerts, removeAlertHandler]);

    return (
        <div className="fixed top-16 right-0 p-4 z-[100] w-1/4">
            {alerts.map((alert, index) => (
                <div
                    key={alert.id}
                    className={`alert-${alert.type} border-l-4 border-solid p-4 my-2 rounded shadow transform transition-transform duration-500`}
                >
                    {alert.message}
                </div>
            ))}
        </div>
    );
}

export default Alert;
