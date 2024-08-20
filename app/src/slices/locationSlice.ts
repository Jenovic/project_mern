import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
    _id?: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
}

interface LocationState {
    locations: Location[];
}

const initialState: LocationState = {
    locations: [],
}

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        loadLocations: (state, action: PayloadAction<Location[]>) => {
            return {
                ...state,
                locations: action.payload
            }
        }
    },
});

export const { loadLocations } = locationSlice.actions;

export default locationSlice.reducer;