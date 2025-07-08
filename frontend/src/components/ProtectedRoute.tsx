import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React ,{type ReactNode} from 'react'




interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
    redirectTo?: string;
}


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children
    , requiredRole
    , redirectTo ='login'}) => {

       
    const {isAuthenticated,isLoading,user} = useAuth();

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!isAuthenticated){
        return <Navigate to={redirectTo} replace/>
    }

    if (requiredRole && user?.role !== requiredRole) {
        return (
          <div>
            <h2>访问被拒绝</h2>
            <p>您没有权限访问此页面。</p>
            <p>当前角色：{user?.role}</p>
            <p>需要角色：{requiredRole}</p>
          </div>
        );
    }

    return <>{children}</>;


}
