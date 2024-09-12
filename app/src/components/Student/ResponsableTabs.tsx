import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import FormField from "../Form/FormField";
import { Responsable, Field } from "../../utils/interfaces";
import { relationshipOptions } from "../../utils/helpers";

interface ResponsableProps {
    responsables: Responsable[];
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    handleResponsableChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeleteResponsableClick: (name: any) => void;
    fields: Field[];
}

const ResponsableTabs: React.FC<ResponsableProps> = ({
    responsables,
    activeTab,
    setActiveTab,
    handleResponsableChange,
    handleDeleteResponsableClick,
    fields
}) => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <>
            <ul className="flex border-b">
                {responsables.map((responsable: Responsable, idx: number) => (
                    <li
                        key={responsable._id || idx} // Ensure unique key here
                        className={`mr-1 ${activeTab === idx ? 'border-l border-t border-r rounded-t' : ''}`}
                    >
                        <a
                            className={`bg-white inline-block py-2 px-4 font-semibold cursor-pointer ${activeTab === idx ? 'text-blue-500 hover:text-blue-800' : ''
                                }`}
                            onClick={() => setActiveTab(idx)}
                        >
                            {responsable.name} {responsable.surname}
                        </a>
                        <span
                            data-testid="delete"
                            className={`pr-4 ${user?.role !== 'staff' ? 'hover:cursor-pointer' : 'hover:cursor-not-allowed'}`}
                            onClick={user?.role !== 'staff' ? () => handleDeleteResponsableClick(responsable.name) : undefined}
                            aria-disabled={user.role === 'staff'}
                            title={`${user?.role !== 'staff' ? 'Delete the selected responsable' : 'Only an Admin user can perform this task'}`}
                        >
                            <i className="fa-solid fa-trash hover:text-sky-500"></i>
                        </span>
                    </li>
                ))}
            </ul >
            <div className="p-5 border-l border-r border-b">
                <div className="grid lg:grid-cols-2 lg:gap-x-5">
                    {responsables[activeTab] && (
                        <>
                            {fields.map((field) => (
                                <FormField
                                    key={field.name}
                                    field={field}
                                    value={responsables[activeTab][field.name as keyof Responsable]}
                                    onChange={handleResponsableChange}
                                    options={field.name === 'relationshipToStudent' ? relationshipOptions : undefined}
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
