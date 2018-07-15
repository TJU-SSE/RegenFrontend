export default {
  // BASE_URL: 'http://121.42.169.109:3000',
  // BASE_URL: 'http://localhost:3000',
  BRAND_NAME: 'REGEN',
  BASE_URL: 'http://101.132.77.182:3000',
  RESP_CODE: {
    SUCCESS: '0',
    FAIL: '1',
    NO_LOGIN: '2'
  },
  PAGE_ITEM_SIZE: 8,
  SECOND_MENU_PAGE_ITEM_SIZE: 12,
  PAGE_ITEM_SIZES: {
    PRODUCT: 8,
    PRODUCT_ARTIST: 10,
    WORKERS: 6,
    INDEX_PRODUCT: 20
  },

  PAGE_GROUP_SUM: 8,

  REQUIRE_HEAD_TYPE: {
    FORM_DATA: 0,
    JSON: 1,
    OTHER: 2
  },

  SECOND_MENU_TITLE: {
    // fashionShow: ['showDirector', 'creativeDirector', 'styling', 'casting', 'behindTheScene'],
    fashionShow: ['showDirector', 'styling', 'fashionShowCasting'],
    photography: ['photographer', 'artDirector', 'styling', 'photographyCasting', 'fashionFilm'],
    talent: ['talent']
  },

  SECOND_MENU_DIRECT_TO_THIRD: ['showDirector', 'photographyCasting', 'fashionShowCasting'],

  ARTIST_PRODUCT_TYPES: {
    UPDATES: 0,
    ACHIEVEMENT: 1
  },

  DATE_TAG: {
    TO_DAY: 0,
    TO_MONTH: 1,
    TO_YEAR: 2
  },

  BRIEF_LENGTH: 200
}
