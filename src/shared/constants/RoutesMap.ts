import type { RouteObject } from "react-router";
import HomeTemplate from "../../modules/Home/Template";
import AuthTemplate from "../../modules/Auth/Template";

export const RouteArray: RouteObject[] = [
    { path: '/', Component: HomeTemplate },
    { path: '/auth', Component: AuthTemplate }
]