import { calculateDateDifference } from './components/List';

test('test calculateDateDifference function', () => {
  expect(calculateDateDifference(new Date())).toBe('0 days ago');
});
