import { RecaptchaVerifierInstance } from "firebase/app";

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifierInstance;
        google
    }
}