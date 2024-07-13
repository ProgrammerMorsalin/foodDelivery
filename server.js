const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const stripe = require('stripe')('Your Secret Key'); // Replace with your Stripe secret key
const cors = require('cors'); // Import the CORS package
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Use the CORS middleware

app.post('/create-payment-intent', async (req, res) => {
    const { amount, username, address, foodId, foodName } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd'
        });

        const orderDetails = `Username: ${username}\nAddress: ${address}\nFood ID: ${foodId}\nFood Name: ${foodName}\nPayment Status: Pending\n\n`;
        fs.appendFile('delivery.txt', orderDetails, (err) => {
            if (err) throw err;
            console.log('Order details saved!');
        });

        res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.post('/update-order-status', (req, res) => {
    const { orderDetails } = req.body;

    fs.appendFile('delivery.txt', orderDetails, (err) => {
        if (err) throw err;
        console.log('Order status updated!');
        res.status(200).send({ message: 'Order status updated' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
