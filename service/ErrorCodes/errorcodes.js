const errorCodes = {
    "EMAIL_ID_ALREADY_EXIT": {
        "status": false,
        "status_code": 400,
        "message": "Email Id is Already exit in our database"
    },
    "EMAIL_ID_NOT_FOUND": {
        "status": false,
        "status_code": 400,
        "message": "Email Id is not found in our database please signup to continue!"
    },
    "PASSWORD_MISMATCH": {
        "status": false,
        "status_code": 400,
        "message": "confirm password not same as password"
    },
    "PASSWORD_WRONG": {
        "status": false,
        "status_code": 400,
        "message": "your password is incorrect"
    },
    "USR_SAVE_ERROR": {
        "status": false,
        "status_code": 400,
        "message": "Error in Saving the User Data"
    },
    "USR_FETCH_ERROR": {
        "status": false,
        "status_code": 400,
        "message": "Error in fetching the User Data"
    },
    "ACCESS_DENIED": {
        "status": false,
        "status_code": 403,
        "message": "You Don't have access to perform this request!!"
    },
    "TOKEN_MISSING": {
        "status": false,
        "status_code": 404,
        "message": "Please provide Token in header!!"
    },
    "TOKEN_INVALID": {
        "status": false,
        "status_code": 404,
        "message": "Token expired or invalid please login to continue!!"
    },
    "UNKNOWN_ERROR": {
        "status": false,
        "status_code": 500,
        "message": "Something went wrong!!"
    },
    "INTERNAL_ERROR": {
        "status": false,
        "status_code": 500,
        "message": "Internal Server Error!!"
    },
    "VERIFICATION_ID_NOT_FOUND": {
        "status": false,
        "status_code": 400,
        "message": "Verification Id Not Found!!"
    },
    "VERIFICATION_FAILED": {
        "status": false,
        "status_code": 400,
        "message": "Verification failed!!"
    },
    "EMAIL_NOT_VERIFIED": {
        "status": false,
        "status_code": 400,
        "message": "please verify the email to continue!!"
    },
    "OTP_EXPIRED": {
        "status": false,
        "status_code": 400,
        "message": "OTP Expired!!"
    },
    "OTP_WRONG": {
        "status": false,
        "status_code": 400,
        "message": "OTP Wrong!!"
    },
    "USER_DOES_NOT_EXIST": {
        "status": false,
        "status_code": 400,
        "message": "User does not exist!!"
    },
    "SCHEDULE_ADD_ERROR": {
        "status": false,
        "status_code": 400,
        "message": "Error in inserting events!!"
    },
    "CHANGE_PASSWORD_ERROR": {
        "status": false,
        "status_code": 400,
        "message": "Error in changing password!!"
    }

}


module.exports = errorCodes;