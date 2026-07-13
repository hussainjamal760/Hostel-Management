import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import { PaymentCard } from './payment-card.model';

export class PaymentCardController {
  
  createPaymentCard = asyncHandler(async (req: Request, res: Response) => {
    const { bankName, accountTitle, accountNumber, instructions } = req.body;
    
    // Check if duplicate exists for this user to prevent spam
    const existingCard = await PaymentCard.findOne({
      userId: req.user!.id,
      accountNumber
    });

    if (existingCard) {
      // If it exists, we can optionally just update it, or just return success
      existingCard.bankName = bankName;
      existingCard.accountTitle = accountTitle;
      existingCard.instructions = instructions || '';
      await existingCard.save();
      return ApiResponse.success(res, existingCard, 'Payment card updated successfully');
    }

    const paymentCard = await PaymentCard.create({
      userId: req.user!.id,
      bankName,
      accountTitle,
      accountNumber,
      instructions: instructions || '',
    });

    return ApiResponse.created(res, paymentCard, 'Payment card created successfully');
  });

  getPaymentCards = asyncHandler(async (req: Request, res: Response) => {
    const paymentCards = await PaymentCard.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, paymentCards, 'Payment cards fetched successfully');
  });

  deletePaymentCard = asyncHandler(async (req: Request, res: Response) => {
    const paymentCard = await PaymentCard.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id // Ensure they only delete their own
    });

    if (!paymentCard) {
      return ApiResponse.error(res, 'Payment card not found', 404);
    }

    return ApiResponse.success(res, null, 'Payment card deleted successfully');
  });
}

export default new PaymentCardController();
