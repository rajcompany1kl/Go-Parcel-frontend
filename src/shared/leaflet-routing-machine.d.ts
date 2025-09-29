import {
  Control as LeafletControl,
  Evented,
  LatLng,
  Marker
} from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    class Control extends LeafletControl {
      constructor(options?: RoutingControlOptions);
      getPlan(): Plan;
      getRouter(): IRouter;
    }

    function control(options?: RoutingControlOptions): Control;

    class Plan extends Evented {
      constructor(waypoints: LatLng[], options?: any);
      getWaypoints(): Waypoint[];
    }

    class Waypoint {
      latLng: LatLng;
      name?: string;
      options?: any;
    }

    interface RoutingControlOptions {
      waypoints?: LatLng[];
      router?: IRouter;
      plan?: Plan;
      show?: boolean;
      addWaypoints?: boolean;
      routeWhileDragging?: boolean;
      createMarker?: (i: number, waypoint: Waypoint, n: number) => Marker | null;
    }

    interface IRouter {}

    interface OSRMV1Options {
      serviceUrl: string;
    }

    function osrmv1(options?: OSRMV1Options): IRouter;
  }
}