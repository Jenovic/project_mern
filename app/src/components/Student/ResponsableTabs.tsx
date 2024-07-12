import FormField from "../Form/FormField";
import { Responsable } from "../../utils/interfaces";

const ResponsableTabs = ({ responsables, activeTab, setActiveTab, handleResponsableChange, handleDeleteResponsableClick }: any) => {
    return (
        <>
            <ul className="flex border-b">
                {responsables.map((responsable: Responsable, idx: number) => (
                    <li key={responsable._id} className={`mr-1 ${activeTab === idx ? 'border-l border-t border-r rounded-t' : ''}`}>
                        <a
                            className={`bg-white inline-block py-2 px-4 font-semibold cursor-pointer ${activeTab === idx ? 'text-blue-500 hover:text-blue-800' : ''}`}
                            onClick={() => setActiveTab(idx)}
                        >
                            {responsable.name} {responsable.surname}
                        </a>
                        <span className='pr-4 hover:cursor-pointer' onClick={() => handleDeleteResponsableClick(responsable.name)}><i className="fa-solid fa-trash hover:text-sky-500"></i></span>
                    </li>
                ))}
            </ul>
            <div className="p-5 border-l border-r border-b">
                <div className='grid lg:grid-cols-2 lg:gap-x-5'>
                    {responsables[activeTab] && (
                        <>
                            {['name', 'middleName', 'surname', 'relationshipToStudent', 'phoneNumber', 'address', 'email'].map(field => (
                                <FormField
                                    key={field}
                                    field={{ name: field, type: 'text', required: ['name', 'surname', 'relationshipToStudent'].includes(field) }}
                                    value={responsables[activeTab][field]}
                                    onChange={handleResponsableChange}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResponsableTabs;
