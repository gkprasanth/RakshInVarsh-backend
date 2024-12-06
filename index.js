const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000
app.use(bodyParser.json());
const twilio = require('twilio');


const accountSid = 'ACdc2ca2eb6269151b9d41840efdf81f87';
const authToken = '455a08e9dbf1ddda241f689c03f20eba';
const twilioClient = twilio('ACdc2ca2eb6269151b9d41840efdf81f87', 'b3f281fec5e04342356da6af24c1f191');
const twilioPhoneNumber = '+17754774773';
const toNumber = '+919054364456'

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


const sendSms = async (to, body) => {
    let smsOptions = {
        from: twilioPhoneNumber,
        to: toNumber,
        body,
    };

    try {
        const message = await twilioClient.messages.create(smsOptions);
        console.log("SMS sent successfully:", message.sid); // Log the success
    } catch (err) {
        console.error("Error sending SMS:", err);
    }
};

// Change endpoint to POST
app.post('/api/sendOtp', async (req, res) => {
    const { mobileNumber } = req.body;

    // Validate mobile number
    if (!mobileNumber) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    // Generate a random OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    try {
        // Send the OTP
        await sendSms(mobileNumber, `Your OTP is 5805`);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ message: 'Failed to send OTP' });
    }
});











app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
    console.log(order)
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});


app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
