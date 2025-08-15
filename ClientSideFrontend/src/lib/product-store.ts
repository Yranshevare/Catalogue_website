import axios from "axios"
import type { CartItem, Product } from "./types"
import { get } from "http"
class ProductStore {
    private product: Product[] = []

    private async fetchProducts() {
        const res = await axios.get(`api/product/getAll`)
        return res
    }

    async getProducts() {
        if (this.product.length === 0) {
            const res = await this.fetchProducts()
            this.product = res.data.data
        }
        return this.product
    }

    async getOneProduct(id: string) {
        let pro = await this.getProducts()
        console.log(this.product[0],"id")
        return pro.find(product => product.id === id)
    }
}

export const productStore = new ProductStore()