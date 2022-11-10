import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import MainCard from './MainCard';

// project import

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticEcommerce = ({ color, title, text, percentage, extra }) => (
    <MainCard contentSX={{ p: 2.25 }}>
        <Stack spacing={0.5}>
            <Typography variant="h6" color="textSecondary">
                {title}
            </Typography>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h6" color="chocolate">
                        {text}
                    </Typography>
                </Grid>
                {percentage != null && (
                    <Grid item>
                        <Chip
                            variant="combined"
                            color={color}
                            label={`${percentage}%`}
                            sx={{ ml: 1.25, pl: 1 }}
                            size="small"
                        />
                    </Grid>
                )}
            </Grid>
        </Stack>
        {extra &&
            <Box sx={{ pt: 1.25 }}>
                <Typography variant="caption" color="textSecondary">
                    {extra}
                </Typography>
            </Box>
        }
    </MainCard>
);

AnalyticEcommerce.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnalyticEcommerce.defaultProps = {
    color: 'primary'
};

export default AnalyticEcommerce;
