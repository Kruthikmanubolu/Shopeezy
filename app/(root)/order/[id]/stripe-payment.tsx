'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, LinkAuthenticationElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { PaymentElement } from '@stripe/react-stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHIBLE_KEY as string);

const StripePayment = ({
    priceInCents,
    orderId,
    clientSecret
}: {
    priceInCents: number;
    orderId: string;
    clientSecret: string;
}) => {
    const { theme, systemTheme } = useTheme();
    const [appearanceTheme, setAppearanceTheme] = useState<'stripe' | 'night'>('stripe');

    useEffect(() => {
        const resolvedTheme =
            theme === 'dark' || (!theme && systemTheme === 'dark') ? 'night' : 'stripe';
        setAppearanceTheme(resolvedTheme);
    }, [theme, systemTheme]);

    const options = {
        clientSecret,
        appearance: {
            theme: appearanceTheme
        }
    };

    const StripeForm = () => {
        const stripe = useStripe()
        const elements = useElements()

        const [isLoading, setIsLoading] = useState(false)
        const [errorMessage, setErrorMessage] = useState('')
        const [email, setEmail] = useState('')

        const handleSubmit = async (e: FormEvent) => {
            e.preventDefault()

            if(stripe === null || elements === null || email === null) return;

            setIsLoading(true);
            
            stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`
                }
            }).then(({error}) => {
                if(error?.type === 'card_error' || error?.type === 'validation_error'){
                    setErrorMessage(error?.message ?? 'An unkown error occured');

                }else if (error) {
                    setErrorMessage('An unkown error occured')
                }
            }).finally(() => setIsLoading(false))
        }

        return (
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className="text-xl">Stripe Checkout</div>
                {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
                <PaymentElement />
                <div className="">
                    <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
                </div>
                <Button className='w-full' size='lg' disabled={stripe == null || elements == null || isLoading}>
                    {isLoading ? 'Purchasing...' : `Purchase ${formatCurrency(priceInCents / 100)}`}
                </Button>
            </form>
        )
    }

    return clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
            <div className="my-6">
                <StripeForm />
            </div>
        </Elements>
    ) : (
        <div className="text-center">Loading payment form...</div>
    );

};

export default StripePayment;
