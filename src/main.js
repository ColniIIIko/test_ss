import { loadStripe } from '@stripe/stripe-js';
import './style.css';

import Stripe from 'stripe';

const stripeServ = Stripe(
  'sk_test_51R4JcsBMz4CEt0vZRydsij2VBw0AO7SnvF4zbZyPyKABh7p2KOZAAyHdY9WrLNAHe8z6cVElsi4mvoSJIL3Sobdz00k2QERnaV'
);

async function start() {
  const stripe = await loadStripe(
    'pk_test_51R4JcsBMz4CEt0vZbjSCJtBrRSgWO9FDyObpKA0SgIQqw1Me04FleOR15KbwerqrZUoCccMGCFo5aeVbsT4IDyIs00L8d75hwm'
  );
  const options = {
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    // Customizable by using the Appearance API.
    appearance: {
      /*...*/
    },
  };

  // Set up Stripe.js and Elements to use in checkout form.
  const elements = stripe.elements({ paymentMethodTypes: ['card'] });

  const expressCheckoutElement = elements.create('expressCheckout', {
    paymentMethods: {
      googlePay: 'always',
    },
    paymentMethodTypes: ['card'],
  });
  expressCheckoutElement.mount('#app');

  const customer = await stripeServ.customers.create({
    name: 'Test test',
    email: 'isavitskiy12@gmail.com',
  });

  const intent = await stripeServ.paymentIntents.create({
    // To allow saving and retrieving payment methods, provide the Customer ID.
    customer: customer.id,
    amount: 1099,
    currency: 'usd',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: { enabled: true },
    payment,
  });

  const handleError = (error) => {
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  };

  expressCheckoutElement.on('cancel', () => {});

  expressCheckoutElement.on('confirm', async (event) => {
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    const clientSecret = intent.client_secret;

    const { error, paymentIntent } = await stripe.confirmPayment({
      // `elements` instance used to create the Express Checkout Element
      elements,
      // `clientSecret` from the created PaymentIntent
      clientSecret,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
    } else {
      document.querySelector(
        '#aaa'
      ).innerHTML = `Success Payment: ${paymentIntent.status}`;
      console.log(paymentIntent);
    }
  });
}

start();
