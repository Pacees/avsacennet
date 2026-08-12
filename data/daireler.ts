export interface Property {
  id: string
  title: string
  location: string
  price: number
  //rating: number
  coverImage: string
  images: any
  specs: {
    guests: number
    bedrooms: number
    beds: number
    baths: number
  },
  description: string
}

export const PROPERTIES: Property[] = [

    {
    id: "giris-alp",
    title: "Bahçeli 1+1 Müstakil Daire",
    location: "Avşa Adası, Merkez",
    price: 5000,
    coverImage: "/gallery/giris-alp/0.jpg",
    images: [
       {
        src: "/gallery/giris-alp/0.jpg",
        alt: "Bahçe"
       },
       {
        src: "/gallery/giris-alp/9.jpg",
        alt: "Giriş"
       },
       {
        src: "/gallery/giris-alp/7.jpg",
        alt: "Mutfak"
       },
       {
        src: "/gallery/giris-alp/1.jpg",
        alt: "Mutfak Bölümü"
       },
       {
        src: "/gallery/giris-alp/4.jpg",
        alt: "Salon"
       },
       {
        src: "/gallery/giris-alp/5.jpg",
        alt: "Salon"
       },
       {
        src: "/gallery/giris-alp/6.jpg",
        alt: "Salon"
       },
       {
        src: "/gallery/giris-alp/12.jpg",
        alt: "Yatak Odası"
       },

      {
        src: "/gallery/giris-alp/2.jpg",
        alt: "Lavabo ve Banyo"
       },
       {
        src: "/gallery/giris-alp/3.jpg",
        alt: "Lavabo ve Banyo"
       },
       {
        src: "/gallery/giris-alp/13.jpg",
        alt: "Bahçe"
       },
    ],
    specs: { guests: 5, bedrooms: 1, beds: 2, baths: 1 },
    description: "Avşa Adası merkezde günlük kiralık daire. Adanın gürültüsünden uzakta, eğlenceye yakın. Tüm mutfak araç gereçleri, tv ve fiber internet mevcuttur. Dairede sıcak ve soğuk su problemi yoktur. Marketler 2-3 dakika, denize 4-5 dakika yürüme mesafede."
  },
  {
    id: "giris-sag",
    title: "Bahçeli 1+1 Daire",
    location: "Avşa Adası, Merkez",
    price: 5000,
    coverImage: "/gallery/giris-sag/9.jpg",
    images: [
       {
        src: "/gallery/giris-sag/9.jpg",
        alt: "Bahçe"
       },
       {
        src: "/gallery/giris-sag/3.jpg",
        alt: "Giriş"
       },
       {
        src: "/gallery/giris-sag/0.jpg",
        alt: "Mutfak"
       },
       {
        src: "/gallery/giris-sag/8.jpg",
        alt: "Geniş - Ferah Salon"
       },
       {
        src: "/gallery/giris-sag/5.jpg",
        alt: "Geniş - Ferah Salon"
       },
       {
        src: "/gallery/giris-sag/2.jpg",
        alt: "Yatak Odası"
       },
       {
        src: "/gallery/giris-sag/7.jpg",
        alt: "Lavabo - Banyo"
       }
    ],
    specs: { guests: 6, bedrooms: 1, beds: 3, baths: 1 },
description: "Avşa Adası merkezde günlük kiralık daire. Adanın gürültüsünden uzakta, eğlenceye yakın. Tüm mutfak araç gereçleri, tv ve fiber internet mevcuttur. Dairede sıcak ve soğuk su problemi yoktur. Marketler 2-3 dakika, denize 4-5 dakika yürüme mesafede."  },

  {
    id: "ust-sag",
    title: "Geniş & Ferah 1+1 Daire",
    location: "Avşa Adası, Merkez",
    price: 4500,
    coverImage: "/gallery/ust-sag/0.jpg",
    images: [
       {
        src: "/gallery/ust-sag/0.jpg",
        alt: "Yatak Odası"
       },
       {
        src: "/gallery/ust-sag/1.jpg",
        alt: "Yatak Odası"
       },
       {
        src: "/gallery/ust-sag/2.jpg",
        alt: "Geniş Salon"
       },
       {
        src: "/gallery/ust-sag/3.jpg",
        alt: "Geniş Salon"
       },
              {
        src: "/gallery/ust-sag/4.jpg",
        alt: "Mutfak & Yemek Bölümü"
       },
       {
        src: "/gallery/ust-sag/5.jpg",
        alt: "Mutfak"
       },
       {
        src: "/gallery/ust-sag/6.jpg",
        alt: "Lavabo & Banyo"
       },
       {
        src: "/gallery/ust-sag/7.jpg",
        alt: "Lavabo & Banyo"
       }
    ],
    specs: { guests: 6, bedrooms: 1, beds: 3, baths: 1 },
description: "Avşa Adası merkezde günlük kiralık daire. Adanın gürültüsünden uzakta, eğlenceye yakın. Tüm mutfak araç gereçleri, tv ve fiber internet mevcuttur. Dairede sıcak ve soğuk su problemi yoktur. Marketler 2-3 dakika, denize 4-5 dakika yürüme mesafede."  },

  {
    id: "ust-sol",
    title: "Balkonlu Geniş & Ferah 1+1 Daire ",
    location: "Avşa Adası, Merkez",
    price: 4500,
    coverImage: "/gallery/ust-sol/9.jpg",
    images: [
       {
        src: "/gallery/ust-sol/0.jpg",
        alt: "Balkon"
       },
       {
        src: "/gallery/ust-sol/8.jpg",
        alt: "Giriş"
       },
       {
        src: "/gallery/ust-sol/9.jpg",
        alt: "Geniş Salon"
       },
       {
        src: "/gallery/ust-sol/10.jpg",
        alt: "Geniş Salon"
       },
              {
        src: "/gallery/ust-sol/3.jpg",
        alt: "Geniş Salon"
       },
       {
        src: "/gallery/ust-sol/6.jpg",
        alt: "Mutfak"
       },
       {
        src: "/gallery/ust-sol/5.jpg",
        alt: "Yatak"
       },
       {
        src: "/gallery/ust-sol/2.jpg",
        alt: "Yatak Odası"
       },
       {
        src: "/gallery/ust-sol/7.jpg",
        alt: "Yatak Odası"
       },

      {
        src: "/gallery/ust-sol/12.jpg",
        alt: "Lavabo ve Banyo"
       },
       {
        src: "/gallery/ust-sol/11.jpg",
        alt: "Balkon"
       },
       {
        src: "/gallery/ust-sol/1.jpg",
        alt: "Dış Mekan"
       },
    ],
    specs: { guests: 4, bedrooms: 1, beds: 4, baths: 1 },
description: "Avşa Adası merkezde günlük kiralık daire. Adanın gürültüsünden uzakta, eğlenceye yakın. Tüm mutfak araç gereçleri, tv ve fiber internet mevcuttur. Dairede sıcak ve soğuk su problemi yoktur. Marketler 2-3 dakika, denize 4-5 dakika yürüme mesafede."  },
  {
    id: "daire-5",
    title: "1+1 Daire",
    location: "Avşa Adası, Merkez",
    price: 4000,
    coverImage: "/gallery/daire-5/0.jpg",
    images: [
       {
        src: "/gallery/daire-5/0.jpg",
        alt: "Salon"
       },
       {
        src: "/gallery/daire-5/1.jpg",
        alt: "Salon"
       },
       {
        src: "/gallery/daire-5/4.jpg",
        alt: "Salon"
       },
       {
        src: "/gallery/daire-5/2.jpg",
        alt: "Mutfak"
       },
       {
        src: "/gallery/daire-5/3.jpg",
        alt: "Yatak Odası"
       },
       {
        src: "/gallery/daire-5/5.jpg",
        alt: "Lavabo & Banyo"
       },
       {
        src: "/gallery/daire-5/6.jpg",
        alt: "Lavabo & Banyo"
       },
    ],
    specs: { guests: 4, bedrooms: 1, beds: 3, baths: 1 },
description: "Avşa Adası merkezde günlük kiralık daire. Adanın gürültüsünden uzakta, eğlenceye yakın. Tüm mutfak araç gereçleri, tv ve fiber internet mevcuttur. Dairede sıcak ve soğuk su problemi yoktur. Marketler 2-3 dakika, denize 4-5 dakika yürüme mesafede."  }
  /*{
    id: "daire-6",
    title: "Denize 50 Metre Balkonlu Süit",
    location: "Avşa Adası, Merkez",
    price: 2600,
    coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: { guests: 4, bedrooms: 2, beds: 2, baths: 1 },
  },*/
]