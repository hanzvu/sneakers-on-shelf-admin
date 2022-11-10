import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAuthentication } from "../../services/AuthenticationService";

export default function OAuthRedirected() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchParams.get("token") != null) {
            setAuthentication({
                id: parseInt(searchParams.get("id"), 10),
                token: searchParams.get("token"),
                type: searchParams.get("type"),
                refreshToken: searchParams.get("refresh_token")
            });
        }
        navigate('/dashboard', { replace: true });
    }, []);
    return null;
}