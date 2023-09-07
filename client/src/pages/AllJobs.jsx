import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useContext, createContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const allJobsQuery = params => {
  const { search, jobStatus, jobType, sort, page } = params;
  return {
    queryKey: ['jobs', search ?? '', jobStatus ?? 'all', jobType ?? 'all', sort ?? 'newest', page ?? 1],
    queryFn: async () => {
      const { data } = await customFetch('/jobs', { params });
      return data;
    }
  };
};

export const loader =
  queryClient =>
  async ({ request }) => {
    const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
    await queryClient.ensureQueryData(allJobsQuery(params));
    return { searchValues: { ...params } };
  };

const AlljobsContext = createContext();

const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allJobsQuery(searchValues));

  return (
    <AlljobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AlljobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AlljobsContext);
export default AllJobs;
