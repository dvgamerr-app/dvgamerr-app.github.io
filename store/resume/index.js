export default {
  state: {
    page: 'Kananek T. - Full Stack Developer & DevOps',
    desc: 'I love programming and the ability to develop their own just up from the current. I am happy that develops software for people with more than talent than me.',
    title: 'Kananek T.',
    subtitle: 'Full Stack Developer & DevOps',
    introduce: 'Hey there, My name is Kananek T. and I\'m a Full Stack Developer.',
    footer: `<b>Design by Touno™.</b> Power by <a href="https://bootstrap-vue.js.org/" target="_blank">BootstrapVue.js</a> & <a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a>`,
    resume: {
      file: 'https://docs.google.com/document/d/1-oNGrPyrf2CWH8Z0hxhMcROuwQAM9QBrz298PVTqTq8/edit',
      button: 'View Resume'
    },
    about: {
      title: 'A Little Bit Of My Story',
      job: '<strong>System Development Asst. Division Manager at RIS Co.,Ltd</strong>',
      detail: 'I love programming and the ability to develop their own just up from the current. I am happy that develops software for people with more than talent than me.',
      social: [
        { icon: 'fa-github', link: 'https://github.com/dvgamer' },
        { icon: 'fa-windows', link: 'http://www.mycertprofile.com/Profile/4816501773' },
        { icon: 'fa-linkedin', link: 'https://www.linkedin.com/in/kananek-thongkam' },
        { icon: 'fa-facebook', link: 'https://www.facebook.com/touno.io' },
        { icon: 'fa-stack-overflow', link: 'https://stackoverflow.com/story/kananek-thongkam' },
        { icon: 'fa-youtube', link: 'https://www.youtube.com/channel/UCdXvK_j_mMM9HPyWaqCuteA' }
      ],
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
          thumb: '/work/02.jpg',
          image: require('~/assets/images/work/02.jpg'),
          title: 'Rent a panel and room'
        },
        {
          name: 'Ticket Booking',
          thumb: '/work/03.jpg',
          image: require('~/assets/images/work/03.jpg'),
          title: 'Ticket Booking'
        },
        {
          name: 'Student Schedule',
          thumb: '/work/04.jpg',
          image: require('~/assets/images/work/04.jpg'),
          title: 'Student Schedule'
        },
        {
          name: 'PSP Game Library',
          thumb: '/work/05.jpg',
          image: require('~/assets/images/work/05.jpg'),
          title: 'PSP Game Library'
        },
        {
          name: 'Hentai Downloader',
          thumb: '/work/15.jpg',
          image: require('~/assets/images/work/15.jpg'),
          title: 'Hentai Downloader'
        },
        {
          name: 'Facebook App Fanpage',
          thumb: '/work/06.jpg',
          image: require('~/assets/images/work/06.jpg'),
          title: 'Facebook App Fanpage'
        },
        {
          name: 'Onepiece Streaming',
          thumb: '/work/07.jpg',
          image: require('~/assets/images/work/07.jpg'),
          title: 'Onepiece Streaming'
        },
        {
          name: 'Anime Store (Web Private)',
          thumb: '/work/08.jpg',
          image: require('~/assets/images/work/08.jpg'),
          title: 'Anime Store (Web Private)'
        },
        {
          name: 'deBUGerr.io',
          thumb: '/work/09.jpg',
          image: require('~/assets/images/work/09.jpg'),
          title: 'deBUGerr.io'
        },
        {
          name: 'Logo DL-FS',
          thumb: '/work/10.jpg',
          image: require('~/assets/images/work/10.jpg'),
          title: 'Logo DL-FS'
        },
        {
          name: 'Logo dvgamer-pc.com',
          thumb: '/work/11.jpg',
          image: require('~/assets/images/work/11.jpg'),
          title: 'Logo dvgamer-pc.com'
        },
        {
          name: 'Logo HaKkMEw-FS',
          thumb: '/work/12.jpg',
          image: require('~/assets/images/work/12.jpg'),
          title: 'Logo HaKkMEw-FS'
        },
        {
          name: 'Logo Pk@Pay Team',
          thumb: '/work/13.jpg',
          image: require('~/assets/images/work/13.jpg'),
          title: 'Logo Pk@Pay Team'
        },
        {
          name: 'Logo TonSone Youtuber',
          thumb: '/work/14.jpg',
          image: require('~/assets/images/work/14.jpg'),
          title: 'Logo TonSone Youtuber'
        }
      ]
    }
  }
}
