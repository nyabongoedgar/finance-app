import axios from 'axios'
import momo from 'mtn-momo'

export default class TransactionService {
  API_KEY = 'your_api_key'
  API_SECRET = 'your_api_secret'
  API_BASE_URL = 'https://sandbox.momodeveloper.mtn.com'

  constructor () {
    /*
    create a configuration object that specifies the base URL for the MTN MoMo API, the environment (sandbox or production), and the callback host for your webhooks: */
    const { Collections, Disbursements } = momo.create({
      baseUrl: 'https://sandbox.momodeveloper.mtn.com',
      environment: 'sandbox',
      callbackHost: 'https://example.com'
    })

    /**
     * To use the Collections feature of the MTN MoMo API, you will need to create a collections client with your user ID, user secret, and primary key:
     */

    this.collections = Collections({
      userSecret: 'YOUR_USER_SECRET',
      userId: 'YOUR_USER_ID',
      primaryKey: 'YOUR_PRIMARY_KEY'
    })

    /**
     * To use the Disbursements feature of the MTN MoMo API, you will need to create a disbursements client with your user ID, user secret, and primary key:
     */

    this.disbursements = Disbursements({
      userSecret: 'YOUR_USER_SECRET',
      userId: 'YOUR_USER_ID',
      primaryKey: 'YOUR_PRIMARY_KEY'
    })
  }

  // single recipient
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

  // bulk
  /**
   * Once you have created the collections client, you can use the requestToPay method to request a payment from a consumer (payer). The payer will be asked to authorize the payment, and the transaction will be executed once the payer has authorized the payment. Here is an example of how to use the requestToPay method:
   */

  bulkSend () {
    const paymentRequest = {
      amount: '1000',
      currency: 'UGX',
      externalId: '123456789',
      payer: {
        partyIdType: 'MSISDN',
        partyId: '256772123456'
      },
      payerMessage: 'Payment message',
      payeeNote: 'Payee note'
    }

    this.collections
      .requestToPay(paymentRequest)
      .then(transactionId => {
        console.log('Transaction ID:', transactionId)
      })
      .catch(error => {
        console.error(error)
      })
  }

  // bulk send using a disbursement

  sendBulkWithDisbursement () {
    const transferRequest = {
      amount: '1000',
      currency: 'UGX',
      externalId: '123456789',
      payee: {
        partyIdType: 'MSISDN',
        partyId: '256772123456'
      },
      payerMessage: 'Payment message',
      payeeNote: 'Payee note'
    }

    disbursements
      .transfer(transferRequest)
      .then(transactionId => {
        console.log('Transaction ID:', transactionId)
      })
      .catch(error => {
        console.error(error)
      })
  }

  getCollectionTransactionStatus () {
    const transactionId = 'YOUR_TRANSACTION_ID'

    this.collections
      .getTransaction(transactionId)
      .then(payment => {
        console.log('Payment:', payment)
      })
      .catch(error => {
        console.error(error)
      })
  }

  /**
   * To retrieve transaction information using the transaction ID, you can use the getTransaction method. Here is an example of how to use the getTransaction method:
   */

  /**
   * To get the balance of your account, you can use the getBalance method. Here is an example of how to use the getBalance method:
   */

  getYourBalance () {
    this.collections
      .getBalance()
      .then(balance => {
        console.log('Balance:', balance)
      })
      .catch(error => {
        console.error(error)
      })
  }

  /**
   * To check if an account holder is registered and active in the system, you can use the isPayerActive method. Here is an example of how to use the isPayerActive method:
   */

  checkIfAccountIsActive () {
    const id = '256772123456'
    const type = 'MSISDN'

    this.collections
      .isPayerActive(id, type)
      .then(active => {
        console.log('Is payer active?', active)
      })
      .catch(error => {
        console.error(error)
      })
  }
}
