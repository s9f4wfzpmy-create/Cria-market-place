import React from 'react';
import ReactDOM from 'react-dom/client';
import { ShoppingBag, Search, Menu, ArrowRight, Instagram } from 'lucide-react';
import './styles.css';

import {
  products,
  artists,
  collections,
  orders
} from './data/catalog';

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">CRIA*</div>

      <nav>
        <a href="#produtos">Obras</a>
        <a href="#artistas">Artistas</a>
        <a href="#colecoes">Coleções</a>
      </nav>

      <div className="nav-actions">
        <button>
          <Search size={18}/>
        </button>

        <button>
          <ShoppingBag size={18}/>
        </button>

        <button className="mobile-menu">
          <Menu size={18}/>
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"/>

      <div className="hero-content">
        <span className="eyebrow">
          curated brazilian craft
        </span>

        <h1>
          ARTE QUE
          <br/>
          CRIA PRESENÇA
        </h1>

        <p>
          Um marketplace curado de arte, design e criação contemporânea brasileira.
        </p>

        <button className="primary-button">
          EXPLORAR OBRAS
          <ArrowRight size={16}/>
        </button>
      </div>
    </section>
  );
}

function CollectionCards() {
  return (
    <section
      className="collections-section"
      id="colecoes"
    >
      <div className="section-header">
        <span>Coleções</span>
        <h2>Curadoria visual</h2>
      </div>

      <div className="collections-grid">
        {collections.map((item) => (
          <div
            className="collection-card"
            key={item.id}
          >
            <div className="glass-effect"/>

            <h3>{item.title}</h3>

            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductGrid() {
  return (
    <section
      className="products-section"
      id="produtos"
    >
      <div className="section-header">
        <span>Marketplace</span>
        <h2>Peças disponíveis</h2>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.id}
          >
            <div className="image-wrapper">
              <img
                src={product.image}
                alt={product.title}
              />

              <div className="image-overlay"/>
            </div>

            <div className="product-info">
              <div className="product-top">
                <div>
                  <h3>{product.title}</h3>
                  <span>{product.artist}</span>
                </div>

                <strong>
                  R$ {product.price}
                </strong>
              </div>

              <p>
                {product.description}
              </p>

              <div className="product-footer">
                <small>{product.location}</small>

                <button>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArtistsSection() {
  return (
    <section
      className="artists-section"
      id="artistas"
    >
      <div className="section-header">
        <span>Artistas</span>
        <h2>Criadores em destaque</h2>
      </div>

      <div className="artists-grid">
        {artists.map((artist) => (
          <div
            className="artist-card"
            key={artist.id}
          >
            <img
              src={artist.image}
              alt={artist.name}
            />

            <div className="artist-content">
              <h3>{artist.name}</h3>

              <small>
                {artist.city}
              </small>

              <p>
                {artist.bio}
              </p>

              <button>
                Ver artista
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <span>Admin</span>
        <h2>Painel marketplace</h2>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-top">
          <div>
            <strong>Pedidos recentes</strong>
            <p>Visão administrativa simplificada</p>
          </div>

          <button>
            Dashboard
          </button>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-row"
              key={order.id}
            >
              <div>
                <strong>{order.id}</strong>
                <small>{order.customer}</small>
              </div>

              <span>{order.status}</span>

              <strong>
                R$ {order.total}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>CRIA*</h2>

        <p>
          Marketplace brasileiro de arte,
          design e criação contemporânea.
        </p>
      </div>

      <div className="footer-links">
        <a href="#">
          Instagram
        </a>

        <a href="#">
          Marketplace
        </a>

        <a href="#">
          Curadoria
        </a>
      </div>

      <div className="footer-social">
        <Instagram size={18}/>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar/>

      <Hero/>

      <CollectionCards/>

      <ProductGrid/>

      <ArtistsSection/>

      <DashboardPreview/>

      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
