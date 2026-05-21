import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2, User, X } from 'lucide-react';
import { products, artists, categories, getArtistById, getArtistBySlug, getProductBySlug, getProductsByArtist } from './data/catalog';

const money = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const nav = (path) => { window.history.pushState({}, '', path); window.dispatchEvent(new Event('popstate')); window.scrollTo(0, 0); };
const artistName = (id) => getArtistById(id)?.name || 'Criador independente';

function usePath() {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const onPop = () => setPath(location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

function useStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

function A({ to, className = '', children, onClick }) {
  return <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick?.(); nav(to); }}>{children}</a>;
}

export default function App() {
  const path = usePath();
  const [cart, setCart] = useStorage('cria_cart', []);
  const [favorites, setFavorites] = useStorage('cria_favorites', []);
  const [menu, setMenu] = useState(false);
  const addToCart = (product) => setCart((items) => {
    const item = items.find((i) => i.id === product.id);
    return item ? items.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...items, { id: product.id, qty: 1 }];
  });
  const qty = (id, next) => setCart((items) => next <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => i.id === id ? { ...i, qty: next } : i));
  const fav = (id) => setFavorites((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  const ctx = { cart, favorites, addToCart, qty, fav, clearCart: () => setCart([]) };

  return <div className="app">
    <Header cart={cart} favorites={favorites} menu={menu} setMenu={setMenu} />
    <main>{screen(path, ctx)}</main>
    <Footer />
  </div>;
}

function screen(path, ctx) {
  if (path === '/') return <Home {...ctx} />;
  if (path === '/explorar') return <Explore {...ctx} />;
  if (path.startsWith('/produto/')) return <Product slug={path.split('/').pop()} {...ctx} />;
  if (path.startsWith('/artista/')) return <Artist slug={path.split('/').pop()} {...ctx} />;
  if (path === '/carrinho') return <Cart {...ctx} />;
  if (path === '/checkout') return <Checkout {...ctx} />;
  if (path === '/favoritos') return <Favorites {...ctx} />;
  if (path === '/sobre') return <About />;
  if (path === '/contato') return <Contact />;
  if (path === '/login') return <Auth mode="login" />;
  if (path === '/cadastro') return <Auth mode="cadastro" />;
  return <Page><Empty title="Página não encontrada" text="Essa rota ainda não existe no CRIA*." cta="Voltar para a home" to="/" /></Page>;
}

function Header({ cart, favorites, menu, setMenu }) {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return <header className="nav">
    <A to="/" className="brand">CRIA*</A>
    <nav><A to="/explorar">Explorar</A><A to="/sobre">Sobre</A><A to="/contato">Contato</A></nav>
    <div className="actions">
      <A to="/favoritos" className="icon"><Heart size={18}/>{favorites.length > 0 && <b>{favorites.length}</b>}</A>
      <A to="/carrinho" className="icon"><ShoppingBag size={18}/>{count > 0 && <b>{count}</b>}</A>
      <A to="/login" className="icon"><User size={18}/></A>
      <button className="icon mob" onClick={() => setMenu(true)}><Menu size={18}/></button>
    </div>
    {menu && <div className="mobile-menu"><button onClick={() => setMenu(false)}><X /></button>{[['/','Home'],['/explorar','Explorar'],['/favoritos','Favoritos'],['/carrinho','Carrinho'],['/sobre','Sobre'],['/contato','Contato'],['/login','Entrar']].map(([to, label]) => <A key={to} to={to} onClick={() => setMenu(false)}>{label}</A>)}</div>}
  </header>;
}

function Home(props) {
  return <>
    <section className="hero">
      <div className="hero-text"><span>marketplace brasileiro curado</span><h1>ARTE QUE<br/>CRIA PRESENÇA</h1><p>Arte, design e criação contemporânea brasileira em uma experiência curada, editorial e pronta para receber produtos reais.</p><A to="/explorar" className="btn dark">Explorar obras <ArrowRight size={16}/></A></div>
      <div className="hero-visual glass"><img src="/assets/hero-hand.png" onError={(e) => e.currentTarget.src = '/assets/banner-pottery.png'} /><small>curadoria CRIA*</small></div>
    </section>
    <Block tag="Categorias" title="Escolha pela atmosfera"><div className="category-grid">{categories.map((c) => <A to={`/explorar?categoria=${c.name}`} className="category glass" key={c.id}><small>{c.type}</small><h3>{c.name}</h3><p>Seleção editorial de peças, obras e objetos brasileiros.</p></A>)}</div></Block>
    <Block tag="Destaques" title="Obras em destaque"><Grid list={products.filter(p => p.featured)} {...props}/></Block>
    <Block tag="Artistas" title="Criadores em destaque"><div className="artist-grid">{artists.filter(a => a.featured).map(a => <ArtistCard key={a.id} artist={a}/>)}</div></Block>
    <section className="manifest glass"><span>CRIA*</span><h2>Mais que comprar objetos. É descobrir narrativas visuais.</h2><p>O CRIA* conecta criadores contemporâneos a pessoas que valorizam estética, atmosfera e direção artística.</p><A to="/sobre" className="btn ghost">Conhecer a curadoria</A></section>
    <Newsletter />
  </>;
}

function Explore(props) {
  const params = new URLSearchParams(location.search);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(params.get('categoria') || '');
  const [artist, setArtist] = useState('');
  const [available, setAvailable] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('featured');
  const types = [...new Set(products.map(p => p.type))];
  const list = useMemo(() => products.filter(p => {
    const text = `${p.name} ${artistName(p.artistId)} ${p.category} ${p.type}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (cat && p.category !== cat) return false;
    if (artist && p.artistId !== artist) return false;
    if (available === 'sim' && !p.available) return false;
    if (available === 'nao' && p.available) return false;
    if (type && p.type !== type) return false;
    if (price === '500' && p.price > 500) return false;
    if (price === '900' && (p.price < 500 || p.price > 900)) return false;
    if (price === '901' && p.price < 901) return false;
    return true;
  }).sort((a,b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : sort === 'az' ? a.name.localeCompare(b.name) : Number(b.featured) - Number(a.featured)), [q, cat, artist, available, price, type, sort]);
  return <Page title="Explorar obras" text="Busque, filtre e organize o acervo mockado do marketplace.">
    <div className="market"><aside className="filters glass"><label><span><Search size={15}/>Busca</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Obra, artista, categoria..." /></label><Select label="Categoria" value={cat} set={setCat} items={categories.map(c => c.name)} /><Select label="Artista" value={artist} set={setArtist} items={artists.map(a => [a.id, a.name])} /><Select label="Disponibilidade" value={available} set={setAvailable} items={[['sim','Disponível'],['nao','Indisponível']]} /><Select label="Preço" value={price} set={setPrice} items={[['500','Até R$ 500'],['900','R$ 500 a R$ 900'],['901','Acima de R$ 900']]} /><Select label="Tipo" value={type} set={setType} items={types} /><button className="btn ghost full" onClick={() => { setQ(''); setCat(''); setArtist(''); setAvailable(''); setPrice(''); setType(''); }}>Limpar filtros</button></aside><section><div className="bar"><strong>{list.length} resultado(s)</strong><select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Destaques</option><option value="asc">Menor preço</option><option value="desc">Maior preço</option><option value="az">A-Z</option></select></div>{list.length ? <Grid list={list} {...props}/> : <Empty title="Nenhum resultado" text="Ajuste os filtros para encontrar novas peças." />}</section></div>
  </Page>;
}

function Product({ slug, addToCart, favorites, fav }) {
  const p = getProductBySlug(slug); if (!p) return <Page><Empty title="Produto não encontrado" text="A obra não existe no catálogo." cta="Explorar" to="/explorar" /></Page>;
  const a = getArtistById(p.artistId);
  const rel = products.filter(x => x.id !== p.id && (x.artistId === p.artistId || x.category === p.category)).slice(0, 3);
  return <Page><div className="product-detail"><div><img className="main-img" src={p.image} /><div className="gallery">{p.gallery.map(img => <img key={img} src={img}/>)}</div></div><div className="detail glass"><span>{p.category}</span><h1>{p.name}</h1><A to={`/artista/${a.slug}`} className="artist-link">{a.name} · {a.location}</A><strong className="price">{money(p.price)}</strong><p>{p.description}</p><dl><dt>Materiais</dt><dd>{p.materials}</dd><dt>Dimensões</dt><dd>{p.dimensions}</dd><dt>Status</dt><dd>{p.available ? 'Disponível' : 'Indisponível'}</dd></dl><button disabled={!p.available} className="btn dark full" onClick={() => addToCart(p)}>Adicionar ao carrinho</button><button className="btn ghost full" onClick={() => fav(p.id)}>{favorites.includes(p.id) ? 'Remover favorito' : 'Favoritar'}</button></div></div><Block tag="Relacionados" title="Continue explorando"><Grid list={rel.length ? rel : products.slice(0, 3)} addToCart={addToCart} favorites={favorites} fav={fav}/></Block></Page>;
}

function Artist(props) {
  const a = getArtistBySlug(props.slug); if (!a) return <Page><Empty title="Artista não encontrado" text="Esse perfil ainda não existe." /></Page>;
  return <Page><div className="artist-hero glass"><img src={a.image}/><div><span>Artista</span><h1>{a.name}</h1><p>{a.bio}</p><small>{a.location}</small><div className="row"><a className="btn ghost" href={a.socials.instagram}>Instagram</a><A to="/explorar" className="btn dark">Ver coleção</A></div></div></div><Block tag="Obras" title="Coleção do artista"><Grid list={getProductsByArtist(a.id)} {...props}/></Block></Page>;
}

function Cart({ cart, qty }) { const items = cart.map(i => ({...i, product: products.find(p => p.id === i.id)})).filter(i => i.product); const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0); return <Page title="Carrinho" text="Revise os itens antes do checkout.">{items.length ? <div className="cart-layout"><div className="cart-list glass">{items.map(({product, qty: q}) => <div className="cart-row" key={product.id}><img src={product.image}/><div><h3>{product.name}</h3><small>{artistName(product.artistId)}</small><strong>{money(product.price)}</strong></div><div className="qty"><button onClick={() => qty(product.id, q - 1)}><Minus size={14}/></button><span>{q}</span><button onClick={() => qty(product.id, q + 1)}><Plus size={14}/></button></div><button className="round" onClick={() => qty(product.id, 0)}><Trash2 size={16}/></button></div>)}</div><Summary subtotal={subtotal}/></div> : <Empty title="Carrinho vazio" text="Adicione obras ao carrinho para continuar." cta="Explorar obras" to="/explorar" />}</Page>; }
function Checkout({ cart, clearCart }) { const [done, setDone] = useState(false); const subtotal = cart.reduce((s, i) => s + (products.find(p => p.id === i.id)?.price || 0) * i.qty, 0); if (done) return <Page><div className="confirmed glass"><span>Pedido confirmado</span><h1>Solicitação recebida.</h1><p>Checkout simulado concluído. Pronto para integrar pagamento, frete e autenticação no futuro.</p><A to="/explorar" className="btn dark">Continuar explorando</A></div></Page>; return <Page title="Checkout" text="Formulário funcional no front-end, sem pagamento real.">{cart.length ? <form className="checkout" onSubmit={(e) => { e.preventDefault(); clearCart(); setDone(true); }}><div className="form glass"><h3>Dados do cliente</h3><input required placeholder="Nome completo"/><input required type="email" placeholder="Email"/><input required placeholder="Telefone"/><h3>Endereço</h3><input required placeholder="CEP"/><input required placeholder="Rua e número"/><input required placeholder="Cidade / Estado"/><h3>Pagamento</h3><select><option>Placeholder — pagamento será integrado depois</option></select><button className="btn dark full">Confirmar pedido</button></div><Summary subtotal={subtotal}/></form> : <Empty title="Sem itens" text="Adicione uma obra antes de finalizar." cta="Explorar" to="/explorar" />}</Page>; }
function Favorites({ favorites, addToCart, fav }) { const list = products.filter(p => favorites.includes(p.id)); return <Page title="Favoritos" text="Sua seleção privada de obras.">{list.length ? <Grid list={list} addToCart={addToCart} favorites={favorites} fav={fav}/> : <Empty title="Nenhum favorito" text="Use o coração nos cards para salvar obras." cta="Explorar obras" to="/explorar" />}</Page>; }
function About() { return <Page title="Sobre o CRIA*" text="Marketplace curado de arte, design e criação contemporânea brasileira."><div className="text-grid">{['História','Curadoria','Propósito'].map((t, i) => <div className="glass info" key={t}><h3>{t}</h3><p>{['O CRIA* nasce entre arte, design e cultura visual para conectar criadores a pessoas que buscam objetos com presença.','A seleção valoriza matéria, processo, narrativa e atmosfera, tratando cada peça como linguagem visual.','Construir uma plataforma elegante e preparada para receber produtos reais, artistas e operações futuras.'][i]}</p></div>)}</div></Page>; }
function Contact() { const [ok,setOk]=useState(false); return <Page title="Contato" text="Fale com a curadoria. Envio simulado no front-end.">{ok ? <div className="confirmed glass"><h2>Mensagem enviada.</h2><p>Simulação concluída.</p><button className="btn ghost" onClick={()=>setOk(false)}>Enviar outra</button></div> : <form className="form glass" onSubmit={(e)=>{e.preventDefault();setOk(true)}}><input required placeholder="Nome"/><input required type="email" placeholder="Email"/><textarea required placeholder="Mensagem" rows="6"/><button className="btn dark">Enviar mensagem</button><small>contato@cria.market · São Paulo, Brasil</small></form>}</Page>; }
function Auth({ mode }) { const [ok,setOk]=useState(false); const login=mode==='login'; return <section className="auth"><form className="auth-card glass" onSubmit={(e)=>{e.preventDefault();setOk(true)}}><span>CRIA*</span><h1>{login?'Entrar':'Criar conta'}</h1><p>{ok?'Estado simulado concluído.':'Acesso simulado, preparado para autenticação futura.'}</p>{!ok && <><input required type="email" placeholder="Email"/><input required type="password" placeholder="Senha"/>{!login && <input required placeholder="Nome completo"/>}<button className="btn dark full">{login?'Entrar':'Cadastrar'}</button></>}<A to={login?'/cadastro':'/login'} className="btn ghost full">{login?'Criar cadastro':'Já tenho conta'}</A></form></section>; }

function Grid({ list, addToCart, favorites = [], fav }) { return <div className="grid">{list.map(p => <article className="card" key={p.id}><A to={`/produto/${p.slug}`} className="thumb"><img src={p.image}/><span>{p.available ? 'Disponível' : 'Indisponível'}</span></A><div><h3><A to={`/produto/${p.slug}`}>{p.name}</A></h3><small>{artistName(p.artistId)} · {p.category}</small><strong>{money(p.price)}</strong><p>{p.description}</p><div className="card-actions"><button disabled={!p.available} className="btn dark" onClick={() => addToCart(p)}>{p.available ? 'Adicionar' : 'Indisponível'}</button><button className={`round ${favorites.includes(p.id) ? 'active' : ''}`} onClick={() => fav(p.id)}><Heart size={17}/></button></div></div></article>)}</div>; }
function ArtistCard({ artist }) { return <article className="artist-card"><img src={artist.image}/><div><h3>{artist.name}</h3><small>{artist.location}</small><p>{artist.bio}</p><A to={`/artista/${artist.slug}`} className="btn ghost">Ver coleção</A></div></article>; }
function Select({ label, value, set, items }) { return <label>{label}<select value={value} onChange={e => set(e.target.value)}><option value="">Todos</option>{items.map(i => Array.isArray(i) ? <option key={i[0]} value={i[0]}>{i[1]}</option> : <option key={i} value={i}>{i}</option>)}</select></label>; }
function Page({ title, text, children }) { return <section className="page">{title && <div className="page-head"><span>CRIA*</span><h1>{title}</h1><p>{text}</p></div>}{children}</section>; }
function Block({ tag, title, children }) { return <section className="block"><div className="block-head"><span>{tag}</span><h2>{title}</h2></div>{children}</section>; }
function Empty({ title, text, cta, to }) { return <div className="empty glass"><h2>{title}</h2><p>{text}</p>{cta && <A to={to} className="btn dark">{cta}</A>}</div>; }
function Summary({ subtotal }) { const shipping = subtotal ? 48 : 0; return <aside className="summary glass"><h3>Resumo</h3><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Frete placeholder</span><strong>{money(shipping)}</strong></p><p className="total"><span>Total</span><strong>{money(subtotal + shipping)}</strong></p><A to="/checkout" className="btn dark full">Finalizar compra</A></aside>; }
function Newsletter() { const [ok,setOk]=useState(false); return <section className="newsletter"><div><span>Newsletter</span><h2>Receba novas curadorias.</h2><p>Obras, artistas e coleções selecionadas pelo CRIA*.</p></div><form onSubmit={(e)=>{e.preventDefault();setOk(true)}}><input required type="email" placeholder="seu@email.com"/><button>Assinar</button>{ok && <small>Cadastro simulado realizado.</small>}</form></section>; }
function Footer() { return <footer className="footer"><div><h2>CRIA*</h2><p>Marketplace curado de arte, design e criação contemporânea brasileira.</p></div><nav><A to="/explorar">Explorar</A><A to="/sobre">Sobre</A><A to="/contato">Contato</A><A to="/login">Entrar</A></nav><small>© 2026 CRIA*. Protótipo funcional preparado para produtos reais.</small></footer>; }
