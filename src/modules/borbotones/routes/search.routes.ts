import { Router } from 'express';
import { searchAutocomplete } from '../controllers/search.controller';
import {
  getSearchHistory,
  clearSearchHistory
} from '../controllers/history.controller';

const router = Router();

router.get('/search/autocomplete', searchAutocomplete);
router.get('/search/history', getSearchHistory);
router.delete('/search/history', clearSearchHistory);

export default router;
