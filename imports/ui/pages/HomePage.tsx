import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';

export const HomePage = () => <Navigate to={AppUrl.Movements} />;
