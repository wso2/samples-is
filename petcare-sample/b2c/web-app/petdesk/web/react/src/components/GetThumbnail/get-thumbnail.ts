import { getPetInstance } from "../CreatePet/instance";

export async function getThumbnail(accessToken: string, petId: string) {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'accept': `*/*`,
    };

    const response = await getPetInstance().get("/pets/" + petId + "/thumbnail" , {
      headers: headers,
      responseType: 'blob',
    });
    return response;
  }