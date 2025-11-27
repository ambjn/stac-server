import { Request, Response } from 'express';

const USDC_TOKEN = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export function make(recipient: string, amount: number): string {
    return `solana:${recipient}?amount=${amount}&spl-token=${USDC_TOKEN}`;
}

// route handler
export const payHandler = (req: Request, res: Response) => {
    const recipient = req.query.recipient as string;
    const amount = Number(req.query.amount);

    const link = make(recipient, amount);
    res.json({
        status: "ok",
        link,
    });
};
