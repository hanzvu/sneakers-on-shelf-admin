import instance from "./instance";

export const listProducts = () => {
    const url = `products`;
    return instance.get(url);
}
