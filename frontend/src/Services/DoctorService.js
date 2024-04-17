import axios from "axios";
import { BASE_URL } from "../utils/Constants";
import { getToken } from "../utils/Constants";

const DoctorService = {

  getCategories: async () => {
    try {
      const response = await axios.get(
        BASE_URL + "disease-category/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            // withCredentials:false
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Service: Error Fetching District Options: ", error);
      throw error.response.data.message;
    }    
  },
  
  getSubCategories: async (selectedCategory) => {
    try {
      const response = await axios.get(
        BASE_URL + "disease-subcategory/?category=" + selectedCategory,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            // withCredentials:false
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Service: Error Fetching District Options: ", error);
      throw error.response.data.message;
    }
  },

  getDiseases: async (selectedSubCategory) => {
    try {
      const response = await axios.get(
        BASE_URL + "disease/?subcategory=" + selectedSubCategory,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            // withCredentials:false
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Service: Error Fetching District Options: ", error);
      throw error.response.data.message;
    }
  },

  getAllPatients: async (pagenumber) => {
    try {
      console.log('before calling getAll')
      const response = await axios.get(BASE_URL + "doctor/new-patient?pagenumber="+pagenumber, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,

        },
      });
      console.log("New Patient list :",response);
      return response;
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      throw error;
    }
  },
 
  



};
export default DoctorService;
