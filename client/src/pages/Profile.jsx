import { FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  //we always dont need to upload the image the while editing
  //if the file is present check the file size
  const file = formData.get('avatar');
  if (file && file.size > 500000) {
    toast.error('image size > 5MB!!!!,should be less than 5mb');
    return null;
  }
  try {
    // file uploaded so send the formdata without converting it to json format
    await customFetch.patch('/users/update-user', formData);
    toast.success('Profile updated successfully');
  } catch (error) {
    toast(error?.response?.data?.msg);
  }
  return null;
};

const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, email, location } = user;

  return (
    <Wrapper>
      {/* encType - if there were file upload we need to give. */}
      <Form method='post' className='form' encType='multipart/form-data'>
        <h4 className='form-title'>profile</h4>
        <div className='form-center'>
          {/* fileinput */}
          <div className='form-row'>
            <label htmlFor='image' className='form-label'>
              Select an image file (max 0.5 MB):
            </label>
            <input type='file' id='avatar' name='avatar' className='form-input' accept='image/*' />
          </div>
          {/* forminput */}
          <FormRow type='text' name='name' defaultValue={name} />
          <FormRow type='text' labelText='last name' name='lastName' defaultValue={lastName} />
          <FormRow type='email' name='email' defaultValue={email} />
          <FormRow type='text' name='location' defaultValue={location} />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default Profile;
