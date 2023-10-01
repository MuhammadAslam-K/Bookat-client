import * as Yup from 'yup';


export const basicSchema = Yup.object({
    userName: Yup.string()
        .min(3, "Type a valid Name")
        .required("Please Enter the value"),
    email: Yup.string()
        .email("Please Enter a valid Email")
        .required("Please Enter value"),
    mobile: Yup.string()
        .length(10, "Please Enter a valid number")
        .required("Please Enter value"),
    password: Yup.string()
        .min(8, "Minimum 8 Charecter required")
        .matches(/^(?=.*[A-Z])/, "Must include One uppercase letter")
        .matches(/^(?=.*\d)/, "Must include one digit")
        .required("Passowrd is required"),
    re_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password must match")
        .required("Please re-enter the password"),
})