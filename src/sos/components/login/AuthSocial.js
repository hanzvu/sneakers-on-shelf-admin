// material
import { Button, Divider, Typography, Box, Grid } from '@mui/material';
import { BASE_API } from '../../services/ApplicationConstant';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function AuthSocial() {

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box>
                        <a href={`${BASE_API}/oauth2/authorize/google?redirect_uri=${window.location.protocol}//${window.location.host}/oauth2/redirect`}>
                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                            </Button>
                        </a>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box>
                        <a href={`${BASE_API}/oauth2/authorize/facebook?redirect_uri=${window.location.protocol}//${window.location.host}/oauth2/redirect`}>
                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                            </Button>
                        </a>
                    </Box>
                </Grid>

            </Grid>

            <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                </Typography>
            </Divider>
        </>
    );
}
