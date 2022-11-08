import { Navigate } from "react-router-dom";
import { getAuthenticatedUser } from "../../services/AuthenticationService";

export default function ProtectedRoute({ children }) {

    const auth = getAuthenticatedUser();

    return auth ? children : <Navigate to="/login" />;
}