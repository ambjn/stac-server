import { Request, Response } from "express";

// Base network chain ID
const BASE_CHAIN_ID = 8453;

// Base USDC token address on Base
const BASE_USDC_TOKEN_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Build Base Pay URL (EIP-681 style) for ERC20 USDC transfer
function makeBaseTransfer(recipient: string, amount: number): string {
  // USDC has 6 decimals
  const decimals = 6;
  const amountInUnits = (amount * 10 ** decimals).toFixed(0);

  // EIP-681 URL format:
  // ethereum:<token_address>/transfer?address=<recipient>&uint256=<amountInUnits>@<chain_id>
  return `ethereum:${BASE_USDC_TOKEN_ADDRESS}/transfer?address=${recipient}&uint256=${amountInUnits}@${BASE_CHAIN_ID}`;
}

// Express route handler
export const payHandler = (req: Request, res: Response) => {
  const recipient = req.query.recipient as string;
  const amount = Number(req.query.amount);

  // Validate inputs
  if (!recipient || !amount) {
    return res.status(400).json({
      error: "Missing recipient or amount",
      required: {
        recipient: "string (wallet address)",
        amount: "number (USDC amount)"
      }
    });
  }

  // Validate amount is positive
  if (amount <= 0 || isNaN(amount)) {
    return res.status(400).json({
      error: "Invalid amount. Must be a positive number"
    });
  }

  // Validate recipient address format (basic check)
  if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
    return res.status(400).json({
      error: "Invalid recipient address format"
    });
  }

  const payLink = makeBaseTransfer(recipient, amount);

  // Redirect with 302 to the Base pay URL
  res.redirect(302, payLink);
};