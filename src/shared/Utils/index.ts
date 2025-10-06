// utils/memoize.ts

import moment from "moment";
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
  console.log(distanceKm)
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

/**
 * Calculates the time required to travel a given distance at a specific speed.
 * @param distanceInMeters The distance to cover in meters.
 * @param speedInKmh The speed of travel in kilometers per hour.
 * @returns The time required in milliseconds.
 */
export function calculateTravelTime(distanceInMeters: number, speedInKmh: number): number {
    if (speedInKmh <= 0 || distanceInMeters < 0) {
        return 0;
    }
    const speedMetersPerSecond = (speedInKmh * 1000) / 3600;
    const timeInSeconds = distanceInMeters / speedMetersPerSecond;
    return timeInSeconds * 1000;
};

/**
 * Formats a duration in milliseconds into a human-readable string (e.g., "1 hour 25 minutes").
 * @param milliseconds The duration in milliseconds.
 * @returns A formatted string representing the time.
 */
export function formatMillisecondsToTime(milliseconds: number): string {
    if (milliseconds < 0) return "Calculating...";

    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return "Arriving now";
};

export const getEstimatedDeliveryDate = (
    distanceInMeters: number,
    averageSpeedKmh: number = 60
): string => {

    if (distanceInMeters <= 0) {
        return "Invalid distance";
    }

    const distanceInKm = distanceInMeters / 1000;
    const idealHours = distanceInKm / averageSpeedKmh;
    let bufferHours = 0;
    bufferHours += idealHours * 0.20; 
    if (idealHours > 6) {
        bufferHours += idealHours * 0.50; 
    }
    const totalEstimatedHours = idealHours + bufferHours;
    const deliveryDateTime = moment().add(totalEstimatedHours, 'hours');
    const deliveryHour = deliveryDateTime.hour();
    if (deliveryHour >= 20) {
        deliveryDateTime.add(1, 'day').hour(10).minute(0).second(0);
    } 
    else if (deliveryHour < 9) {
        deliveryDateTime.hour(10).minute(0).second(0);
    }
    return `by ${deliveryDateTime.format('dddd, MMMM Do')}`;
};