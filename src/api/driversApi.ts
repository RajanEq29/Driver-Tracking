import localData from '../../data.json';

export interface RandomUserResult {
  name: { first: string; last: string };
  email: string;
  phone: string;
  picture: { large: string; medium: string; thumbnail: string };
  login: { uuid: string };
  location: {
    coordinates: { latitude: string; longitude: string };
  };
}

export interface RandomUserResponse {
  results: RandomUserResult[];
}


export const fetchDrivers = async (count: number = 10): Promise<RandomUserResponse> => {
  // Using local data.json since the API is down
  return localData as RandomUserResponse;

  // const response = await axios.get<RandomUserResponse>(
  //   https://randomuser.me/api/?results=${count}
  // );
  // return response.data;
};