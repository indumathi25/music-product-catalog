import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface UiState {
    toasts: Toast[];
}

const initialState: UiState = {
    toasts: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            const id = Math.random().toString(36).substring(2, 9);
            state.toasts.push({ ...action.payload, id });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
    },
});

export const { addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
