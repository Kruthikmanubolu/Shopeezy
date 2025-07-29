import { Resend } from 'resend'
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants'
import { Order } from '@/types'
require('dotenv').config();
import PurchaseRecieptEmail from './purchase-reciept';


const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReciept = async ({order} : {order: Order;}) => {
    console.log('Order object:', JSON.stringify(order, null, 2));
    await resend.emails.send({
        from: `${APP_NAME}<${SENDER_EMAIL}>`,
        to: order.user.email,
        subject: `Order Confirmation ${order.id}`,
        react: <PurchaseRecieptEmail order={order} />
    });
}