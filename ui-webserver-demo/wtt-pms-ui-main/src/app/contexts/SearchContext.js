/* eslint-disable no-unused-vars */
import { getProfileDetails } from "app/redux/actions/ProfileActions";
import React, { createContext, useState } from "react";

export const SearchContext = createContext({
    GetProfileData: () => { },
    resetsearch: () => { },
});

export const SearchProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [profiledata, setProfiledata] = useState([]);

    // Get Table Profile Data
    const GetProfileData=async()=> {
        setLoading(true);
        const getProfileApi = await getProfileDetails();
        getProfileApi.payload.results.forEach((element) => {
            element.action = "Profile Edit";
            element.remove = "Profile Delete";
            element.modifiedAt = element.modifiedAt?.split("T")[0];
            element.CreatedBy = element.createdByUserId?.firstName;
        });
        setProfiledata(getProfileApi.payload.results);
        setLoading(false);
    }
    const resetsearch = () => {
        GetProfileData();
    };

    return <SearchContext.Provider
        value={{
            GetProfileData: GetProfileData,
            resetsearch: resetsearch
        }}>
        {children}
    </SearchContext.Provider>;
};

export default SearchContext;
