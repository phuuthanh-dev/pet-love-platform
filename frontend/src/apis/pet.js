import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { BASE_URL } from "@/configs/globalVariables";

export const submitPetAPI = async (formData) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/pets/submit`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getPetNotApprovedAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/pets/not-approved`);
};
export const getPetApprovedAPI = async (
  page,
  limit,
  sortBy = "createdAt:desc"
) => {
  const url = `${BASE_URL}/pets/approved?limit=${limit}&page=${page}&sortBy=${sortBy}`;
  const response = await authorizedAxiosInstance.get(url);
  return response;
};

export const updatePetAPI = async (petId, formData) => {
  console.log(petId);
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/pets/update/${petId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const approvePetAPI = async (petId) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/pets/approve/${petId}`
  );
};

export const getBreedsAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/pets/breeds`);
};

export const getBreedsByIdAPI = async (breedId) => {
  return await authorizedAxiosInstance.get(
    `${BASE_URL}/pets/breeds/${breedId}`
  );
};
export const getPetByIdAPI = async (breedId) => {
  return await authorizedAxiosInstance.get(
    `${BASE_URL}/pets/detail/${breedId}`
  );
};
export const getPetBySubmittedIdAPI = async (
  userId,
  page,
  limit,
  sortBy = "createdAt:desc"
) => {
  return await authorizedAxiosInstance.get(
    `${BASE_URL}/pets/submitted/${userId}?limit=${limit}&page=${page}&sortBy=${sortBy}`
  );
};


export const getPetsHomePage = async (page = 1, limit = 10) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/pets?page=${page}&limit=${limit}`);
}

export const getPetsHomePageQuery = async (queryParams) => {
  console.log(queryParams.toString());
  
  return await authorizedAxiosInstance.get(`${BASE_URL}/pets?${queryParams.toString()}`);
};

export const updatePetDonationGoal = async (petId, donationGoal) => {
  return await authorizedAxiosInstance.put(`${BASE_URL}/pets/${petId}/donation-goal`, { donationGoal });
}