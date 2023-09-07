import { Outlet, redirect, useNavigate, useNavigation } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar, Loading } from '../components';
import { createContext, useContext, useEffect, useState } from 'react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  }
};
//getting the cookie details through react router
export const loader = queryClient => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect('/');
  }
};

//create context
const DashboardContext = createContext();

const Dashboard = ({ checkDefaultTheme, queryClient }) => {
  //to get the loaderdata
  // const { user } = useLoaderData();
  const { user } = useQuery(userQuery)?.data;
  //to know the state if the page
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarktheme, setisDarktheme] = useState(checkDefaultTheme);
  const [isAuthError, setIsAuthError] = useState(false);

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
    await customFetch.get('/auth/logout');
    queryClient.invalidateQueries(['user']);
    toast.success('Logging out.....');
    navigate('/');
  };

  // this helps to avoid the users loggedin in the app even after a logout
  customFetch.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError]);

  return (
    <DashboardContext.Provider value={{ user, showSidebar, isDarktheme, toggleDarkTheme, toggleSidebar, logoutUser }}>
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>{isPageLoading ? <Loading /> : <Outlet context={{ user }} />}</div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

//global context
export const useDashboardContext = () => useContext(DashboardContext);
export default Dashboard;
