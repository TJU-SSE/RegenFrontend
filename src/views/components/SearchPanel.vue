<template>
  <div class="search-panel-container">
    <el-input placeholder="Search" v-model="key"></el-input>

    <div v-for="product in products" class="search-item" @click="handleProductClick(product.id)">
      <img :alt="product.title" :src="product.img_url">
      <div class="search-item-item">
        <h3>{{product.title}}</h3>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductService from '../../service/ProductService'

  export default {
    data () {
      return {
        key: '',
        timer: null,
        products: []
      }
    },
    methods: {
      async searchProductsFromServer () {
        const res = await ProductService.search(this, this.key, 1, 20)
        this.products = res.msg.products
      },
      handleProductClick (productId) {
        console.log(productId)
        this.$router.push({
          name: 'showDisplay',
          params: {
            showId: productId
          }
        })
      }
    },
    watch: {
      key () {
        if (this.timer) {
          window.clearTimeout(this.timer)
        }

        this.timer = setTimeout(() => {
          this.searchProductsFromServer()
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-panel-container {
    max-height: 400px;
    overflow-y: auto;
    .search-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.25);
        color: #fff;
      }

      img {
        width: 80px;
      }

      .search-item-item {
        flex: 1;
        margin-left: 12px;
        h3 {
          margin: 0;
          font-size: 16px;
        }
      }
    }
  }

</style>
