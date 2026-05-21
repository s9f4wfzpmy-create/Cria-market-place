export const products = [
  {
    id: 'vaso-terra-01',
    title: 'Vaso Terra Queimada',
    artist: 'Ateliê Barro Vivo',
    category: 'Cerâmica',
    price: 420,
    image: '/assets/banner-pottery.png',
    location: 'Cunha, SP',
    stock: 4,
    description:
      'Peça autoral em cerâmica de alta temperatura com acabamento mineral.'
  },

  {
    id: 'trama-natural-02',
    title: 'Trama Natural',
    artist: 'Casa Fio',
    category: 'Têxtil',
    price: 680,
    image: '/assets/products-preview.png',
    location: 'Recife, PE',
    stock: 2,
    description:
      'Painel têxtil artesanal feito com fibras naturais brasileiras.'
  },

  {
    id: 'objeto-sombra-03',
    title: 'Objeto Sombra',
    artist: 'Mauro Lins',
    category: 'Objeto',
    price: 890,
    image: '/assets/artist-preview.png',
    location: 'Belo Horizonte, MG',
    stock: 1,
    description:
      'Objeto de design colecionável em madeira e pedra natural.'
  },

  {
    id: 'prato-ritual-04',
    title: 'Prato Ritual',
    artist: 'Núcleo Argila',
    category: 'Mesa',
    price: 260,
    image: '/assets/collections-preview.png',
    location: 'Goiânia, GO',
    stock: 6,
    description:
      'Prato artesanal com esmaltação orgânica e acabamento manual.'
  }
];

export const artists = [
  {
    id: 'atelie-barro-vivo',
    name: 'Ateliê Barro Vivo',
    city: 'Cunha, SP',
    specialty: 'Cerâmica escultórica',
    bio:
      'Estúdio dedicado à matéria, ao fogo e à produção artesanal contemporânea.',
    image: '/assets/banner-pottery.png'
  },

  {
    id: 'casa-fio',
    name: 'Casa Fio',
    city: 'Recife, PE',
    specialty: 'Arte têxtil',
    bio:
      'Pesquisa visual em tapeçaria contemporânea e fibras brasileiras.',
    image: '/assets/products-preview.png'
  },

  {
    id: 'mauro-lins',
    name: 'Mauro Lins',
    city: 'Belo Horizonte, MG',
    specialty: 'Objeto e madeira',
    bio:
      'Criação de objetos únicos entre design e escultura funcional.',
    image: '/assets/artist-preview.png'
  }
];

export const collections = [
  {
    id: 'casa-terra',
    title: 'Casa Terra',
    text:
      'Peças minerais, madeira e cerâmica para interiores contemporâneos.'
  },

  {
    id: 'galeria-viva',
    title: 'Galeria Viva',
    text:
      'Objetos visuais e obras com presença arquitetônica.'
  },

  {
    id: 'mesa-brasileira',
    title: 'Mesa Brasileira',
    text:
      'Louças, pratos e objetos funcionais com assinatura artesanal.'
  }
];

export const orders = [
  {
    id: 'CRIA-1027',
    customer: 'Marina Alves',
    status: 'Pago',
    total: 1100,
    date: '21/05/2026'
  },

  {
    id: 'CRIA-1026',
    customer: 'Rafael S.',
    status: 'Em curadoria',
    total: 680,
    date: '20/05/2026'
  },

  {
    id: 'CRIA-1025',
    customer: 'Studio Norte',
    status: 'Enviado',
    total: 420,
    date: '18/05/2026'
  }
];
