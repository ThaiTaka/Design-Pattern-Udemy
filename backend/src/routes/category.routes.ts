import { Router } from 'express';
import DatabaseConnection from '../patterns/singleton/DatabaseConnection';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const categories = await DatabaseConnection.getInstance().category.findMany({
      include: {
        _count: {
          select: { courses: true }
        }
      }
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
