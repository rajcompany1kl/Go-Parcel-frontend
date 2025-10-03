// utils/memoize.ts

import type { RouteInfo } from "../../modules/Home/types";

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`[SYNC CACHE] HIT: for key ${key}`);
      return cache.get(key)!;
    }

    console.log(`[SYNC CACHE] MISS: for key ${key}`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}




// utils/memoize.ts

// Helper type to get the resolved value of a Promise
type ResolvedValue<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(asyncFn: T): T {
  const cache = new Map<string, ResolvedValue<T>>();

  return (async (...args: Parameters<T>): Promise<ResolvedValue<T>> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`[ASYNC CACHE] HIT: for key ${key}`);
      return cache.get(key)!;
    }

    console.log(`[ASYNC CACHE] MISS: for key ${key}`);
    const result = await asyncFn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}


export function formatRouteData(
  distanceMmeters: number,
  durationSeconds: number
): { distance: string; duration: string } {
  const distanceKm = distanceMmeters / 1000;
  const formattedDistance = `${distanceKm.toFixed(2)} km`;

  const totalMinutes = Math.round(durationSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formattedDuration = '';

  if (hours > 0) {
    formattedDuration += `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) {
      formattedDuration += ` ${minutes} min${minutes > 1 ? 's' : ''}`;
    }
  } else {
    formattedDuration = `${Math.max(1, minutes)} min${
      minutes > 1 ? 's' : ''
    }`;
  }

  return {
    distance: formattedDistance,
    duration: formattedDuration,
  };
}