import { Router } from 'express';
import { store } from '../store';
import { authenticateJwt, AuthenticatedRequest, requirePermissions } from '../backend/common/guards';
import { AppError } from '../backend/common/types';
import type { TicketDepartment, TicketPriority, TicketStatus } from '../../src/types';

const departments: TicketDepartment[] = ['technical', 'sales', 'finance', 'seo_design', 'general'];
const priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
const statuses: TicketStatus[] = ['new', 'open', 'in_progress', 'answered', 'closed'];

function messageText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string' || !value.trim() || value.length > maxLength) {
    throw new AppError('عنوان یا متن درخواست معتبر نیست.', 400, 'INVALID_TICKET_TEXT');
  }
  return value.trim();
}

function findTicket(id: string, userId?: string) {
  const ticket = store.getTicketById(id);
  if (!ticket || (userId !== undefined && ticket.userId !== userId)) {
    throw new AppError('تیکت یافت نشد.', 404, 'TICKET_NOT_FOUND');
  }
  return ticket;
}

const router = Router();
router.use(authenticateJwt);

router.get('/', (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: store.getTickets().filter(ticket => ticket.userId === req.user!.id) });
});

router.get('/:id', (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: findTicket(req.params.id, req.user!.id) });
});

router.post('/', (req: AuthenticatedRequest, res) => {
  const { department = 'technical', priority = 'medium', subject, message } = req.body || {};
  if (!departments.includes(department) || !priorities.includes(priority)) {
    throw new AppError('بخش یا اولویت نامعتبر است.', 400, 'INVALID_TICKET');
  }
  const user = req.user!;
  const ticket = store.createTicket({
    userId: user.id,
    userName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    userPhone: user.phone || '',
    userEmail: user.email,
    department, priority,
    subject: messageText(subject, 200),
    message: messageText(message, 5000),
  });
  res.status(201).json({ success: true, data: ticket });
});

router.post('/:id/messages', (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const ticket = findTicket(req.params.id, user.id);
  const updated = store.replyTicket(ticket.id, {
    senderType: 'user',
    senderName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    message: messageText(req.body?.message, 5000),
  });
  res.json({ success: true, data: updated });
});

export const adminTicketsRouter = Router();
adminTicketsRouter.use(authenticateJwt, requirePermissions('tickets.manage'));

adminTicketsRouter.get('/', (_req, res) => {
  res.json({ success: true, data: store.getTickets() });
});

adminTicketsRouter.post('/:id/reply', (req: AuthenticatedRequest, res) => {
  const ticket = findTicket(req.params.id);
  const message = messageText(req.body?.message, 5000);
  const status = req.body?.newStatus;
  if (status !== undefined && !statuses.includes(status)) {
    throw new AppError('وضعیت تیکت نامعتبر است.', 400, 'INVALID_TICKET_STATUS');
  }
  const user = req.user!;
  const updated = store.replyTicket(ticket.id, {
    senderType: 'admin',
    senderName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    message,
  });
  if (status) store.updateTicketStatus(ticket.id, status);
  res.json({ success: true, data: updated });
});

adminTicketsRouter.patch('/:id/status', (req, res) => {
  const ticket = findTicket(req.params.id);
  const status = req.body?.status;
  if (!statuses.includes(status)) {
    throw new AppError('وضعیت تیکت نامعتبر است.', 400, 'INVALID_TICKET_STATUS');
  }
  res.json({ success: true, data: store.updateTicketStatus(ticket.id, status) });
});

adminTicketsRouter.delete('/:id', requirePermissions('tickets.delete'), (req, res) => {
  const ticket = findTicket(req.params.id);
  store.deleteTicket(ticket.id);
  res.json({ success: true });
});

export default router;
