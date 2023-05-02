import axios from 'axios';

export default class TransactionService {
  API_KEY = 'your_api_key'
  API_SECRET = 'your_api_secret'
  API_BASE_URL = 'https://sandbox.momodeveloper.mtn.com'

  sendMoney = async (amount, currency, recipient, message) => {
    const data = {
      amount,
      currency,
      externalId: Math.random().toString(36).substring(7),
      payee: {
        partyIdType: 'MSISDN',
        partyId: recipient
      },
      payerMessage: message,
      payeeNote: message
    }

    const headers = {
      'X-Reference-Id': Math.random().toString(36).substring(7),
      'Ocp-Apim-Subscription-Key': this.API_KEY,
      'X-Target-Environment': 'sandbox',
      'Content-Type': 'application/json',
      'X-Callback-Url': 'https://your-callback-url.com'
    }

    try {
      const response = await axios.post(
        `${this.API_BASE_URL}/collection/v1_0/requesttopay`,
        data,
        { headers }
      )
      console.log(response.data)
    } catch (error) {
      console.error(error.response.data)
    }
  }

  // sendMoney(1000, 'UGX', '2567xxxxxxxx', 'Payment for goods and services')
}
