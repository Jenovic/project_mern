import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { setShowEditModal } from '../../slices/globalSlice';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { Field } from '../../utils/interfaces';
import { format } from 'date-fns';
import Pagination from '../Pagination/Pagination';
import Loader from '../Loader';

interface EntityListProps {
    entityName: string;
    fetchSvc: (
        page: number,
        limit: number,
        locationFilter: string,
        classroomFilter: string
    ) => Promise<any>;
    loadEntities: (entities: any[]) => any;
    setEntityFields: (fields: []) => any;
    setEntitySubFields: (fields: []) => any;
    setLoading: (loading: boolean) => any;
    setSelectedEntity: (entity: any) => any;
    entitiesSelector: (state: RootState) => any[];
    loadingSelector: (state: RootState) => boolean;
    showFull: boolean;
    columns: { label: string, accessor: string }[];
    editComponent: React.FC;
}

const EntityList: React.FC<EntityListProps> = ({
    entityName,
    fetchSvc,
    loadEntities,
    setEntityFields,
    setEntitySubFields,
    setLoading,
    setSelectedEntity,
    entitiesSelector,
    loadingSelector,
    showFull,
    columns,
    editComponent: EditComponent
}) => {
    const dispatch = useDispatch();
    const entities = useSelector(entitiesSelector);
    const loading = useSelector(loadingSelector);
    const { locationFilter, classroomFilter } = useSelector((state: RootState) => state.global);
    const { user } = useSelector((state: RootState) => state.auth);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowIndex, setRowIndex] = useState(0);

    useEffect(() => {
        const loadEntityList = async () => {
            try {
                const res = await fetchSvc(locationFilter || classroomFilter ? 1 : page, 10, locationFilter, classroomFilter);
                loadEntities(res.data[`${entityName.toLowerCase()}s`]);
                setEntityFields(res.data.fieldTypes);

                const responsablesField = res.data.fieldTypes.find((field: Field) => field.name === 'responsables');
                if (responsablesField && responsablesField.subfields) {
                    setEntitySubFields(responsablesField.subfields);
                } else {
                    setEntitySubFields([]);
                }
                setTotalPages(res.data.pages);
            } catch (error: any) {
                const { errors } = error.response.data;
                if (Array.isArray(errors)) {
                    errors.map((err) => {
                        dispatch(setAlert({ id: uuidv4(), message: err.msg, type: 'error' }));
                    });
                } else {
                    dispatch(setAlert({ id: uuidv4(), message: error.msg, type: 'error' }));
                }
            } finally {
                setLoading(false);
                setRowIndex(0);
            }
        }
        loadEntityList();
        setSelectedEntity(null);
    }, [page, showFull, loading]);

    const handleRowSelect = (idx: number, entity: any) => {
        setRowIndex(idx);
        setSelectedEntity(entity);
    };

    const handleEditClick = () => {
        dispatch(setShowEditModal(true));
    };

    const displayedEntities = showFull ? entities : entities.slice(0, 5);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className='border-2 p-5 rounded mb-5'>
                    <h1 className='font-semibold uppercase pb-2'>{entityName}</h1>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr className='bg-sky-700 text-white'>
                                    <th scope="col" className="px-3 py-3">#</th>
                                    {columns.map((column) => (
                                        <th key={column.accessor} scope="col" className="px-3 py-3">{column.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`[&>*:nth-child(${rowIndex + 1})]:bg-sky-100`}>
                                {displayedEntities.map((entity, idx) => (
                                    <tr key={entity.id || idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 table-shadow" onClick={() => handleRowSelect(idx, entity)}>
                                        <td className="px-3">
                                            <span className='flex items-center relative'>
                                                <span className='pr-2'>{(page - 1) * 10 + idx + 1}</span>
                                                {entity.status === 'pending' && user?.role === 'staff' ? (
                                                    <div role="status" className='px-2 py-3'>
                                                        <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                        <span className="sr-only">Loading...</span>
                                                    </div>

                                                ) : (
                                                    <i
                                                        className="fa-regular fa-pen-to-square text-lg px-2 py-3 cursor-pointer hover:bg-sky-500 hover:text-white"
                                                        onClick={() => handleEditClick()}
                                                    ></i>
                                                )}
                                            </span>
                                        </td>
                                        {columns.map((column) => (
                                            <td key={`${entity.id}-${column.accessor}`} className="px-3">
                                                {Array.isArray(entity[column.accessor])
                                                    ? entity[column.accessor].map((item: any, i: number) => (
                                                        <div key={`${entity.id}-${column.accessor}-${i}`}>
                                                            {item.name} {item.surname} ({item.relationshipToStudent})
                                                        </div>
                                                    ))
                                                    : entity[column.accessor] instanceof Date
                                                        ? format(entity[column.accessor], 'MM/dd/yyyy') // Format the date
                                                        : typeof entity[column.accessor] === 'object' && entity[column.accessor] !== null
                                                            ? `${entity[column.accessor].name}` // Handle nested object, e.g., location
                                                            : entity[column.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination showFull={showFull} page={page} totalPages={totalPages} seeMoreURL={`/${entityName.toLowerCase()}s`} onPageChange={setPage} setLoading={setLoading} />
                    <EditComponent />
                </div>
            )}
        </>
    );
};

export default EntityList;
