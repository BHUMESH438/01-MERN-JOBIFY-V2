import { useQuery } from '@tanstack/react-query';
import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';

const statsQuery = {
  queryKey: ['stats'],
  queryFn: async () => {
    const response = await customFetch.get('/jobs/stats');
    return response.data;
  }
};
//with the help of the loader we prefetch the data
//technically we ensurethat  the querydata is from the stats as we fetch the data from the stats and through the loader component from router we pass the queryclient function to pass the queryclient function
//passing fun as arg from the loader to ensuer the stale time and query options
//so use query will finally use the query and the default stale time
export const loader = queryClient => async () => {
  const data = await queryClient.ensureQueryData(statsQuery);
  return data;
};

const Stats = () => {
  const { data } = useQuery(statsQuery);
  const { defaultStats, monthlyApplications } = data;
  console.log(monthlyApplications.length);
  // const { defaultStats, monthlyApplications } = useLoaderData();
  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && <ChartsContainer data={monthlyApplications} />}
    </>
  );
};
export default Stats;
