import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUpdateDisabled } from '../slices/studentSlice';
import { RootState } from '../store';
import { formatDate } from '../utils/helpers';
import { Field, FormData } from '../utils/interfaces';
import { useLocation } from 'react-router-dom';

export const useFormState = (selectedEntity: any, fields: Field[]) => {
    const [formData, setFormData] = useState<FormData>({});
    const [filteredFields, setFilteredFields] = useState<Field[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedEntity) {
            const initialFormData = {
                ...selectedEntity,
                dob: selectedEntity.dob ? formatDate(selectedEntity.dob) : '',
            };
            setFormData(initialFormData);
        }
    }, [selectedEntity]);

    useEffect(() => {
        if (selectedEntity) {
            const filtered = fields.filter(field => !['__v', 'responsables'].includes(field.name));
            setFilteredFields(filtered);
        }
    }, [selectedEntity, fields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        dispatch(setUpdateDisabled(false));
    };

    return { formData, setFormData, filteredFields, handleChange };
};

export const useModalState = () => {
    const { showEditModal, updateDisabled } = useSelector((state: RootState) => state.global);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [showResponsableNotifModal, setShowResponsableNotifModal] = useState(false);

    const handleCloseNotifModal = () => {
        setShowNotifModal(false);
    };

    const handleCloseResponsableModal = () => {
        setShowResponsableNotifModal(false);
    };

    return {
        showEditModal,
        updateDisabled,
        showNotifModal,
        showResponsableNotifModal,
        setShowNotifModal,
        setShowResponsableNotifModal,
        handleCloseNotifModal,
        handleCloseResponsableModal
    };
};

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
