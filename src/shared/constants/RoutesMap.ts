import type { RouteObject } from "react-router";
import HomeTemplate from "../../modules/Home/Template";
import AuthTemplate from "../../modules/Auth/Template";
import UserHome from "../../modules/userhome";
import AdminPanel from "../../modules/AdminPanel";
import UserChat from "../../modules/UserChat";

export const RouteArray: RouteObject[] = [ 
    { path: '/', Component: HomeTemplate },
    { path: '/auth', Component: AuthTemplate },
    { path: '/delivery/:id', Component: UserHome },
    { path: '/adminchat', Component: AdminPanel },
    { path: '/chat/:userId', Component: UserChat }
]
