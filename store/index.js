import Vuex from 'vuex'


export const state = () => ({
  locales: ['en', 'th'],
  locale: 'en',
  about: {
    hobby: {
      title: 'Hobbies',
      items: [
        {
          alt: 'Golf Story',
          image: require('~/assets/images/game-image1.jpg'),
          link: 'https://www.facebook.com/photo.php?fbid=10213123558019576&set=pb.1113031282.-2207520000.1507651421.&type=3&theater',
          placement: 'top'
        },
        {
          alt: 'Sevens Story',
          image: require('~/assets/images/game-image2.jpg'),
          link: 'https://www.facebook.com/photo.php?fbid=10212762204425962&set=pb.1113031282.-2207520000.1507651429.&type=3&theater',
          placement: 'top'
        },
        {
          alt: 'Everybody\'s Golf',
          image: require('~/assets/images/game-image3.jpg'),
          link: 'https://www.facebook.com/photo.php?fbid=10212914880002756&set=a.10205759109112956.1073741875.1113031282&type=3&theater',
          placement: 'top'
        },
        {
          alt: 'Uncharted 1',
          image: require('~/assets/images/game-image4.jpg'),
          link: 'https://www.facebook.com/photo.php?fbid=10212375327594283&set=a.10205759109112956.1073741875.1113031282&type=3&theater',
          placement: 'bottom'
        },
        {
          alt: 'Final Fantasy XV',
          image: require('~/assets/images/game-image5.jpg'),
          link: 'https://www.facebook.com/photo.php?fbid=10210617815177571&set=a.10205759109112956.1073741875.1113031282&type=3&theater',
          placement: 'bottom'
        },
        {
          alt: 'Zelda Breath of the Wild',
          image: require('~/assets/images/game-image6.jpg'),
          link: 'https://www.facebook.com/photo.php?fbid=10211360814032078&set=a.10211120081493915.1073741890.1113031282&type=3&theater',
          placement: 'bottom'
        }
      ]
    }
  },
  skill: {
    title: 'Expertise',
    detail: 'Specialize in website programing with NodeJS technology and Server administration.',
    items: [
      { name: 'VueJs', percent: 100 },
      { name: 'NodeJS', percent: 100 },
      { name: 'Linux', percent: 70 },
      { name: 'Docker', percent: 80 },
      { name: 'Photoshop', percent: 80 }
    ]
  },
  work: {
    title: 'Seleted Works',
    detail: 'Some past works can be revealed.',
    items: [
      {
        name: 'Fresh Food Order Web',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/01.jpg'),
        title: 'Fresh Food Order Web'
      },
      {
        name: 'Rent a panel and room',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/02.jpg'),
        title: 'Rent a panel and room'
      },
      {
        name: 'Ticket Booking',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/03.jpg'),
        title: 'Ticket Booking'
      },
      {
        name: 'Student Schedule',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/04.jpg'),
        title: 'Student Schedule'
      },
      {
        name: 'PSP Game Library',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/05.jpg'),
        title: 'PSP Game Library'
      },
      {
        name: 'Hentai Downloader',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/15.jpg'),
        title: 'Hentai Downloader'
      },
      {
        name: 'Facebook App Fanpage',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/06.jpg'),
        title: 'Facebook App Fanpage'
      },
      {
        name: 'Onepiece Streaming',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/07.jpg'),
        title: 'Onepiece Streaming'
      },
      {
        name: 'Anime Store (Web Private)',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/08.jpg'),
        title: 'Anime Store (Web Private)'
      },
      {
        name: 'deBUGerr.io',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/09.jpg'),
        title: 'deBUGerr.io'
      },
      {
        name: 'Logo DL-FS',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/10.jpg'),
        title: 'Logo DL-FS'
      },
      {
        name: 'Logo dvgamer-pc.com',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/11.jpg'),
        title: 'Logo dvgamer-pc.com'
      },
      {
        name: 'Logo HaKkMEw-FS',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/12.jpg'),
        title: 'Logo HaKkMEw-FS'
      },
      {
        name: 'Logo Pk@Pay Team',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/13.jpg'),
        title: 'Logo Pk@Pay Team'
      },
      {
        name: 'Logo TonSone Youtuber',
        thumb: '/work/01.jpg',
        image: require('~/assets/images/work/14.jpg'),
        title: 'Logo TonSone Youtuber'
      }
    ]
  }
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  }
}
