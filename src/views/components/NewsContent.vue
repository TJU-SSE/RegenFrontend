<template>
  <div :class="'news-content ' + (noMargin ? 'no-margin' : '')" @click="onItemClick">
    <h2 class="news-content-row">{{newsItem.title}}</h2>
    <p class="news-author news-content-row">
      <span class="news-author-by">by</span>
      <span class="news-author-name">{{newsItem.author}}</span>
    </p>
    <div class="news-content-row news-info">
      <span class="news-tag" v-for="tag in newsItem.tag" :key="tag">{{tag}}</span>
      <span class="news-date">{{newsItem.date}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'newsContent',
    props: {
      newsItem: {
        default: {}
      },
      noMargin: {
        default: false
      }
    },
    methods: {
      onItemClick () {
        this.$emit('onItemClick', this.newsItem.newsId)
      }
    },
    mounted () {
      if (typeof this.newsItem.tag === 'string') {
        this.newsItem.tag = [this.newsItem.tag]
      }
    }
  }
</script>

<style scoped>
  @import "../../../static/css/news.css";

  .news-content {
    margin-left: 2em;
    cursor: pointer;
  }
  .news-content.no-margin {
    margin-left: 0;
  }
  .news-content .news-content-row {
    margin: 1em 0;
  }

  /* news-info */
  .news-content .news-info {
    padding-top: 10px;
    border-top: 1px solid #eaeaea;
  }
  .news-content .news-info .news-tag {
    padding-right: 5px;
    border-right: 1px solid #eaeaea;
  }
  .news-content .news-info .news-date {
    padding-left: 5px;
  }

  /* #news-info */

  /* font */
  .news-content h2, .news-author, .news-tag {
    color: #111;
  }
  .news-content h2 {
    font-family: FZQKBYSJW;
    font-weight: 300;
    /*letter-spacing: 1em;*/
    /*line-height: 1.2em;*/
    /*font-size: 2.2rem;*/
  }
  .news-tag {
    color: #c00000;
  }
  .news-content .news-info, .news-content .news-author {
    font-family: HelveticaNeueLt;
  }
  /* #font */

  @media screen and (max-width: 780px) {
    .news-content {
      margin-left: 0;
      width: 250px;
    }
    .news-content .news-content-row {
      margin: .2em 0;
    }
  }
</style>
