// src/store/printerSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import WebBluetoothReceiptPrinter from '@point-of-sale/webbluetooth-receipt-printer';
import { message } from 'antd';

// Variable de control para los event listeners
let eventListenersAdded = false;

interface PrinterState {
  receiptPrinter: WebBluetoothReceiptPrinter | null;
  device: { id: string; name: string; type: string; language: string } | null;
  isConnected: boolean;
  error: string | null;
}

const initialState: PrinterState = {
  receiptPrinter: null,
  isConnected: false,
  device: null,
  error: null,
};

// Acción asíncrona para conectar la impresora
export const connectPrinter = createAsyncThunk(
  'printer/connectPrinter',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as any;
      let receiptPrinter = state?.printer?.receiptPrinter;

      if (!Object.keys(receiptPrinter || {})?.length) {
        receiptPrinter = new WebBluetoothReceiptPrinter();
        console.log('receiptPrinter', receiptPrinter);
        dispatch(setReceiptPrinter(receiptPrinter));
      }

      if (true) {
        receiptPrinter.addEventListener('connected', (device: any) => {
          console.log('coneected', device);
          dispatch(setConnected(true));
          dispatch(setDevice(device));
        });

        receiptPrinter.addEventListener('disconnected', () => {
          dispatch(setConnected(false));
          dispatch(setDevice(null));
        });

        eventListenersAdded = true;
      }

      if (typeof receiptPrinter?.connect === 'function') {
        await receiptPrinter.connect();
        return receiptPrinter;
      }
      return null;
    } catch (error) {
      message.error('No se pudo conectar con la impresora', error as any);
      dispatch(setConnected(false));
      dispatch(setDevice(null));
      return rejectWithValue((error as any).message);
    }
  },
);

// Acción asíncrona para imprimir datos
export const printData = createAsyncThunk(
  'printer/printData',
  async (data: Uint8Array, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const receiptPrinter = state.printer.receiptPrinter;
      if (receiptPrinter && state.printer.isConnected) {
        receiptPrinter.print(data);
      } else {
        throw new Error('La impresora no está conectada');
      }
    } catch (error) {
      message.error('No se pudo imprimir el ticket');
      return rejectWithValue((error as any).message);
    }
  },
);

export const disconnectPrinter = createAsyncThunk('printer/disconnectPrinter', async (_, { getState, dispatch }) => {
  try {
    const state = getState() as any;
    const receiptPrinter = state?.printer?.receiptPrinter;

    // Método hipotético para desconectar
    if (receiptPrinter?.disconnect) {
      await receiptPrinter?.disconnect();
      receiptPrinter.removeEventListener('connected');
      receiptPrinter.removeEventListener('disconnected');
    }
    dispatch(setReceiptPrinter(null));
    dispatch(setConnected(false));
    dispatch(setDevice(null));

    // Restablecer el indicador
    eventListenersAdded = false;
  } catch (error) {
    console.log(error);
  }
});

const printerSlice = createSlice({
  name: 'printer',
  initialState,
  reducers: {
    setReceiptPrinter(state, action) {
      state.receiptPrinter = action.payload;
    },
    setConnected(state, action) {
      state.isConnected = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setDevice(state, action) {
      state.device = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectPrinter.fulfilled, (state) => {
        state.isConnected = true;
        state.error = null;
      })
      .addCase(connectPrinter.rejected, (state, action) => {
        state.isConnected = false;
        state.error = action.payload as string;
      })
      .addCase(printData.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(disconnectPrinter.fulfilled, (state) => {
        state.isConnected = false;
        state.error = null;
      })
      .addCase(disconnectPrinter.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setReceiptPrinter, setConnected, setError, setDevice } = printerSlice.actions;

export default printerSlice.reducer;
