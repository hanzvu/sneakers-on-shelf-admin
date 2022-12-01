import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getAccountDTOById } from '../../services/AccountService';
import AccountDetailForm from './AccountDetailForm';

export default function AccountDetail() {

    const params = useParams();

    const [account, setAccount] = useState();

    useEffect(() => {
        if (params.id === 'new') {
            setAccount({
                username: '',
                fullname: '',
                email: '',
                admin : false
            });
            return;
        }
        fetchData();
    }, [])

    const fetchData = () => {
        getAccountDTOById(params.id).then(data => {
            setAccount(data);
        })
    }

    if (account == null) {
        return;
    }

    console.log(account);

    return (<>
        <AccountDetailForm account={account} fetchData={fetchData} />
    </>)
}