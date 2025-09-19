import express from "express";
const router = express.Router();

function isEnglish(text) {
  const englishLetters = text.match(/[a-zA-Z]/g) || [];
  const hindiLetters = text.match(/[\u0900-\u097F]/g) || [];
  return englishLetters.length >= hindiLetters.length;
}
// Helper to check if message looks like size (number or S/M/L/XL etc)
function isSizeMessage(text) {
  const sizePatterns = /^(xs|s|m|l|xl|xxl|[0-9]{1,3})$/i;
  return sizePatterns.test(text.trim());
}

router.post("/", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Please send a valid message." });
  }

  const msgLower = message.toLowerCase().trim();
  const replyInEnglish = isEnglish(message);

  // keyword lists
  const greetings = ["hello", "hi", "hlo", "hey", "hiii", "hii", "yo", "helo", "wassup"];
  const acknowledgements = ["ok", "okk", "okay", "thanks", "thank you", "thx", "thnx", "bye", "goodbye"];
  const orderKeywords = ["order", "track", "track order", "mera order", "order kaha"];
  const colorKeywords = ["red", "blue", "black", "white", "green", "yellow", "pink", "orange", "purple", "brown", "grey", "gray", "maroon", "navy"];
  const availableProducts = ["shirt", "t-shirt", "jeans", "shoes", "kurta", "jacket"];
  const keywordsForProductQuery = ["kya", "hai", "available", "milta", "price", "kitne", "size", "color"];
  const deliveryContactKeywords = [
      "delivery person ka number",
      "jo laa raha hai uska number",
      "delivery wala ka number",
      "delivery karne wale ka number",
      "jo product la raha hai unka number",
      "jo laa raha hai uska contact",
      "delivery person ka contact",
      "delivery wala ka contact"
  ];
  const words = msgLower.split(/\s+/);

  if (greetings.some(greet => msgLower.split(/\s+/).includes(greet))) {
    return res.json({
      reply: replyInEnglish ?
        "Hello! 👋 I'm your shopping assistant. You can ask me about products, orders, delivery, returns, cart, offers, or your account." :
        "नमस्ते! 👋 मैं आपकी खरीदारी सहायक हूँ। आप मुझसे उत्पादों, आदेशों, डिलीवरी, रिटर्न, कार्ट, ऑफ़र या अपने खाते के बारे में पूछ सकते हैं।"
    });
  }

  if (acknowledgements.some(word => msgLower.includes(word))) {
    return res.json({
      reply: replyInEnglish ?
        "You're welcome! If you need any more help with shopping, feel free to ask." :
        "You're welcome! Agar aapko shopping se related koi aur madad chahiye toh zaroor batayein. 😊😊",
    });
  }

  // ✅ Order Related
  
  if (orderKeywords.some(keyword => msgLower.includes(keyword))) {
    return res.json({
      reply: replyInEnglish ?
        "You can easily track your orders by going to the 'My Orders' section. 📦" :
        "Aap 'My Orders' section me jaake apne orders ko easily track kar sakte hain. 📦",
    });
  }

  // ✅ Return / Refund
  if (msgLower.includes("return") || msgLower.includes("refund")) {
    return res.json({
      reply: replyInEnglish ?
        "Product can be returned within 7 days, subject to terms and conditions. 🔄" :
        "Product ko 7 din ke andar return kiya ja sakta hai, terms and conditions ke saath. 🔄",
    });
  }

  // ✅ Payment
  if (msgLower.includes("payment") || msgLower.includes("cod") || msgLower.includes("cash")) {
    return res.json({
      reply: replyInEnglish ?
        "You can pay using credit card, debit card, UPI, or net banking. 💳" :
        "Aap payment ke liye credit card, debit card, UPI ya net banking ka use kar sakte hain. 💳",
    });
  }

  // ✅ Offers
  if (msgLower.includes("offer") || msgLower.includes("sale") || msgLower.includes("discount")) {
    return res.json({
      reply: replyInEnglish ?
        "Today's offers: Flat 20% off on all items above ₹999! 🎉" : 
        "Aaj ke offers: Flat 20% off on all items above ₹999! 🎉",
    });
  }

  // ✅ Delivery
  if (msgLower.includes("delivery") || msgLower.includes("shipping")) {
    return res.json({
      reply: replyInEnglish ?
        "Delivery time is 3-5 days, depending on the location. 🚚" :
        "Delivery samay 3-5 din hai, location ke hisaab se. 🚚",
    });
  }

  // ✅ Account/Profile
  if (msgLower.includes("account") || msgLower.includes("profile")) {
    return res.json({
      reply: replyInEnglish ?
        "You can view or edit your profile in the 'My Account' section. 👤" :
        "Aap 'My Account' section me jaake apna profile dekh ya edit kar sakte hain. 👤",
    });
  }

