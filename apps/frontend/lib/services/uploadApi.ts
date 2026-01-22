import { baseApi } from './api';

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    public_id: string;
  };
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
