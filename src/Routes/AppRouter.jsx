import React from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import Login from '../Pages/Login'
import TenantDashboard from '../Pages/TenantDashboard'
import ReportIssue from '../Pages/ReportIssue'
import LandlordDashboard from '../Pages/LandlordDashboard'
import TicketQueue from '../Pages/TicketQueue'

const AppLayout = () => {
    return (
        
        <div className = 'app-layout'>
            <main className = 'content-container'>
                <Outlet/>
            </main>
        </div>
    );
};


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    
    {
        path: 'tenant',
        element: <AppLayout/>,

        children= [
            {
                index: true,
                element: <TenantDashboard/>
            },
            {
                path: 'report',
                element: <ReportIssue/>
            },
        ],

    },

    {
        path: '/landlord',
        element: <AppLayout/>,
        children: [
            {
                index: true,
                element: <LandlordDashboard/>
            },

            {

            path: 'queue',
            element: <TicketQueue/>

            },

        ],
    },

    {
        path: '*',
        element: (
            <div className='error-container'>
                <h2 className='error-heading'>404 Page Not Found</h2>
                <p className='error-message'>The page you're looking for could not be found.</p>
            </div>
        ),
    },
]);
  