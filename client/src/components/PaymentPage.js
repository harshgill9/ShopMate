import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const ONLINE_PAYMENT_DISCOUNT = 23;

function PaymentPage() {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(null); 
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [otpSending, setOtpSending] = useState(false);  // disable/enable control
  const [otpCooldown, setOtpCooldown] = useState(0);    // timer countdown
  const [walletDetails, setWalletDetails] = useState({ mobile: "" });
  const [selectedWallet, setSelectedWallet] = useState(""); // Amazon / Paytm


  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [netBankingSelected, setNetBankingSelected] = useState("");
  const isNetBankingValid = netBankingSelected !== "";
  const [selectedBank, setSelectedBank] = useState("");
  const [netbankingDetails, setNetbankingDetails] = useState({
    userId: "",
    password: "",
  });

  const isCardValid =
  /^[0-9]{16}$/.test(cardDetails.cardNumber.replace(/\s/g, "")) &&
  /^[0-9]{2}\/[0-9]{2}$/.test(cardDetails.expiry) &&
  /^[0-9]{3}$/.test(cardDetails.cvv);

  // Load data from location.state OR sessionStorage
  useEffect(() => {
    const stateItems = location.state?.items;
    const stateAddress = location.state?.shippingAddress;

    if (stateItems?.length && stateAddress) {
      setItems(stateItems);
      setShippingAddress(stateAddress);
      sessionStorage.setItem(
        "paymentData",
        JSON.stringify({ items: stateItems, shippingAddress: stateAddress })
      );

      if (stateAddress?.email) {
        setFormEmail(stateAddress.email);
      }

    } else {
      const saved = sessionStorage.getItem("paymentData");
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed.items || []);
        setShippingAddress(parsed.shippingAddress || null);

        if (parsed.shippingAddress?.email) {
          setFormEmail(parsed.shippingAddress.email);
        }
      } else {
        toast.error("Missing order data. Redirecting to home...");
        navigate("/");
      }
    }

      let timer;
  if (otpCooldown > 0) {
    timer = setTimeout(() => {
      setOtpCooldown((prev) => {
        if (prev <= 1) {
          setOtpSending(false); // cooldown khatam → button enable
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearTimeout(timer);
 
  }, [location.state, navigate, user?.email, otpCooldown]);

  // ✅ Auto place order when online payment is verified
  useEffect(() => {
    console.log("showOtpInput:", showOtpInput);
    if (paymentMethod === "online" && paymentVerified && isOtpVerified) {
      handlePlaceOrder();
    }
  }, [paymentMethod, paymentVerified, isOtpVerified, showOtpInput]);

  // Calculate totals
  const orderTotal = useMemo(() => {
    return items.reduce((total, item) => total + Number(item.price) * (item.quantity || 1), 0);
  }, [items]);

  const mrp = useMemo(() => {
    return items.reduce(
      (total, item) => total + Number(item.mrp || item.price) * (item.quantity || 1),
      0
    );
  }, [items]);

  const baseDiscount = mrp - orderTotal;
  const extraOnlineDiscount = paymentMethod === "online" ? ONLINE_PAYMENT_DISCOUNT : 0;
  const totalDiscount = baseDiscount + extraOnlineDiscount;

  const discount = useMemo(() => {
    return mrp - orderTotal;
  }, [mrp, orderTotal]);

  const finalTotal = useMemo(() => {
    return orderTotal - (paymentMethod === "online" ? ONLINE_PAYMENT_DISCOUNT : 0);
  }, [orderTotal, paymentMethod]);

  // ✅ Place order function
  const handlePlaceOrder = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("User not logged in!");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const formattedProducts = items.map((item) => ({
        product: item.id || item._id,
        quantity: item.quantity || 1,
        price: item.price,
      }));

      const orderData = {
        products: formattedProducts,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod.toUpperCase(),
        shippingAddress: shippingAddress,
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders/place`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.success) {
        toast.success("Order placed successfully!");
        clearCart();
        sessionStorage.removeItem("paymentData");
        navigate(`/order-success/${response.data.order._id}`);
      } else {
        toast.error(response.data?.msg || "Failed to place order.");
      }
    } catch (err) {
      toast.error("Error placing order");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

   // Function to send OTP (simulate API call)
  const sendOtp = async () => {
  try {
    if (!formEmail) {
      toast.error("User email not found.");
      return;
    }
    setOtpSending(true);
    setOtpCooldown(30);

    const res = await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
      email: formEmail,
      mobile: walletDetails.mobile, // send this if needed
      method: selectedWallet,
    });

    console.log("📩 Sending OTP request with email:", formEmail);      
    console.log("✅ OTP response:", res.data);
    toast.success("OTP sent successfully!");
    setShowOtpInput(true);

  } catch (error) {
    console.error("❌ OTP error:", error.response?.data || error.message);
    toast.error("Failed to send OTP.");
    setOtpSending(false);
    setOtpCooldown(0)
  }
};

  // Function to verify OTP (simulate API call)
  const verifyOtp = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
      email: formEmail,
      otp,
    });
    if (res.data?.success) {
      toast.success("OTP Verified!");
      setIsOtpVerified(true);
      setShowOtpInput(false);
      setPaymentVerified(true);
      setOtpError("")
    } else {
      toast.error("Invalid OTP, please try again.");
      setIsOtpVerified(false);
      setShowOtpInput(true);
      setOtpError("❌ OTP is incorrect, please try again.");
    }
  } catch (error) {
    console.error("❌ OTP verify error:", error.response?.data || error.message);
    setOtpError("❌ Failed to verify OTP. Try again.");
    toast.error(error.response?.data?.message || "Failed to verify OTP.");
  }
};


  if (!items.length || !shippingAddress) {
    return <div className="pt-28 text-center">Loading payment details...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white overflow-x-hidden">
      <div className="pt-28 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 dark:bg-gray-900">
        {/* Payment method selector */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">Select Payment Method</h2>

          {/* COD */}
          <div
            className={`border p-4 rounded-lg cursor-pointer  ${
              paymentMethod === "cod" ? "border-purple-600" : "border-gray-300 dark:bg-gray-900 dark:gray-100"
            }`}
            onClick={() => {
              setPaymentMethod("cod");
              setPaymentVerified(true); 
              setIsOtpVerified(false); 
              setShowOtpInput(false); 
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium dark:text-gray-100">Cash on Delivery</p>
                <p className="text-gray-500 text-sm dark:text-gray-400">Pay ₹{orderTotal.toFixed(2)} at delivery</p>
              </div>
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => {
                  setPaymentMethod("cod");
                  setPaymentVerified(true); 
                  setIsOtpVerified(false); 
                  // setShowOtpInput(false); 
                }}
              />
            </div>
          </div>

          {/* ONLINE PAYMENT */}
          <div
            className={`border p-4 rounded-lg cursor-pointer ${
              paymentMethod === "online" ? "border-purple-600" : "border-gray-300 dark:border-gray-100 dark:text-gray-100"
            }`}
            onClick={() => {
              setPaymentMethod("online");
              setPaymentVerified(false); 
              setIsOtpVerified(false); 
              // setShowOtpInput(false); 
            }}
          >
            <div className="flex items-center justify-between ">
              <div>
                <p className="text-lg font-medium dark:text-gray-100">Pay Online</p>
                <p className="text-green-600 text-sm">
                  Save ₹{ONLINE_PAYMENT_DISCOUNT} | ₹
                  {(orderTotal - ONLINE_PAYMENT_DISCOUNT).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Extra discount with online offers 💳</p>
              </div>
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => {
                  setPaymentMethod("online");
                  setPaymentVerified(false);
                  setIsOtpVerified(false);
                  setShowOtpInput(false);
                }}
              />
            </div>
          {/* Accordion UI for online methods */}
          {paymentMethod === "online" && (
            <div>
              {/* ✅ UPI */}
              <div>
                <button
                  onClick={() => setAccordionOpen(accordionOpen === "upi" ? null : "upi")}
                  className="w-full flex justify-between p-2 border-b"
                >
                  <div className="flex justify-between w-full dark:text-gray-100 ">
                    <span>Pay by any UPI App</span>
                  </div>
                  <span className="dark:text-gray-100" >{accordionOpen === "upi" ? "^" : "▽"}</span>
                </button>
                {accordionOpen === "upi" && (
                  <div className="p-3">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=your-upi-id@bank&pn=YourName"
                      alt="QR Code"
                      className="mx-auto"
                    />
                    <p className="text-center mt-2 text-sm text-gray-600">
                      Scan this QR with GPay, PhonePe, Paytm
                    </p>
                  </div>
                )}
              </div>

                {/* ✅ Wallet */}
                <div>
                  <button
                    onClick={() =>
                      setAccordionOpen(
                        accordionOpen === "wallet" ? null : "wallet"
                      )
                    }
                    className="w-full flex justify-between p-2 border-b"
                  >
                    <span className="dark:text-gray-100">
                      Wallet (Paytm / Amazon)
                    </span>
                    <span>
                      {accordionOpen === "wallet" ? "^" : "▽"}
                    </span>
                  </button>
                  {accordionOpen === "wallet" && (
                    <div className="p-3 space-y-2">
                      <button
                        onClick={() => setSelectedWallet("Paytm")}
                        className={`block w-full p-2 rounded border ${
                          selectedWallet === "Paytm"
                            ? "bg-purple-200 dark:bg-purple-800"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                        disabled={paymentVerified || showOtpInput}
                      >
                        Paytm Wallet
                      </button>
                      <button
                        onClick={() => setSelectedWallet("Amazon")}
                        className={`block w-full p-2 rounded border ${
                          selectedWallet === "Amazon"
                            ? "bg-purple-200 dark:bg-purple-800"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                        disabled={paymentVerified || showOtpInput}
                      >
                        Amazon Pay
                      </button>

                      {selectedWallet && (
                        <div className="mt-4 space-y-2">
                          <input
                            type="text"
                            placeholder="Enter Mobile Number"
                            value={walletDetails.mobile}
                            onChange={(e) =>
                              setWalletDetails({
                                ...walletDetails,
                                mobile: e.target.value,
                              })
                            }
                            className="w-full border p-2 rounded dark:bg-gray-800"
                            disabled={paymentVerified}
                          />
                          {!paymentVerified && !showOtpInput && (
                            <button
                              onClick={() => {
                                if (!walletDetails.mobile) {
                                  toast.error(
                                    "Please enter mobile number."
                                  );
                                  return;
                                }
                                sendOtp();
                              }}
                              disabled={
                                !walletDetails.mobile ||
                                otpSending ||
                                paymentVerified
                              }
                              className={`w-full bg-blue-600 text-white py-2 rounded ${
                                (!walletDetails.mobile ||
                                  otpSending ||
                                  paymentVerified) &&
                                "opacity-50 cursor-not-allowed"
                              }`}
                            >
                              {otpSending
                                ? `Resend OTP in ${otpCooldown}s`
                                : "✅ Send OTP"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ✅ Cards */}
                <div>
                  <button
                    onClick={() =>
                      setAccordionOpen(
                        accordionOpen === "card" ? null : "card"
                      )
                    }
                    className="w-full flex justify-between p-2 border-b"
                  >
                    <span className="dark:text-gray-100">
                      Debit/Credit Cards
                    </span>
                    <span>
                      {accordionOpen === "card" ? "^" : "▽"}
                    </span>
                  </button>
                  {accordionOpen === "card" && (
                    <div className="p-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value,
                          })
                        }
                        disabled={paymentVerified}
                        className="w-full border p-2 rounded dark:bg-gray-800 dark:text-gray-100"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: e.target.value,
                            })
                          }
                          disabled={paymentVerified}
                          className="w-1/2 border p-2 rounded dark:bg-gray-800 dark:text-gray-100"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value,
                            })
                          }
                          disabled={paymentVerified}
                          className="w-1/2 border p-2 rounded dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>
                      {!paymentVerified && (
                        <button
                          onClick={sendOtp}
                          disabled={
                            !isCardValid ||
                            otpSending ||
                            paymentVerified ||
                            showOtpInput
                          }
                          className={`w-full bg-blue-600 text-white py-2 rounded ${
                            (!isCardValid ||
                              otpSending ||
                              paymentVerified ||
                              showOtpInput) &&
                            "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {otpSending
                            ? `Resend OTP in ${otpCooldown}s`
                            : "✅ Send OTP"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

              {/* ✅ NetBanking */}
              <div>
                <button
                  onClick={() => {
                      setAccordionOpen(accordionOpen === "netbanking" ? null : "netbanking");
                  }}
                  className="w-full flex justify-between p-2 border-b dark:bg-gray-900 dark:text-gray-100"
                >
                  <span>NetBanking</span>
                  <span>{accordionOpen === "netbanking" ? "^" : "▽"}</span>
                </button>
                {accordionOpen === "netbanking" && (
                  <div className="p-3 space-y-2 dark:bg-gray-900 dark:text-gray-100">
                    {[ "SBI Bank", "HDFC Bank", "ICICI Bank" ].map((bank) => (
                      <button 
                        key={bank} 
                        className={`block w-full p-2 rounded border dark:border-gray-100 ${
                          netBankingSelected === bank
                          ? "bg-purple-100 dark:bg-purple-800"
                          : "bg-gray-100 dark:bg-gray-800"
                          } dark:text-gray-100 dark:border-gray-700`}
                        onClick={() => {
                          setNetBankingSelected(bank);
                          setSelectedBank(bank);
                        }}
                        disabled={paymentVerified}
                      >
                        {bank}
                      </button>
                    ))}

                      {selectedBank && (
                        <div className="mt-4 space-y-2 p-3 rounded border dark:bg-gray-900 dark:border-gray-100">
                          <input
                            type="text"
                            placeholder="Customer/User ID"
                            value={netbankingDetails.userId}
                            onChange={(e) =>
                              setNetbankingDetails({ ...netbankingDetails, userId: e.target.value })
                            }
                            className="w-full border p-2 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-100"
                            disabled={paymentVerified}
                          />
                          <input
                            type="password"
                            placeholder="Password"
                            value={netbankingDetails.password}
                            onChange={(e) =>
                              setNetbankingDetails({ ...netbankingDetails, password: e.target.value })
                            }
                            className="w-full border p-2 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-100"
                            disabled={paymentVerified}
                          />
                          {!paymentVerified && (
                          <button
                            onClick={() => {
                              if (!netbankingDetails.userId) {
                                toast.error("Enter User ID");
                                return;
                              }
                              sendOtp();
                            }}
                            disabled={!isNetBankingValid || !netbankingDetails.userId || !netbankingDetails.password || otpSending || paymentVerified }
                            className={`mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded ${
                              (!isNetBankingValid || !netbankingDetails.userId || !netbankingDetails.password || otpSending || paymentVerified ) && "opacity-50 cursor-not-allowed"
                            }`}
                          >
                             {otpSending ? `Resend OTP in ${otpCooldown}s` : "✅ Send OTP"}
                          </button>
                          )}
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* OTP Input */}
              {showOtpInput && (
                <div className="mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
                  <p className="mb-2 text-center">Enter the OTP sent to your email: </p>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border p-2 rounded mb-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                    disabled={isOtpVerified}
                  />
                  {otpError && <p className="text-red-500 text-sm text-center mb-2">{otpError}</p>}
                  <button
                    onClick={verifyOtp}
                    disabled={otp.length !== 6 || isOtpVerified}
                    className={`mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded ${
                      (otp.length !== 6 && !isOtpVerified) && "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    ✅ Verify OTP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

        {/* Price Summary */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Price Details</h3>

          <div className="flex justify-between">
            <span>Total MRP</span>
            <span>₹{mrp.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>🎉 You saved ₹{totalDiscount.toFixed(2)}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Order Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>

          <div className="mt-3 bg-green-50 text-green-800 p-2 rounded text-sm text-center">
            🎉 Total Savings: ₹
            {(discount + (paymentMethod === "online" ? ONLINE_PAYMENT_DISCOUNT : 0)).toFixed(2)}
          </div>

          {/* <button
            onClick={() => {
              if (paymentMethod === "online" && !isOtpVerified) {
                toast.error("Please verify OTP before placing order.");
                return;
              }
              handlePlaceOrder();
            }}
            disabled={isProcessing || (paymentMethod === "online" && !isOtpVerified)}
            className={`mt-4 w-full py-3 text-white rounded ${
              isProcessing || (paymentMethod === "online" && !isOtpVerified)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button> */}



          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || (paymentMethod === "online" && !isOtpVerified)}
            className={`mt-4 w-full py-2 rounded text-white ${
              isProcessing || (paymentMethod === "online" && !isOtpVerified)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isProcessing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
