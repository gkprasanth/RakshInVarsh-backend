const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');
const { default: Stripe } = require('stripe');

// Initialize dotenv to use environment variables
dotenv.config();

// Connect to MongoDB
connectDB();


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/booking', bookingRoutes);
// app.use("/api/payment/",paymentRoute);



 

const stripe = require('stripe')('sk_test_51QCw3kKzzZ6yllObqa8o024rSPODS8orkUDfp1J3tRTK2BAtwaOI6obRhwIjOfvXAbN2D73Y3uMZINgRxDAYlZcw00nZwPY2cI');

app.post('/api/booking/book', async (req, res) => {
    const { fromLocation, toLocation, hours } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Umbrella Rental',
                    },
                    unit_amount: hours * 3000, // Amount in paise
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ sessionId: session.id });
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
