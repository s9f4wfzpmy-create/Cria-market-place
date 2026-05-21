export const categories = [
  { id: 'ceramica', name: 'Cerâmica', slug: 'ceramica', type: 'Objeto' },
  { id: 'textil', name: 'Têxtil', slug: 'textil', type: 'Arte' },
  { id: 'madeira', name: 'Madeira', slug: 'madeira', type: 'Design' },
  { id: 'mesa', name: 'Mesa', slug: 'mesa', type: 'Funcional' },
  { id: 'gravura', name: 'Gravura', slug: 'gravura', type: 'Obra' }
];

export const artists = [
  {
    id: 'atelie-barro-vivo',
    name: 'Ateliê Barro Vivo',
    slug: 'atelie-barro-vivo',
    bio: 'Estúdio dedicado à matéria, ao fogo e à produção artesanal contemporânea. Suas peças investigam textura, permanência e presença no espaço.',
    image: '/assets/banner-pottery.png',
    location: 'Cunha, SP',
    featured: true,
    socials: { instagram: '#', site: '#' }
  },
  {
    id: 'casa-fio',
    name: 'Casa Fio',
    slug: 'casa-fio',
    bio: 'Pesquisa visual em tapeçaria contemporânea e fibras brasileiras, criando painéis e objetos têxteis para interiores sensíveis.',
    image: '/assets/products-preview.png',
    location: 'Recife, PE',
    featured: true,
    socials: { instagram: '#', site: '#' }
  },
  {
    id: 'mauro-lins',
    name: 'Mauro Lins',
    slug: 'mauro-lins',
    bio: 'Criação de objetos únicos entre design, escultura funcional e madeira. Uma prática guiada por forma, sombra e silêncio.',
    image: '/assets/artist-preview.png',
    location: 'Belo Horizonte, MG',
    featured: true,
    socials: { instagram: '#', site: '#' }
  },
  {
    id: 'nucleo-argila',
    name: 'Núcleo Argila',
    slug: 'nucleo-argila',
    bio: 'Coletivo de criação voltado a peças de mesa, rituais domésticos e esmaltações orgânicas feitas manualmente.',
    image: '/assets/collections-preview.png',
    location: 'Goiânia, GO',
    featured: false,
    socials: { instagram: '#', site: '#' }
  }
];

export const products = [
  {
    id: 'vaso-terra-01',
    name: 'Vaso Terra Queimada',
    slug: 'vaso-terra-queimada',
    artistId: 'atelie-barro-vivo',
    category: 'Cerâmica',
    type: 'Objeto',
    price: 420,
    image: '/assets/banner-pottery.png',
    gallery: ['/assets/banner-pottery.png', '/assets/collections-preview.png', '/assets/products-preview.png'],
    description: 'Peça autoral em cerâmica de alta temperatura com acabamento mineral. Um objeto de presença silenciosa para composições editoriais e interiores contemporâneos.',
    materials: 'Cerâmica de alta temperatura, esmalte mineral e acabamento manual.',
    dimensions: '24 x 18 x 18 cm',
    available: true,
    featured: true
  },
  {
    id: 'trama-natural-02',
    name: 'Trama Natural',
    slug: 'trama-natural',
    artistId: 'casa-fio',
    category: 'Têxtil',
    type: 'Arte',
    price: 680,
    image: '/assets/products-preview.png',
    gallery: ['/assets/products-preview.png', '/assets/artist-preview.png', '/assets/banner-pottery.png'],
    description: 'Painel têxtil artesanal feito com fibras naturais brasileiras. Uma obra de parede com textura, ritmo e atmosfera.',
    materials: 'Algodão cru, fibras naturais e estrutura em madeira leve.',
    dimensions: '70 x 48 cm',
    available: true,
    featured: true
  },
  {
    id: 'objeto-sombra-03',
    name: 'Objeto Sombra',
    slug: 'objeto-sombra',
    artistId: 'mauro-lins',
    category: 'Madeira',
    type: 'Design',
    price: 890,
    image: '/assets/artist-preview.png',
    gallery: ['/assets/artist-preview.png', '/assets/collections-preview.png', '/assets/products-preview.png'],
    description: 'Objeto de design colecionável em madeira e pedra natural. A peça trabalha equilíbrio, peso visual e sombra.',
    materials: 'Madeira reaproveitada, pedra natural e óleo fosco.',
    dimensions: '32 x 21 x 12 cm',
    available: true,
    featured: true
  },
  {
    id: 'prato-ritual-04',
    name: 'Prato Ritual',
    slug: 'prato-ritual',
    artistId: 'nucleo-argila',
    category: 'Mesa',
    type: 'Funcional',
    price: 260,
    image: '/assets/collections-preview.png',
    gallery: ['/assets/collections-preview.png', '/assets/banner-pottery.png', '/assets/products-preview.png'],
    description: 'Prato artesanal com esmaltação orgânica e acabamento manual. Pensado para mesa posta, composição e uso cotidiano.',
    materials: 'Argila clara, esmalte artesanal e queima elétrica.',
    dimensions: '28 cm de diâmetro',
    available: true,
    featured: false
  },
  {
    id: 'gravura-corpo-05',
    name: 'Gravura Corpo-Linha',
    slug: 'gravura-corpo-linha',
    artistId: 'casa-fio',
    category: 'Gravura',
    type: 'Obra',
    price: 340,
    image: '/assets/products-preview.png',
    gallery: ['/assets/products-preview.png', '/assets/collections-preview.png'],
    description: 'Gravura de tiragem simulada para o acervo mockado do CRIA*. Linhas orgânicas e atmosfera minimalista.',
    materials: 'Papel algodão 300g e impressão fine art simulada.',
    dimensions: '42 x 29,7 cm',
    available: false,
    featured: false
  },
  {
    id: 'banco-raiz-06',
    name: 'Banco Raiz',
    slug: 'banco-raiz',
    artistId: 'mauro-lins',
    category: 'Madeira',
    type: 'Design',
    price: 1240,
    image: '/assets/artist-preview.png',
    gallery: ['/assets/artist-preview.png', '/assets/banner-pottery.png'],
    description: 'Banco escultórico em madeira com presença arquitetônica. Peça mockada para demonstração de produto de maior valor.',
    materials: 'Madeira maciça, acabamento acetinado e pés encaixados.',
    dimensions: '46 x 38 x 38 cm',
    available: true,
    featured: true
  }
];

export const getArtistById = (id) => artists.find((artist) => artist.id === id);
export const getArtistBySlug = (slug) => artists.find((artist) => artist.slug === slug);
export const getProductBySlug = (slug) => products.find((product) => product.slug === slug);
export const getProductsByArtist = (artistId) => products.filter((product) => product.artistId === artistId);
