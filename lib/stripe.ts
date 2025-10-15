export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef',
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef',
  isTestMode: true,
};

export const testCardNumbers = {
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  mastercard: '5555555555554444',
  amex: '378282246310005',
  discover: '6011111111111117',
  diners: '30569309025904',
  jcb: '3530111333300000',
};

export const testCardDetails = {
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2025',
  name: 'Test User',
};
