import { describe, expect, it } from 'vitest';
import {
  getNextOrderStatus,
  getOrderStatusActionLabel,
  getOrderStatusLabel,
} from './orderStatus';

describe('the orderStatus helpers', () => {
  it('toggles IN_PROGRESS -> READY_TO_TAKE', () => {
    expect(getNextOrderStatus('IN_PROGRESS')).toBe('READY_TO_TAKE');
  });

  it('toggles READY_TO_TAKE -> IN_PROGRESS', () => {
    expect(getNextOrderStatus('READY_TO_TAKE')).toBe('IN_PROGRESS');
  });

  it('returns labels', () => {
    expect(getOrderStatusLabel('IN_PROGRESS')).toBeTruthy();
    expect(getOrderStatusLabel('READY_TO_TAKE')).toBeTruthy();
    expect(getOrderStatusActionLabel('IN_PROGRESS')).toBeTruthy();
    expect(getOrderStatusActionLabel('READY_TO_TAKE')).toBeTruthy();
  });
});
