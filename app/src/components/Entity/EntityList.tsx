import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { setShowEditModal } from '../../slices/globalSlice';
import { v4 as uuidv4 } from 'uuid';
import Pagination from '../Pagination/Pagination';
import Loader from '../Loader';
import { RootState } from '../../store';

interface EntityListProps {
    entityName: string;
    fetchSvc: (page: number) => Promise<any>;
    loadEntities: (entities: any[]) => any;
    setEntityFields: (fields: []) => any;
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowIndex, setRowIndex] = useState(0);

    useEffect(() => {
        const loadEntityList = async () => {
            try {
                const res = await fetchSvc(page);
                loadEntities(res.data[`${entityName.toLowerCase()}s`]);
                setEntityFields(res.data.fieldTypes);
                setTotalPages(res.data.pages);
            } catch (error: any) {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            } finally {
                setLoading(false);
                setRowIndex(0);
            }
        }
        loadEntityList();
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
                                    <tr key={entity.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 table-shadow" onClick={() => handleRowSelect(idx, entity)}>
                                        <td className="px-3">
                                            <span className='flex items-center relative'>
                                                <span className='pr-2'>{(page - 1) * 10 + idx + 1}</span>
                                                <i
                                                    className="fa-regular fa-pen-to-square text-lg px-2 py-3 cursor-pointer hover:bg-sky-500 hover:text-white"
                                                    onClick={() => handleEditClick()}
                                                ></i>
                                            </span>
                                        </td>
                                        {columns.map((column) => (
                                            <td key={`${entity.id}-${column.accessor}`} className="px-3">
                                                {Array.isArray(entity[column.accessor])
                                                    ? entity[column.accessor].map((item: any, i: number) => (
                                                        <div key={`${entity.id}-${column.accessor}-${i}`}>{item.name} {item.surname} ({item.relationshipToStudent})</div>
                                                    ))
                                                    : entity[column.accessor]
                                                }
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
