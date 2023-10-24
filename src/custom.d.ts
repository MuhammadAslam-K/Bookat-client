import { RecaptchaVerifierInstance } from "firebase/app";

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifierInstance;
        google
    }
}

// custom-razorpay.d.ts
declare module 'razorpay' {
    interface Razorpay {
        open(): void;
    }
}
