import { RAZORPAY_KEY_ID } from "../const/env.const";
import { message } from "antd";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const handlePayment = async (orderId, onSuccess, onFailure) => {
  try {
    const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    
    if (!scriptLoaded) {
      message.error("Failed to load payment gateway. Please try again.");
      return;
    }

    const paymentObject = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      order_id: orderId,
      handler: function (response) {
        console.log("Payment successful:", response);
        message.success("Payment completed successfully!");
        onSuccess?.(response);
      },
      modal: {
        ondismiss: function() {
          message.warning("Payment cancelled by user");
          onFailure?.("Payment cancelled");
        }
      },
      theme: {
        color: "#2563eb" // Blue theme to match the app
      }
    });
    
    paymentObject.open();
  } catch (error) {
    console.error("Payment error:", error);
    message.error("Payment failed. Please try again.");
    onFailure?.(error);
  }
};

export default handlePayment;
