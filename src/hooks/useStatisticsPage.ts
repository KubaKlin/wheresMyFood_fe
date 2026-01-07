import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStatisticsOverview } from '../api';
import type { StatisticsOverviewResponse, StatisticsRange } from '../types';

const RANGES: StatisticsRange[] = ['today', '7d', '30d'];

const isStatisticsRange = (value: string): value is StatisticsRange =>
  value === 'today' || value === '7d' || value === '30d';

export const useStatisticsPage = () => {
  const [overview, setOverview] = useState<StatisticsOverviewResponse | null>(
    null,
  );
  const [selectedRange, setSelectedRange] = useState<StatisticsRange>('today');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await getStatisticsOverview();
      setOverview(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load statistics';
      setError(message);
      setOverview(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRangeChange = (value: string) => {
    if (!isStatisticsRange(value)) {
      setSelectedRange('today');
      return;
    }
    setSelectedRange(value);
  };

  const rangeData = useMemo(() => {
    if (!overview) return null;
    return overview[selectedRange];
  }, [overview, selectedRange]);

  return {
    ranges: RANGES,
    selectedRange,
    rangeData,
    overview,
    isLoading,
    error,
    reload: load,
    handleRangeChange,
  };
};
