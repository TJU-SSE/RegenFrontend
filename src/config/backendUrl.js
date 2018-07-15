export default {
  LOGIN: '/user/login',

  TAG_ALL: '/admin/tag/findAll',
  TAG_CREATE: '/admin/tag/create',

  NEWS_CREATE: '/admin/news/create',
  NEWS_GET_ALL: '/admin/news/getAll',
  NEWS_GET_DETAIL: '/admin/news/select/',
  NEWS_UPDATE: '/admin/news/update',
  NEWS_UPDATE_IMG: '/admin/news/updateImg',
  NEWS_DELETE: '/admin/news/delete',
  NEWS_RECOMMAND: '/admin/news/recommandNews/',

  INDEX_GET_ALL: '/admin/indexImg/getAll',
  INDEX_CREATE: '/admin/indexImg/create',
  INDEX_DELETE: '/admin/indexImg/delete',
  INDEX_UPDATE: '/admin/indexImg/updateRanks',

  INDEX_PRODUCT_ALL: '/admin/indexProduct/getAll',
  INDEX_PRODUCT_ALL_WITH_TAGS: '/admin/indexProduct/getAll/tags',
  INDEX_PRODUCT_UPDATE: '/admin/indexProduct/updateRanks',
  INDEX_PRODUCT_DELETE: '/admin/indexProduct/delete',
  INDEX_PRODUCT_CREATE: '/admin/indexProduct/create',

  ARTIST_GET_ALL_BY_IDENTITY: '/admin/artist/selectByIdentity',
  ARTIST_GET_DETAIL_BY_NAME: '/admin/artist/selectById/',
  ARTIST_UPDATE_TEXT: '/admin/artist/update',
  ARTIST_UPDATE_IMG: '/admin/artist/updateImg',
  ARTIST_CREATE: '/admin/artist/create',
  ARTIST_DELETE: '/admin/artist/delete',

  PRODUCT_GET_ALL: '/admin/product/getAllWithoutImgs',
  PRODUCT_SEARCH: '/admin/product/search/',
  PRODUCT_GET_ALL_WITH_RANK: '/admin/product/getAllWithArtistId',
  PRODUCT_GET_ALL_WITH_RANK_ACHIEVEMENT: '/admin/product/getAllWithArtistIdAchievement',
  PRODUCT_GET_DETAIL: '/admin/product/selectWithArtists/',
  PRODUCT_CREATE: '/admin/product/create',
  PRODUCT_UPGRADE: '/admin/product/update',
  PRODUCT_UPGRADE_IMG: '/admin/product/updateImg',
  PRODUCT_DELETE: '/admin/product/delete',
  PRODUCT_ADD_IMG: '/admin/product/addProductImg',
  PRODUCT_ADD_IMGS: '/admin/product/addProductImgs',
  PRODUCT_DELETE_IMG: '/admin/product/deleteProductImg',
  PRODUCT_GET_BRIEF: '/admin/product/select/',

  ARTIST_PRODUCT_GET_ALL: '/admin/artist/selectArticleProductById',
  ARTIST_PRODUCT_CREATE: '/admin/artist/createArtistProduct',
  ARTIST_PRODUCT_DELETE: '/admin/artist/deleteArticleProduct',
  ARTIST_PRODUCT_UPDATE: '/admin/artist/updateRanks',

  ACHIEVEMENT_GET_ALL: '/admin/artist/selectAchievementById',
  ACHIEVEMENT_CREATE: '/admin/artist/createAchievement',
  ACHIEVEMENT_DELETE: '/admin/artist/deleteAchievement',
  ACHIEVEMENT_UPDATE: '/admin/artist/updateAchievementsRanks',

  CONTACT_GET: '/admin/contact/get',
  CONTACT_UPDATE: '/admin/contact/update',

  WORKER_GET_ALL: '/admin/worker/getAll',
  WORKER_CREATE: '/admin/worker/create',
  WORKER_DELETE: '/admin/worker/delete',
  WORKER_UPDATE: '/admin/worker/update',
  WORKER_UPDATE_IMG: '/admin/worker/updateImg',

  CONFIG_FOOTER_LINK: '/admin/config/footerLink'
}