// Agar message delivery contact se related hai
if (deliveryContactKeywords.some(keyword => msgLower.includes(keyword))) {
  return res.json({
    reply: replyInEnglish ?
      "Sorry, the delivery person's contact number is not currently available, but you can track your order from the 'My Orders' section. If you need any further assistance, please let me know! 🙏" :
      "Sorry, delivery person ka contact number abhi available nahi hai, lekin aap apne order ko 'My Orders' section se track kar sakte hain. Agar koi aur madad chahiye toh batao! 🙏",
  });
}

  // ✅ Product Inquiry
  
  
  const foundProduct = availableProducts.find(p => msgLower.includes(p));
  const foundColor = colorKeywords.find(color => msgLower.includes(color));
  if (foundProduct && foundColor) {
    return res.json({
      reply: replyInEnglish ?
        `Yes, we have ${foundColor} available. But what size do you need? 👕` :
        `Haan, ${foundColor} humare paas available hai. But aap ko kis Size ki chahiye? 👕`,
    });
  }
  
  const askingProductDetails = 
    keywordsForProductQuery.some(word => msgLower.includes(word)) ||
    colorKeywords.some(color => msgLower.includes(color));

  // New: Handle size-only messages (like "29", "M", "XL") - simple friendly reply
  if (isSizeMessage(msgLower)) {
    return res.json({
      reply: replyInEnglish ?
        `Got it! Your size is ${message.trim()}. Do you want to add this to your cart or need more help? 👕` :
        `thek hai! Aapka size ${message.trim()} hai. Kya aap isse apne cart mein daalna chahte hain ya aur madad chahiye? 👕`,
    });
  }

  // if (foundProduct && foundColor) {
  //   return res.json({
  //     reply: replyInEnglish ?
  //       `Yes, we have ${foundColor} available. What size do you need? 👕` :
  //       `Haan, ${foundColor} humare paas available hai. Aapko kis Size ki chahiye? 👕`,
  //   });
  // }

  if (foundProduct) {
    if (askingProductDetails) {
      return res.json({
        reply: replyInEnglish ?
          `Yes, we have ${foundProduct} available. Do you need details about size, price, or color? 👕` :
          `Haan, ${foundProduct} humare paas available hai. Aapko size, price ya color ki detail chahiye? 👕`,
      });
    } else {
      return res.json({
        reply: replyInEnglish ?
          `You are asking about ${foundProduct}. You can inquire about availability, size, or return policy.` :
          `Aap ${foundProduct} ke baare mein puch rahe hain. Aap availability, size, ya return policy puch sakte hain.`,
      });
    }
  }

  // ✅ If product is mentioned but not in our list
  const isProductMentioned = /(shirt|t-shirt|jeans|shoes|kurta|jacket|watch|saree|cap|top|product)/.test(msgLower);
  if (isProductMentioned && !foundProduct) {
    return res.json({
      reply: replyInEnglish ?
        "Sorry, this product is not currently available. 🔍" :
        "Maaf kijiye, yeh product abhi humare paas available nahi hai. 🔍",
    });
  }

  // ✅ Fallback
  return res.json({
    reply: replyInEnglish ?
      "I'm sorry, I can only help with shopping-related queries. 🛍️" :
      "Maaf kijiye, main sirf shopping se judi queries me madad kar sakta hoon. 🛍️",
  });
});

export default router;
