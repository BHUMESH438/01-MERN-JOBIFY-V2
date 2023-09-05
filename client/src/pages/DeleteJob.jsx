import { redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

//here we either return the redirect
export async function action({ params }) {
  try {
    await customFetch.delete(`/jobs/${params.id}`);
    toast.success(`job deleted successfully`);
  } catch (error) {
    toast.error(error.response.data.msg);
  }
  return redirect('/dashboard/all-jobs');
}
