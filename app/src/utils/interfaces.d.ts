export interface Field {
    name: string;
    type: string;
    required: boolean;
    subfields?: Field[];
}

export interface FormData {
    name?: string;
    middleName?: string;
    surname?: string;
    dob?: string;
    address?: string;
    phoneNumber?: string;
    responsables?: Responsable[];
}

export interface Responsable {
    name?: string;
    middleName?: string;
    surname?: string;
    phoneNumber?: string;
    address?: string;
    email?: string;
    relationshipToStudent?: string;
    _id?: string;
}