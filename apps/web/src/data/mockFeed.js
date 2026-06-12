export const mockCurrentUser = {
  id: "u1",
  name: "Minh Nguyen",
  username: "minh_chill",
  role: "user",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBqjEX86xuwRi9i1QVu3LYPXLltdQTA8F0DKkopY5NkAGftGeV5wsLcjb5BthfOM3yCGYJH0yI82ALAGg7sq811yIRfLhWWpQLIc47p30BqgMpTIIO9D_M1UGDjEj7hh8OWDzz9Ke-0ttwamLrBSsGhidJgGzB4XfFVDiIC3JLuo1C2XBwfrqUKfYKw3rpGfd2rmI5NW9Mh5d4jmeiGEm5RMZrpQalLxfiIcDNSLAMG2iqOCMKsH7BVfVuIHjn-RL1I75Ts8t6QUJA"
};

export const mockStories = [
  {
    id: "story-1",
    name: "Của bạn",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDF5u5GdHrkheVKf-pmg_1TnO1hBkBMuo0lP4_fmSu0fj4yz8DxMvHVMbaAKBP4qwdZLN8Wc8iQKyI-cXcjk4eCLXdIVJB28-rCGekIs9uRUfEDxSjVMWIdI7S3C8iVxOaTqs4R5mlpqJYySr9DJCWVhyseWV7uNt_j-7VBVRJT2C_PL278ZY8d7i-T_owRPZrjdDjLTeXoS1CrAcrFj7g1Ga8VKW9PFWA7Ziuo-0_plX9Ygui6HTthzOHypAPmZoFc_0bFWytlOVg"
  },
  {
    id: "story-2",
    name: "Linh Chi",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX5hpYAe2q1eIr261Al5PegY4kgkoIFxIrCctmTzNF3gLkoxlHba0k4mKNKKRdA2BhluvB6hhnY6v32Etsst4JhBXGNIvGKVAJFCE3_K97igDhFZJe1LEmt4RKXDu2fwi-9m19uDevax3lW_WZjkhmKF3Ibv1TmlgbTxky0s_WaDZhOSQGAoYZTwZTM1LpkmmBO53MibepVulKcDfRXylLMoaVOULV1P9wF60BUiS9CEykDRH3arq-BOhNaB_TcULqHdRnvAqoMn8"
  },
  {
    id: "story-3",
    name: "Thắng Phạm",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMsnD1J23dJwM6fDm13uQU3H25h1QOGhvqRhjASHAOwsXR4iITuP0NErJnqXEYRaziTLk9euB5oYdnN-f8iez6CMJn9TNJ3ZO0MqglqiCL0Ma8Z4SdoEoeb3_X6oQrOvt1TRath5dyCcIs31uYdFsyRSzuuz_7wGBkYF-o-ROw9yTFw54MQsc_svIkZDLY8zUn2T2EP1aaXGFe1kLHM7_XTMc5OwPI4nOkZdkfklRTnIckuAoIqOUGtaBo6UGHblxNuPQfYn1LwXU"
  },
  {
    id: "story-4",
    name: "Saigon Bites",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPKJMZDmIIP1yRKv6GC307LV-8WxV92QEFm6bfmM20xhe25pfYiHAn0i9px4c-L7uvxAEZJlVFdiIveMKvW231FW4p-z2ramS3Vkyl3BF7ciovA4lFPLHpS6GUJgRHnBXIo4to4egHLNrVtWpUA5ABXbQnFbTrnwjcJyKPAOgvNss4uRsJ-aIMh6OE_DwZIgv4bv7T-F-HaiQSEJW4570fDj_OnKCo47e3wSgJErA6Widf6lAYpsIj645rcpgXlE0NX3LdKHwrCjc"
  }
];

export const mockTrendingTags = [
  { id: "tag-1", label: "cafe", count: "12.8k" },
  { id: "tag-2", label: "rooftop", count: "8.4k" },
  { id: "tag-3", label: "quan1", count: "6.2k" },
  { id: "tag-4", label: "studyspot", count: "4.9k" }
];

