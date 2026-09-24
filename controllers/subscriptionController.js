const Subscription = require('../models/Subscription');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

const plans = {
  'free': { price: 0, months: 1, label: 'Free Plan' },
  '1month': { price: 199, months: 1, label: '1 Month Plan' },
  '2month': { price: 349, months: 2, label: '2 Months Plan' },
  '6month': { price: 899, months: 6, label: '6 Months Plan' }
};

// GET Subscription page
exports.getSubscriptionPage = async (req, res) => {
  try {
    const currentSub = await Subscription.findOne({ worker: req.session.userId }).sort({ endDate: -1 });
    const usedFree = await Subscription.findOne({ worker: req.session.userId, plan: 'free' });

    res.render('subscription', { currentSub, plans, usedFree: !!usedFree, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
};

// GET Payment page for chosen plan
exports.getSubscriptionPayment = async (req, res) => {
  try {
    const { plan } = req.params;
    const selected = plans[plan];

    if (!selected) {
      return res.redirect('/subscription');
    }

    if (plan === 'free') {
      const alreadyUsed = await Subscription.findOne({ worker: req.session.userId, plan: 'free' });
      if (alreadyUsed) {
        return res.redirect('/subscription');
      }
      // Free plan — koi payment order nahi chahiye
      return res.render('subscription-pay', { plan, planDetails: selected, order: null, key_id: null });
    }

    // Paid plan — Razorpay order banao
    const order = await razorpay.orders.create({
      amount: selected.price * 100,
      currency: 'INR',
      receipt: 'sub_' + req.session.userId + '_' + Date.now()
    });

    res.render('subscription-pay', {
      plan,
      planDetails: selected,
      order,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error(error);
    res.redirect('/subscription');
  }
};

// POST Free plan activate (no payment needed)
exports.activateFreePlan = async (req, res) => {
  try {
    const alreadyUsed = await Subscription.findOne({ worker: req.session.userId, plan: 'free' });
    if (alreadyUsed) {
      return res.redirect('/subscription');
    }

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await Subscription.create({
      worker: req.session.userId,
      plan: 'free',
      amount: 0,
      endDate: endDate
    });

    res.redirect('/subscription');

  } catch (error) {
    console.error(error);
    res.redirect('/subscription');
  }
};

// POST Verify Razorpay payment aur paid plan activate karo
exports.verifySubscriptionPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const selected = plans[plan];

    if (!selected) {
      return res.redirect('/subscription');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).send('Payment verification failed');
    }

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + selected.months);

    await Subscription.create({
      worker: req.session.userId,
      plan: plan,
      amount: selected.price,
      endDate: endDate
    });

    res.redirect('/subscription');

  } catch (error) {
    console.error(error);
    res.redirect('/subscription');
  }
};