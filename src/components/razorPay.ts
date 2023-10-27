import Razorpay from 'react-razorpay';


declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    key: string;
    currency: string;
    amount: number;
    name: string;
    prefill: {
        name: string;
    };
    handler?: (response: { razorpay_payment_id: unknown }) => void;
}


const DisplayRazorpay = async (amount: number) => {

    // const navigate = useNavigate()

    const options: RazorpayOptions = {
        key: "rzp_test_G2uFOSlScJa8TV",
        currency: "INR",
        amount: amount * 100,
        name: "BOOKAT",
        prefill: {
            name: "BOOKAT",
        },
        handler: function (response: { razorpay_payment_id: unknown }) {
            if (response.razorpay_payment_id) {
                console.log('Payment successful', response.razorpay_payment_id);
            } else {
                console.log('Payment failed');
            }
        },
    };

    try {
        const paymentPromise = new Promise((resolve, reject) => {
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        });

        const paymentId = await paymentPromise;
        return paymentId;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default DisplayRazorpay