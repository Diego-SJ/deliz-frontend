import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppSlice, Company, Tour } from './types';
import { Step } from 'react-joyride';
import customActions from './actions';
import { ONBOARDING_STEPS } from '@/constants/onboarding';

const initialState: AppSlice = {
  company: {
    company_id: '',
    name: '',
    logo_url: '',
    phone: '',
    email: '',
    address: '',
    theme: '',
    created_at: '',
    membership_id: 1,
  },
  navigation: {
    collapsed: false,
    menu: {
      activeItem: '',
      activeTitle: '',
    },
    mobile: { collapsed: false },
  },
  onboarding: {
    onboarding_id: null,
    step: ONBOARDING_STEPS.ONE,
    created_at: '',
    company_id: '',
    no_employees: 0,
    business_niche: '',
    no_branches: 0,
    is_ecommerce: false,
    status_id: null,
    owner_name: '',
    owner_last_name: '',
    accepted_terms: false,
    business_name: '',
    important_features: [],
  },
  tour: { run: false, stepIndex: 0, steps: [], tourActive: false },
  loading: false,
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setCompany: (state, action: PayloadAction<Partial<Company>>) => {
      state.company = { ...state.company, ...action.payload };
    },
    setNavigation: (
      state,
      action: PayloadAction<Partial<AppSlice['navigation']>>,
    ) => {
      state.navigation = { ...state.navigation, ...action.payload };
    },
    setMobileCollapsed: (state, action: PayloadAction<boolean>) => {
      if (!state?.navigation?.mobile?.collapsed) {
        state.navigation = {
          ...state.navigation,
          mobile: { collapsed: false },
        };
      }
      state.navigation.mobile.collapsed = action.payload;
    },
    setOnboarding: (
      state,
      action: PayloadAction<Partial<AppSlice['onboarding']>>,
    ) => {
      state.onboarding = { ...state.onboarding, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTourState: (state, action: PayloadAction<Partial<Tour>>) => {
      state.tour = {
        ...state.tour,
        ...action.payload,
        steps: state.tour?.steps as any,
      };
    },
  },
});

export const appActions = { ...app.actions, ...customActions };

export default app.reducer;
