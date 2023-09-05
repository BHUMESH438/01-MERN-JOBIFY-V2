import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar } from '../components';
import { createContext, useContext, useState } from 'react';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

//getting the cookie details through react router
export const loader = async () => {
  try {
    const { data } = await customFetch('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

//create context
const DashboardContext = createContext();

const Dashboard = () => {
  const { user } = useLoaderData();

  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarktheme, setisDarktheme] = useState(checkDefaultTheme());

  const toggleDarkTheme = () => {
    const newdarktheme = !isDarktheme;
    setisDarktheme(newdarktheme);
    document.body.classList.toggle('dark-theme', newdarktheme);
    //passing as string
    localStorage.setItem('darkTheme', newdarktheme);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  //logout is a getreq from  client
  const logoutUser = async () => {
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logging out.....');
  };
  return (
    <DashboardContext.Provider value={{ user, showSidebar, isDarktheme, toggleDarkTheme, toggleSidebar, logoutUser }}>
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

//global context
export const useDashboardContext = () => useContext(DashboardContext);
export default Dashboard;
