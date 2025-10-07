import type { RouteObject } from "react-router";
import HomeTemplate from "../../modules/Home/Template";
import AuthTemplate from "../../modules/Auth/Template";
import AdminPanel from "../../modules/Chat/Templates/AdminPanel";
import UserChat from "../../modules/Chat/Templates/UserChat";

export const RouteArray: RouteObject[] = [ 
    { path: '/', Component: HomeTemplate },
    { path: '/auth', Component: AuthTemplate },
    { path: '/adminchat', Component: AdminPanel },
    { path: '/chat/:userId', Component: UserChat }
]
