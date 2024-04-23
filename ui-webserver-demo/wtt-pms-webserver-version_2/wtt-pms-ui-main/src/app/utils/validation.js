/* eslint-disable no-useless-escape */
/* eslint-disable default-case */
export const validate = (name, values) => {
    const namereg = /^[a-zA-Z0-9\s]*$/i;
    const firstNameRegix = /^[A-Za-z]{1,20}$/i;
    const lastNameRegix = /^[A-Za-z\-]{1,30}$/i;
    const regexspecialchar = /^[a-zA-Z0-9 ,.&()]*$/i
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regex1 = /^[0-9]\d*(\.\d+)?$/i;
    const numvalidate = /^[0-9]\d*(\.\d+)?$/i;
    const DOBpattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    const pattern = /(((^[\+,0][9][1])(((\s[0-9]{7,10})|(\S[0-9]{7,10}))|([-]\S[0-9]{7,10})))|((^[\+,0][2]{2,2})((\S[0-9]{7,8})|((([-])[0-9]{7,8})|(\s[0-9]{7,8})))))|(((^[6,7,8,9][0-9]{9,9}))|(^[0,\+](([9][1)|[6,7,8,9]))[0-9]{8,9}))/gm;
    const error = {};

    switch (name) {
        //JobRole
        case 'name':
            if (!values) {
                error.name = "Name is required!";
            } else if (!namereg.test(values)) {
                error.name = "Please enter valid name"; 
            }
            break;

        case 'description':
            if (!values) {
                error.description = "Description is required!";
            }
            break;

        //Recruiter and Employer
        case 'firstName':
            if (!values) {
                error.firstName = "First name is required!";
            } else if (!firstNameRegix.test(values)) {
                error.firstName = "Please enter valid first name ";
            }
            break;

        case 'lastName':
            if (!values) {
                error.lastName = "Last name is required!";
            } else if (!lastNameRegix.test(values)) {
                error.lastName = "Please enter valid last name";
            }
            break;

        case 'mobileNumber':
            if (!values) {
                error.mobileNumber = "Phone number is required!";
            } else if (!pattern.test(values)) {
                error.mobileNumber = "Please enter valid phone number";
            }
            else if (values.length > 10) {
                error.mobileNumber = "Please required 10 digits phone number";
            }
            break;

        case 'emailAddress':
            if (!values) {
                error.emailAddress = "Email is required!";
            } else if (!regex.test(values)) {
                error.emailAddress = "This is not a valid email format";
            }
            break;
            case 'date_of_birth':
            if (!DOBpattern.test(values)) {
                error.date_of_birth = "Invalid date of birth\n";
            }
            break;

        //Job Opening 
        case 'department':
            if (!values) {
                error.department = "Department is required!";
            }
            else if (!regexspecialchar.test(values)) {
                error.department = "Please enter valid department";
            }
            break;

        case 'industryType':
            if (!values) {
                error.industryType = "Industry type is required!";
            }
            else if (!regexspecialchar.test(values)) {
                error.industryType = "Please enter valid industry type";
            }
            break;

        case 'responsibilities':
            if (!values) {
                error.responsibilities = "Responsibilities is required!";
            }
            break;
        case 'skillsRequired':
            if (!values) {
                error.skillsRequired = "skill is required";
            }
            break;

        case 'location':
            if (!values) {
                error.location = "Location is required!";
            } else if (!regexspecialchar.test(values)) {
                error.location = "Please enter valid location";
            }
            break;

        case 'totalOpenings':
            if (!values) {
                error.totalOpenings = "Total openings is required!";
            }
            else if (!regex1.test(values)) {
                error.totalOpenings = "Please enter valid number of total openings";
            }
            break;

        case 'minExperience':
            if (!values) {
                error.minExperience = "Min experience is required!";
            }
            else if (!regex1.test(values)) {
                error.minExperience = "Please enter valid number of min experience";
            }
            break;

        case 'maxExperience':
            if (!values) {
                error.maxExperience = "Max experience is required!";
            }
            else if (!regex1.test(values)) {
                error.maxExperience = "Please enter valid number of max experience";
            }
            else if (values > 50) {
                error.experience = "Max experience 50";
            }
            break;

        case 'jobRole':
            if (!values) {
                error.jobRole = "Job role is required!";
            }
            break;
        case 'phone_no':
            if (!values) {
                error.phone_no = "Phone number is required!";
            } else if (!pattern.test(values)) {
                error.phone_no = "Please enter valid phone number";
            }
            else if (values.length > 10) {
                error.phone_no = "Please required 10 digits phone number";
            }
            break;
        case 'email':
            if (!values) {
                error.email = "Email is required!";
            } else if (!regex.test(values)) {
                error.email = "This is not a valid email format";
            }
            break;
        case 'current_location':
            if (!values) {
                error.current_location = "Current location is required!";
            }
            break;
        case 'experience':
            if (values > 50) {
                error.experience = "Max experience 50";
            }
            break;
        case 'ctc':
            if (!numvalidate.test(values)) {
                error.ctc = "Please enter valid number of ctc";
            }
            else if (values >= 50) {
                error.ctc = "Max ctc 50";
            }
            break;
        case 'noticePeriod':
            if (!numvalidate.test(values)) {
                error.noticePeriod = "Please enter valid number of notice period";
            }
            else if (values >= 50) {
                error.noticePeriod = "Max noticePeriod 50";
            }
            break;
        case 'current_ctc':
            if (!numvalidate.test(values)) {
                error.current_ctc = "Please enter valid number of current ctc";
            }
            break;
        case 'expected_ctc':
            if (!numvalidate.test(values)) {
                error.expected_ctc = "Please enter valid number of expected ctc";
            }
            break;
        case 'notice_period':
            if (!numvalidate.test(values)) {
                error.notice_period = "Please enter valid number of notice period";
            }
            break;
        case 'qualification':
            if (!values) {
                error.qualification = "Qualification is required";
            } else if (!namereg.test(values)) {
                error.qualification = "Please enter valid name";
            }
            break;
    }
    return (error);
};
