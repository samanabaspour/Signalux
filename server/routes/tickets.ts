import { Router, Request, Response } from 'express';
import { store } from '../store';

const router = Router();

// GET /api/v1/tickets?phone=...
router.get('/', (req: Request, res: Response) => {
  const { phone } = req.query;
  const tickets = store.getTickets(typeof phone === 'string' ? phone : undefined);
  res.json({
    success: true,
    data: tickets
  });
});

// GET /api/v1/tickets/:id
router.get('/:id', (req: Request, res: Response) => {
  const ticket = store.getTicketById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'تیکت یافت نشد.' });
  }
  res.json({ success: true, data: ticket });
});

// POST /api/v1/tickets
router.post('/', (req: Request, res: Response) => {
  const { userName, userPhone, userEmail, department, priority, subject, message, attachments } = req.body || {};

  if (!userName || !userPhone || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'نام، شماره همراه، موضوع و متن تیکت الزامی است.'
    });
  }

  const newTicket = store.createTicket({
    userName,
    userPhone,
    userEmail: userEmail || '',
    department: department || 'technical',
    priority: priority || 'medium',
    subject,
    message,
    attachments: Array.isArray(attachments) ? attachments : []
  });

  res.status(201).json({
    success: true,
    message: 'تیکت شما با موفقیت ثبت شد و به زودی توسط کارشناسان بررسی می‌شود.',
    data: newTicket
  });
});

// POST /api/v1/tickets/:id/messages
router.post('/:id/messages', (req: Request, res: Response) => {
  const { senderName, senderType, message, attachments } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, message: 'متن پاسخ الزامی است.' });
  }

  const updatedTicket = store.replyTicket(req.params.id, {
    senderType: senderType === 'admin' ? 'admin' : 'user',
    senderName: senderName || 'کاربر',
    message: message.trim(),
    attachments: Array.isArray(attachments) ? attachments : []
  });

  if (!updatedTicket) {
    return res.status(404).json({ success: false, message: 'تیکت یافت نشد.' });
  }

  res.json({
    success: true,
    message: 'پاسخ با موفقیت ارسال شد.',
    data: updatedTicket
  });
});

// PATCH /api/v1/tickets/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ success: false, message: 'وضعیت جدید الزامی است.' });
  }

  const updatedTicket = store.updateTicketStatus(req.params.id, status);
  if (!updatedTicket) {
    return res.status(404).json({ success: false, message: 'تیکت یافت نشد.' });
  }

  res.json({
    success: true,
    message: 'وضعیت تیکت بروزرسانی شد.',
    data: updatedTicket
  });
});

// DELETE /api/v1/tickets/:id
router.delete('/:id', (req: Request, res: Response) => {
  const success = store.deleteTicket(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'تیکت یافت نشد.' });
  }
  res.json({ success: true, message: 'تیکت حذف شد.' });
});

export default router;
