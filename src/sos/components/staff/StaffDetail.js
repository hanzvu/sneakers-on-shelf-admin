import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStaffAccountDTOById } from '../../services/StaffService';

import StaffDetailForm from './StaffDetailForm';

export default function StaffDetail() {

    const params = useParams();

    const [account, setAccount] = useState();

    useEffect(() => {
        if (params.id === 'new') {
            setAccount({
                username: '',
                fullname: '',
                email: '',
            });
            return;
        }
        fetchData();
    }, [])

    const fetchData = () => {
        getStaffAccountDTOById(params.id).then(data => {
            setAccount(data);
        })
    }

    if (account == null) {
        return;
    }

    return (<>
        <StaffDetailForm account={account} fetchData={fetchData} />
    </>)
}