export const mockFeedPosts = [
  {
    id: "post-1",
    type: "review",
    author: {
      name: "Linh.ChillVibes",
      username: "linhchill",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCX5hpYAe2q1eIr261Al5PegY4kgkoIFxIrCctmTzNF3gLkoxlHba0k4mKNKKRdA2BhluvB6hhnY6v32Etsst4JhBXGNIvGKVAJFCE3_K97igDhFZJe1LEmt4RKXDu2fwi-9m19uDevax3lW_WZjkhmKF3Ibv1TmlgbTxky0s_WaDZhOSQGAoYZTwZTM1LpkmmBO53MibepVulKcDfRXylLMoaVOULV1P9wF60BUiS9CEykDRH3arq-BOhNaB_TcULqHdRnvAqoMn8"
    },
    place: {
      name: "Tiệm Cà Phê Túi Mơ To",
      area: "Đà Lạt",
      distance: "1.8 km",
      rating: 4.8,
      openingHours: {
        open: "07:00",
        close: "22:00"
      }
    },
    mediaUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMNaQ0Q7B1YPALwiLXWlgmsAp5mqE9Omrf_rVIJQblLZ0XJWDRLCsmoRN_zFC_7EW3g8spjGXulnKORTJYU7-wvTa-uulgpbqWZIsGffM0FrfNFsZ3cjxOBeb-L7vPeXQZ2-NLIFAOmDIzpSzGBwCVfwooNGynFKAmsO-tGmauuaSGvMIX58KR4tZKsBF73c_vHmKx_t30cQb50_o6OpBz0CAdsvZ79X_sTr581MTet73o7ea4XK8fuz-PBhyIEjQC-BPoooJdxzc",
    mediaRatio: "portrait",
    alt: "Rung thong Da Lat vao buoi som voi anh sang mem va suong mo.",
    caption:
      "Một buổi chiều thơ mộng tại Đà Lạt với cốc cafe nóng và không gian yên tĩnh. Hợp để trốn deadline một chút rồi quay lại mạnh hơn.",
    tags: ["cafe", "dalat", "chill"],
    createdAt: "2 giờ trước",
    isTrending: true,
    stats: {
      likes: "12.5k",
      comments: "864",
      saves: "2.1k",
      shares: "428"
    }
  },
  {
    id: "post-2",
    type: "album",
    author: {
      name: "Hoàng Anh",
      username: "hoanganh.food",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAeUsBuJiIwXtPR98SvS8m2FgxuwvEwk4nF7_bjnSov2MBT3FsDNqozWEII-KCswwNjWV_my4LEvnGpzsMaBYHPiRouZQdujcYHt8IsEqL6iY0CbQknCCnsx-TThPlQVXR214nJ6RfBdjwUKs8rUYVhOINtifZedlO8SaVh9hoir4MztWPgdeEbuxuE13FrYYyRBEkWGC_RvxDLqMRMopoeiekIRNjRubFd8z6h8j1L8g4DBB2Kdtw3xOyq08LQWE-Q0VMikOkUrUA"
    },
    place: {
      name: "The Bloom Coffee",
      area: "Thảo Điền, TP.HCM",
      distance: "3.2 km",
      rating: 4.6,
      openingHours: {
        open: "08:00",
        close: "21:30"
      }
    },
    mediaUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxKs6pAEyNDbO_z1aw6pN7Vo-felEFGKOBypgboeAV1cTEJotvH6vea9PPnITPi6Wrtv-hBF2pjlReOrCJExwq1lp3gfmBwoM6NjXSIl4Qdb9zR-_DG6We6YcsK5jBo_SqkeV2pPto-lGSEdYSyHnVEpH2kg58vr1aFRU1652cmEgEGIuA1JC0jQ7DPm7wCJNlCaarMyjIS25_zEc3yRu_3eZmxwJbDsjtcsLjpg_Sd8ptgNBProhl_L9zHdaje8spOxsMfbBNXZM",
    mediaRatio: "square",
    alt: "Quan cafe toi gian voi cua kinh lon, go sang mau va cay xanh.",
    caption:
      "Quán sáng, nhiều ổ cắm, bàn rộng. Team học bài hoặc làm việc cuối tuần sẽ thích vibe này.",
    tags: ["studyspot", "thaodien", "matcha"],
    createdAt: "5 giờ trước",
    isTrending: false,
    stats: {
      likes: "8.9k",
      comments: "312",
      saves: "1.6k",
      shares: "174"
    }
  },
  {
    id: "post-3",
    type: "promotion",
    author: {
      name: "Saigon Rooftop",
      username: "sgrooftop",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDlsBE25Ytv4cm-KxragRMDDBu6GFCcS-bqRbguAcJqQ-rL203YOAbUMVMBq2O3tQ815MJuxcCve5z5s3MqQoD5KfbGj_qJwVzD_PNdNZzotyE_NMY8jde4ID64xXr2Xn_1U-v9gJfgx7gd50HzjSKFBhI2vArCTeArIfnQMRgxt7kS9Oz-ARMMAwIp1ZiyE9NoFEb6KEkeQS-7JSajxRpvmQA7Vqe4BIVurXuRSZJAwY9OERdZCYA1Mg0M2QPpaLA9jUVs_pnQkwk"
    },
    place: {
      name: "Skyline Social Bar",
      area: "Quận 1, TP.HCM",
      distance: "1.1 km",
      rating: 4.7,
      openingHours: {
        open: "16:00",
        close: "01:00"
      }
    },
    mediaUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAG36-jfQ_Pqeqboynff647eY__9WshMfEmwgpolLjVdNY7d97Zrn0V_v8LANsbnAhIXWY-8YtYd6UywfzkBRVG6qrFOGlYKShqpli3ZgSb6ma-ZajP-dsMuAWd68-SRCdV1ARQUtUuapfLHrJG2C2T0PkT4oeO5x9tmEGAhcBG5VFv-Li47n_d77jcS7MPavtKk2yir3E43l6G1mJggoj6OKw4AKteTlpDGYcEtZA5e2a9gERNtKUA4gpIWwVWHFvHVMvQUfG9r8A",
    mediaRatio: "landscape",
    alt: "Nha hang rooftop dem voi den vang va skyline thanh pho.",
    caption:
      "Happy hour 17:00-19:00, mua 1 tặng 1 mocktail cho nhóm bạn check-in trước hoàng hôn.",
    tags: ["rooftop", "quan1", "promotion"],
    createdAt: "Hôm nay",
    isTrending: true,
    stats: {
      likes: "15.2k",
      comments: "721",
      saves: "3.4k",
      shares: "602"
    }
  }
];
