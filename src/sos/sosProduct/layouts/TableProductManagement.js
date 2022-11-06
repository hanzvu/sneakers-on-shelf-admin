export default function productManagerForm() {


    return (<>
        <form className="row p-0 m-0" action="/hehe" method="POST">
            <div className="mt-3 px-0">
                <div className="bg-light px-4 ">
                    <div className="m-0 py-2 border-bottom fw-bold">THÔNG TIN KHÁCH
                        HÀNG</div>
                    <div className="row m-0 p-0">
                        <div className="col-lg-6 d-flex flex-column justify-content-center p-0">
                            <div className="row py-3 m-0">
                                <div className="col-4 p-0">
                                    Họ Và Tên : Vũ Hoàng Long
                                </div>
                            </div>
                            <div className="row py-3 m-0">
                                <div className="col-4 p-0">
                                    Số Điện Thoại : 0355947324
                                </div>
                            </div>
                            <div className="row py-3 m-0">
                                <div className="col-4 p-0">
                                    Email : vu6u07@gmail.com
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex flex-column justify-content-center">
                            <div className="row pt-2">
                                <textarea id="address" name="address" required placeholder="Địa chỉ" />
                            </div>
                            <div className="row py-2">
                                <textarea id="note" name="note" placeholder="Ghi chú" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-2 px-lg-0">
                <input type="submit" className="btn btn-dark shadow-none rounded-0 border-dark float-end" defaultValue="Xác Nhận Đặt Hàng" />
            </div>
        </form>
    </>)
}