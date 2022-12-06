import { useState, forwardRef } from "react";
import { Box, Button, Container, Dialog, DialogContent, Grid, Slide, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "../../../components/Iconify";
import { BASE_API } from "../../services/ApplicationConstant";
import { uploadStaffFile } from "../../services/StaffService";
import { showSnackbar } from "../../services/NotificationService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImportStaff({ onSuccess }) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUploadTemplate = (e) => {
        setLoading(true);
        uploadStaffFile(e.target.files[0]).then(() => {
            onSuccess();
            setOpen(false);
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    return (<>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => { setOpen(true) }}>
            Nhập từ file
        </Button>
        <Dialog
            maxWidth={"sm"}
            fullWidth
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => { setOpen(false) }}
            aria-describedby="alert-dialog-slide-description">
            <DialogContent sx={{ zIndex: 'modal' }}>
                <Typography variant="h5" color={"dimgray"} textAlign="center">
                    TẢI LÊN FILE TÀI KHOẢN NHÂN VIÊN
                </Typography>
                <Stack direction={"row"} justifyContent="center" p={3} spacing={3}>
                    <a href={`${BASE_API}/api/v1/templates/staff/import-template`}>
                        <Button variant="contained" startIcon={<Iconify icon="ic:baseline-download" />}>
                            Tải File Mẫu
                        </Button>
                    </a>
                    <LoadingButton variant="contained" size="medium" component="label" startIcon={<Iconify icon={"ic:outline-drive-folder-upload"} />} loading={loading}>
                        Tải File Lên
                        <input hidden accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" multiple type="file" onChange={handleUploadTemplate} />
                    </LoadingButton>
                </Stack>
            </DialogContent>
        </Dialog>
    </>)
}
