import axios from 'axios'


// const AUTH_REST_API_URL = 'http://localhost:8080/api/auth/register'
const LOGIN_REST_API_URL = 'http://192.168.1.183:8080/api/auth'
// const LOGIN_REST_API_URL = 'http://192.168.11.48:8080/api/auth'


// export const registerUser = (registerObj) => axios.post(AUTH_REST_API_URL,registerObj);
export const loginUser = (usernameOrEmail,password)=>axios.post(LOGIN_REST_API_URL+'/login',{usernameOrEmail,password});

//fuctions to allow data display on page
export const storeToken  = (token)=>localStorage.setItem("token",token);
export const getToken = ()=>localStorage.getItem("token");

//save logged in user
export const saveLoggedInUser = (username,role) =>{
    sessionStorage.setItem("authenticatedUser",username);
    sessionStorage.setItem("role",role);
}

export const isUserLoggedIn = () =>{
    const username = sessionStorage.getItem("authenticatedUser");
    if(username==null){
        return false;
    }else{
        return true;
    }
}

export const getLoggedInUser = () =>{
    const username = sessionStorage.getItem("authenticatedUser");
    return username;
}

//Logout functionality

export const logout =()=>{
    localStorage.clear();
    sessionStorage.clear();
}

export const isAdminUser = () =>{
    let role = sessionStorage.getItem("role");

    if(role !=null && role === 'ROLE_ADMIN'){
        return true;
    }else{
        return false;
    }
}


export const isDoctorUser = () => {
    return sessionStorage.getItem("role") === "ROLE_DOCTOR";
};

export const isReceptionistUser = () => {
    return sessionStorage.getItem("role") === "ROLE_RECEPTIONIST";
};



//Redirect user by roles
export const redirectUserByRole = (role, navigate) => {

    switch (role) {

        case "ROLE_ADMIN":
            navigate("/admin-dashboard");
            break;

        case "ROLE_DOCTOR":
            navigate("/doctor-dashboard");
            break;

        case "ROLE_RECEPTIONIST":
            navigate("/reception-dashboard");
            break;

        case "ROLE_PATIENT":
            navigate("/patient-dashboard");
            break;

        default:
            navigate("/");
    }
};
